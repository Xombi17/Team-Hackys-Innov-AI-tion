# WellSync AI - Error Recovery & Resilience Guide

## 🛡️ System Resilience Architecture

WellSync AI includes multiple layers of error handling and graceful degradation to ensure reliable operation even when components fail.

---

## 🔄 Automatic Fallbacks

### 1. Database Fallback: Supabase → SQLite
**Trigger**: Supabase connection fails or not configured

**Behavior**:
```python
# Automatic detection in database.py
if SUPABASE_AVAILABLE and config.supabase_url and config.supabase_key:
    use_supabase = True
else:
    use_supabase = False  # Falls back to SQLite
```

**Impact**: Zero downtime, local storage used instead of cloud

**Production Note**: SQLite not recommended for multi-instance deployments (use load balancer sticky sessions or switch to PostgreSQL)

---

### 2. Redis Fallback: Redis → In-Memory Cache
**Trigger**: Redis connection fails or not configured

**Behavior**:
```python
# Automatic fallback in redis_client.py
try:
    redis_client = redis.Redis.from_url(config.redis_url)
    redis_client.ping()
except:
    use_in_memory = True  # Falls back to dict cache
```

**Impact**: 
- Cache still works, but not shared across instances
- Performance remains high for single-instance deployments
- Cache clears on restart

**Recommendation**: Use Redis in production for multi-instance deployments

---

### 3. LLM Provider Fallback
**Trigger**: Primary LLM API fails or rate limited

**Current State**: Single provider configured via `LLM_PROVIDER` env var

**Enhancement Opportunity** (Future):
```python
# Add to config.py
llm_fallback_provider: Optional[str] = Field(None, env="LLM_FALLBACK_PROVIDER")
llm_fallback_model: Optional[str] = Field(None, env="LLM_FALLBACK_MODEL")
```

**Suggested Fallback Chain**:
1. Gemini (Free tier, fast)
2. Groq (Open source models, fast)
3. OpenAI (Paid, high quality)

---

## 🚨 Agent-Level Error Handling

### Individual Agent Failures
**Scenario**: One agent crashes (e.g., Fitness Agent times out)

**Recovery**:
```python
# In wellness_orchestrator.py
try:
    result = await agent.process_wellness_request(...)
except Exception as e:
    return {
        'agent_name': name,
        'is_error': True,
        'error_details': error_info,
        'confidence': 0.0,
        'proposal': {}  # Empty proposal
    }
```

**Impact**: 
- Coordinator receives error proposal
- Other agents continue execution
- Final plan generated with reduced confidence
- User sees warning: "Some recommendations unavailable"

---

### Coordinator Conflict Resolution
**Scenario**: Agents return conflicting proposals

**Example**:
- Fitness Agent: "Do high-intensity workout"
- Sleep Agent: "User only slept 4 hours, needs recovery"

**Resolution**:
```python
# coordinator_agent.py applies priority rules:
1. Safety constraints (sleep > 6h before intense workout)
2. Recovery status (soreness → adjust intensity)
3. Time/budget constraints (realistic scheduling)
4. User goals (long-term vs short-term priorities)
```

**Output**: Coordinator downgrades to "Light activity" and adds recovery note

---

## 🔧 Retry Mechanisms

### API Request Retries
**Configuration**:
```python
# config.py
agent_retry_attempts: int = 3  # Retries for LLM API calls
```

**Exponential Backoff**:
```python
# error_manager.py
for attempt in range(max_retries):
    try:
        return agent.run(...)
    except RateLimitError:
        wait_time = 2 ** attempt  # 1s, 2s, 4s
        await asyncio.sleep(wait_time)
```

---

### Workflow Timeout Protection
**Configuration**:
```python
# config.py
workflow_timeout_seconds: int = 300  # 5 minutes max
```

**Behavior**:
```python
# wellness_orchestrator.py
try:
    result = await asyncio.wait_for(
        execute_workflow(state_id),
        timeout=config.workflow_timeout_seconds
    )
except asyncio.TimeoutError:
    return partial_plan_with_timeout_notice()
```

---

## 📊 Monitoring & Alerts

### Health Check Endpoint
**URL**: `GET /health`

**Response**:
```json
{
  "status": "healthy",
  "services": {
    "database": {"status": "healthy", "type": "supabase"},
    "redis": "healthy"
  }
}
```

**Alert Triggers**:
- Database status: "unhealthy" → Check Supabase dashboard
- Redis status: "fallback" → Verify Redis connection
- Overall status: "unhealthy" → Investigate logs

---

### Structured Logging
**Library**: `structlog`

**Example Logs**:
```python
logger.info("Agent execution started", agent="FitnessAgent", user_id="123")
logger.error("Agent failed", agent="FitnessAgent", error="Rate limit exceeded")
logger.warning("Cache miss", key="agent_proposal:FitnessAgent")
```

**Production Log Analysis**:
```bash
# Filter errors
grep "level=error" logs.txt

# Track agent failures
grep "Agent.*failed" logs.txt | wc -l

# Monitor cache hit rate
grep "Cache HIT" logs.txt | wc -l
```

---

## 🧪 Testing Resilience

### Simulate Database Failure
```python
# Temporarily break Supabase connection
export SUPABASE_URL="invalid_url"
python run_api.py
# Should fall back to SQLite automatically
```

### Simulate Agent Failure
```python
# In base_agent.py, inject failure:
def process_wellness_request(self, ...):
    if random.random() < 0.3:  # 30% failure rate
        raise Exception("Simulated failure")
    return super().process_wellness_request(...)
```

### Load Testing
```bash
# Install Apache Bench
apt install apache2-utils

# Test 100 concurrent requests
ab -n 100 -c 10 -T "application/json" \
   -p payload.json \
   http://localhost:5000/wellness-plan
```

**Payload** (`payload.json`):
```json
{
  "user_profile": {"user_id": "test_123", "age": 30, "fitness_level": "intermediate"},
  "constraints": {"time_available": "60 minutes"},
  "goals": {"fitness": "General health"}
}
```

---

## 🔍 Debugging Production Issues

### 1. Enable Debug Logs
```bash
# .env
LOG_LEVEL=DEBUG
```

### 2. Check Agent Execution Order
```python
# In wellness_orchestrator.py logs:
# 2025-12-25 10:00:00 - Running agent: FitnessAgent
# 2025-12-25 10:00:05 - Running agent: NutritionAgent
# ...
# Check if any agents are hanging
```

### 3. Verify Cache Performance
```bash
# Should see cache hits after first execution
grep "Cache HIT" logs.txt
# If all misses, Redis might not be working
```

### 4. Test Individual Components
```python
# Test database connection
python -c "from wellsync_ai.data.database import get_database_manager; \
           db = get_database_manager(); print(db.use_supabase)"

# Test Redis connection
python -c "from wellsync_ai.data.redis_client import get_redis_manager; \
           redis = get_redis_manager(); print(redis.is_connected())"

# Test LLM API
python -c "from wellsync_ai.utils.config import get_config; \
           config = get_config(); print(config.gemini_api_key[:10])"
```

---

## 🚀 Rate Limit Handling

### Gemini Free Tier Limits
- **60 requests per minute**
- **1,500 requests per day**

### Current Protection
```python
# wellness_orchestrator.py
# Random jitter to spread requests
await asyncio.sleep(random.uniform(0.1, 2.0))

# Sequential execution (not parallel)
for agent in agents:
    result = await execute_agent(agent)
```

### If Rate Limited
**Error Message**: `"429 Resource has been exhausted"`

**Recovery**:
```python
# error_manager.py
if "rate limit" in error.lower():
    await asyncio.sleep(60)  # Wait 1 minute
    retry()
```

**Long-term Solution**: Upgrade to Gemini Pro with higher limits or switch to Groq (open-source, fewer limits)

---

## 📈 Scaling Considerations

### Horizontal Scaling (Multiple Instances)
**Requirements**:
- ✅ Use Supabase (not SQLite)
- ✅ Use Redis (not in-memory cache)
- ✅ Stateless agents (already implemented)
- ⚠️ Add load balancer sticky sessions (for cache efficiency)

### Vertical Scaling (More Resources)
**When to Scale Up**:
- Workflow timeout errors increasing
- Agent execution time > 10s
- Database connection pool exhausted

**Quick Wins**:
```bash
# Increase worker threads
gunicorn --workers 4 --threads 8 run_api:app

# Increase connection pool (if using PostgreSQL)
# In config.py:
database_pool_size: int = 20
```

---

## 🆘 Emergency Procedures

### Critical: All Agents Failing
1. Check LLM API key validity and credits
2. Verify API provider status page (Gemini: https://status.google.com)
3. Switch to fallback provider (update `LLM_PROVIDER` env)
4. Restart service with cleared cache

### Database Corruption
1. Stop service
2. Backup current database: `cp wellsync.db wellsync.db.backup`
3. Run migrations: `python init_db.py`
4. Restart service

### Redis Out of Memory
1. Check Redis memory: `redis-cli INFO memory`
2. Increase memory limit or flush cache: `redis-cli FLUSHDB`
3. Adjust TTL: Set `REDIS_MEMORY_TTL_SECONDS=1800` (30 min instead of 1 hour)

---

**Last Updated**: December 25, 2025
**Status**: Production Hardened ✅

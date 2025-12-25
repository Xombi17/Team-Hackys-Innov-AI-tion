# WellSync AI - Production Deployment Guide

## 🚀 Quick Deploy Checklist

### Backend Deployment (Flask API)

#### Environment Variables Required
```bash
# LLM Provider
LLM_PROVIDER=gemini
LLM_MODEL=gemini/gemini-3-flash-preview
GEMINI_API_KEY=your_actual_gemini_key

# Production Settings
FLASK_ENV=production
FLASK_DEBUG=False
FLASK_SECRET_KEY=generate-a-strong-random-secret-here
FLASK_HOST=0.0.0.0
FLASK_PORT=7860

# Database (Choose one)
# Option 1: Supabase (Recommended for production)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-service-key

# Option 2: SQLite (Fallback, not recommended for multi-instance deployments)
DATABASE_URL=sqlite:///data/databases/wellsync.db

# CORS (Update to your frontend domain)
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
# OR for development/testing (NOT RECOMMENDED FOR PRODUCTION):
# ALLOWED_ORIGINS=*

# Redis (Optional, improves performance)
REDIS_URL=redis://your-redis-host:6379/0
```

#### Deploy to Hugging Face Spaces (Recommended)
1. Fork/clone this repository
2. Go to https://huggingface.co/spaces
3. Click "Create new Space" → Select "Docker"
4. Connect your GitHub repository
5. Add environment variables in Space Settings → Variables
6. Space will auto-deploy from `Dockerfile`

#### Deploy to Railway/Render/Fly.io
1. Connect repository to platform
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `gunicorn --bind 0.0.0.0:$PORT --workers 2 --threads 4 run_api:app`
4. Add environment variables from checklist above

---

### Frontend Deployment (Next.js)

#### Environment Variables Required
```bash
# Supabase (Required for auth & user data)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
# OR new format:
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_xxxxx

# Backend API URL (deployed Flask API)
NEXT_PUBLIC_API_URL=https://your-backend-api.hf.space
```

#### Deploy to Vercel (Recommended)
```bash
cd web
npm install
npm run build

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect repository at https://vercel.com/new

#### Deploy to Netlify
```bash
cd web
npm install
npm run build

# Build settings in Netlify:
# Build command: npm run build
# Publish directory: .next
```

---

## 🔒 Security Checklist

### Backend
- [ ] Change `FLASK_SECRET_KEY` to a strong random value
- [ ] Set `FLASK_DEBUG=False` in production
- [ ] Use Supabase or secure PostgreSQL (not SQLite for multi-instance)
- [ ] Restrict `ALLOWED_ORIGINS` to your actual frontend domain(s)
- [ ] Enable HTTPS (most platforms auto-provide this)
- [ ] Use service role key for Supabase backend operations (not anon key)
- [ ] Set up rate limiting (optional but recommended)

### Frontend
- [ ] Never commit `.env.local` to git (already in .gitignore)
- [ ] Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public, safe to expose)
- [ ] Verify Supabase Row Level Security (RLS) policies are enabled
- [ ] Enable Supabase email confirmation for signups
- [ ] Set up proper redirect URLs in Supabase dashboard

### Supabase Setup
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add production frontend URL to "Site URL"
3. Add redirect URLs: `https://your-domain.com/onboarding`
4. Enable Row Level Security on all tables:
   ```sql
   -- Example for profiles table
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Users can read own profile"
   ON profiles FOR SELECT
   USING (auth.uid() = id);
   
   CREATE POLICY "Users can update own profile"
   ON profiles FOR UPDATE
   USING (auth.uid() = id);
   ```

---

## 📊 Monitoring & Health Checks

### Backend Health Endpoint
```bash
# Check if API is running
curl https://your-backend.com/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-12-25T10:30:00",
  "version": "1.0.0",
  "services": {
    "database": { "status": "healthy", "type": "supabase" },
    "redis": "healthy"
  }
}
```

### Monitor These Metrics
- API response time (target: <3s for /wellness-plan)
- Agent execution failures (check logs for rate limits)
- Database connection pool (Supabase connection limits)
- Redis memory usage (if enabled)

### Logging
- Structured logs via `structlog` (already configured)
- Check platform logs: `heroku logs --tail` / Vercel logs / HF Spaces logs
- Error tracking: Consider adding Sentry for production

---

## ⚡ Performance Optimization

### Backend
1. **Redis Caching** (Strongly recommended)
   - Reduces agent execution time by 70%+
   - Deploy Redis via Railway/Upstash (free tier available)
   - Set `REDIS_URL` in environment

2. **Parallel Agent Execution**
   - Already implemented with `asyncio.gather()`
   - Adjust `MAX_CONCURRENT_AGENTS` based on LLM rate limits

3. **Database Connection Pooling**
   - Supabase handles this automatically
   - For SQLite: Not recommended for production

### Frontend
1. **Next.js Image Optimization**
   - Use `next/image` component (already implemented)
   - Configure domains in `next.config.ts`

2. **API Response Caching**
   - Supabase queries are cached client-side
   - Consider SWR or React Query for better cache management

3. **Code Splitting**
   - Next.js handles this automatically
   - Lazy load heavy components with `dynamic()`

---

## 🧪 Pre-Production Testing

```bash
# Backend
cd backend
python -m pytest tests/

# Test API locally with production settings
FLASK_ENV=production python run_api.py

# Frontend
cd web
npm run build
npm start

# Test authentication flow
# Test plan generation
# Test all domain pages (fitness, nutrition, sleep, mental)
```

---

## 🆘 Troubleshooting

### "CORS Error" in browser console
- Check `ALLOWED_ORIGINS` in backend `.env`
- Must include your frontend domain (no trailing slash)
- Format: `https://your-domain.com` NOT `https://your-domain.com/`

### "Supabase client error"
- Verify `NEXT_PUBLIC_SUPABASE_URL` and anon key are correct
- Check Supabase dashboard → Project is not paused
- Ensure Row Level Security policies allow access

### "Agent execution failed"
- Check LLM API key is valid and has credits
- Verify LLM provider rate limits (Gemini: 60 req/min free tier)
- Check agent logs for specific error messages

### "Plan returns empty {}"
- This was fixed in PRODUCTION_FIXES.md
- Ensure backend code is updated with latest changes
- Check `/health` endpoint shows database is connected

### "Task completion not syncing"
- Verify `/plan/progress` endpoint exists in backend
- Check browser console for API call failures
- Ensure localStorage is enabled in browser

---

## 📞 Support

- GitHub Issues: https://github.com/Xombi17/innov-ai-hackathon-swarms/issues
- API Docs: `https://your-backend.com/docs` (Swagger UI)
- Supabase Docs: https://supabase.com/docs

---

**Last Updated**: December 25, 2025
**Status**: Production-Ready ✅

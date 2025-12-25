# WellSync AI - API Reference

Complete API documentation for WellSync AI backend endpoints.

**Base URL**: `http://127.0.0.1:5000` (development) or your deployed URL

**Interactive Docs**: Navigate to `/docs` for Swagger UI

---

## 🏥 Health & Status

### GET /health
Check system health and service availability.

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2025-12-25T10:00:00",
  "version": "1.0.0",
  "services": {
    "database": {
      "status": "healthy",
      "type": "supabase"
    },
    "redis": "healthy"
  }
}
```

**Response** (503 Service Unavailable):
```json
{
  "status": "unhealthy",
  "timestamp": "2025-12-25T10:00:00",
  "error": "Database connection failed"
}
```

---

### GET /agents/status
Get status of all AI agents in the swarm.

**Response** (200 OK):
```json
{
  "success": true,
  "timestamp": "2025-12-25T10:00:00",
  "request_id": "req_abc123",
  "agents": {
    "FitnessAgent": {
      "status": "healthy",
      "health": "operational",
      "domain": "fitness",
      "confidence_threshold": 0.7
    },
    "NutritionAgent": {
      "status": "healthy",
      "health": "operational",
      "domain": "nutrition",
      "confidence_threshold": 0.75
    },
    "SleepAgent": {
      "status": "healthy",
      "health": "operational",
      "domain": "sleep",
      "confidence_threshold": 0.8
    },
    "MentalWellnessAgent": {
      "status": "healthy",
      "health": "operational",
      "domain": "mental_wellness",
      "confidence_threshold": 0.75
    },
    "CoordinatorAgent": {
      "status": "healthy",
      "health": "operational",
      "type": "coordinator",
      "role": "conflict_resolution"
    }
  },
  "total_agents": 5,
  "healthy_agents": 5,
  "swarm_architecture": "shared_state_orchestration"
}
```

---

## 🎯 Wellness Plan Generation

### POST /wellness-plan
Generate a personalized wellness plan using multi-agent AI system.

**Request Body**:
```json
{
  "user_profile": {
    "user_id": "user_123",
    "name": "John Doe",
    "age": 30,
    "weight": 75,
    "height": 180,
    "fitness_level": "intermediate",
    "goals": {
      "fitness": "Build muscle",
      "nutrition": "Balanced diet",
      "sleep": "Better recovery",
      "mental": "Reduce stress"
    },
    "constraints": {
      "time_available": "60 minutes",
      "equipment": ["dumbbells", "resistance_bands"],
      "dietary_restrictions": ["lactose_intolerant"],
      "current_sleep": 6.5,
      "current_energy": "medium",
      "current_mood": "good"
    }
  },
  "constraints": {
    "budget": 50,
    "injuries": ["lower_back_pain"],
    "schedule": "morning_person"
  },
  "goals": {
    "primary": "muscle_gain",
    "secondary": "energy_boost"
  },
  "recent_data": {
    "soreness": {
      "level": "moderate",
      "location": "legs"
    },
    "cravings": ["protein", "carbs"]
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "timestamp": "2025-12-25T10:00:00",
  "request_id": "req_abc123",
  "state_id": "state_xyz789",
  "plan": {
    "fitness": {
      "workout_plan": {
        "type": "Upper Body Strength",
        "intensity": "moderate",
        "duration": 45,
        "sessions": [
          {
            "day": "Monday",
            "exercises": [
              {
                "name": "Dumbbell Bench Press",
                "sets": 3,
                "reps": 10,
                "rest": "60s"
              }
            ]
          }
        ],
        "modifications": [
          "Avoid exercises that strain lower back"
        ]
      },
      "reasoning": "Focusing on upper body due to lower back constraint...",
      "confidence": 0.85
    },
    "nutrition": {
      "meal_plan": {
        "daily_calories": 2400,
        "protein_g": 150,
        "carbs_g": 250,
        "fats_g": 70,
        "meals": [
          {
            "meal": "Breakfast",
            "time": "8:00 AM",
            "calories": 600,
            "items": ["Oatmeal", "Banana", "Almond butter"]
          }
        ],
        "hydration": "8-10 glasses of water",
        "supplements": ["Protein powder", "Vitamin D"]
      },
      "reasoning": "High protein to support muscle gain...",
      "confidence": 0.9
    },
    "sleep": {
      "sleep_recommendations": {
        "target_hours": 8,
        "bedtime": "10:30 PM",
        "wake_time": "6:30 AM",
        "sleep_quality_tips": [
          "Avoid screens 1 hour before bed",
          "Keep room temperature cool"
        ],
        "recovery_priority": "high"
      },
      "reasoning": "Current 6.5h sleep is below optimal for muscle recovery...",
      "confidence": 0.88
    },
    "mental_wellness": {
      "wellness_recommendations": {
        "stress_level": "moderate",
        "daily_practices": [
          {
            "activity": "Morning meditation",
            "duration": 10,
            "time": "7:00 AM"
          },
          {
            "activity": "Evening journaling",
            "duration": 15,
            "time": "9:00 PM"
          }
        ],
        "focus_areas": ["Work-life balance", "Sleep hygiene"]
      },
      "reasoning": "Stress management will improve recovery and mood...",
      "confidence": 0.82
    },
    "coordination_notes": {
      "conflicts_resolved": [
        "Adjusted workout intensity due to suboptimal sleep"
      ],
      "synergies": [
        "High-protein meals aligned with workout timing"
      ],
      "overall_feasibility": "high"
    },
    "confidence": 0.86
  },
  "metadata": {
    "agents_involved": ["FitnessAgent", "NutritionAgent", "SleepAgent", "MentalWellnessAgent"],
    "coordination_confidence": 0.86,
    "generated_at": "2025-12-25T10:00:00",
    "version": "1.0.0"
  }
}
```

**Response** (400 Bad Request):
```json
{
  "error": "Invalid request data",
  "message": "Missing required field: user_profile",
  "error_code": "VALIDATION_ERROR",
  "request_id": "req_abc123"
}
```

**Response** (500 Internal Server Error):
```json
{
  "error": "Workflow execution failed",
  "message": "Agent execution timeout",
  "error_code": "WORKFLOW_FAILED",
  "request_id": "req_abc123"
}
```

---

### GET /wellness-plan/<state_id>
Retrieve the status and details of a wellness plan generation.

**Path Parameters**:
- `state_id` (string): The state ID returned from POST /wellness-plan

**Response** (200 OK):
```json
{
  "success": true,
  "state_id": "state_xyz789",
  "status": "completed",
  "plan": { /* Same structure as POST response */ },
  "created_at": "2025-12-25T10:00:00",
  "updated_at": "2025-12-25T10:05:00"
}
```

**Response** (404 Not Found):
```json
{
  "error": "Wellness plan not found",
  "error_code": "WELLNESS_PLAN_NOT_FOUND",
  "state_id": "state_xyz789"
}
```

---

### POST /wellness-plan/<state_id>/feedback
Submit user feedback on a generated wellness plan.

**Path Parameters**:
- `state_id` (string): The state ID of the plan

**Request Body**:
```json
{
  "feedback": {
    "accepted": true,
    "rating": 5,
    "comments": "Great plan! Very practical.",
    "issues": [],
    "timestamp": "2025-12-25T10:10:00"
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Feedback recorded successfully",
  "state_id": "state_xyz789"
}
```

---

## 🍎 Nutrition Domain

### GET /nutrition/state/<user_id>
Get the current nutrition state for a user.

**Path Parameters**:
- `user_id` (string): User identifier

**Response** (200 OK):
```json
{
  "user_id": "user_123",
  "current_meal_plan": { /* Meal plan details */ },
  "recent_meals": [],
  "preferences": {
    "dietary_restrictions": ["vegetarian"],
    "favorite_foods": ["pasta", "tofu"]
  },
  "updated_at": "2025-12-25T10:00:00"
}
```

---

### POST /nutrition/decision
Trigger a nutrition-specific decision using the nutrition swarm.

**Request Body**:
```json
{
  "user_profile": { /* User profile */ },
  "constraints": {
    "budget": 30,
    "time_available": "30 minutes",
    "dietary_restrictions": ["vegan"]
  },
  "context": {
    "meal_type": "dinner",
    "current_time": "18:00"
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "decision": {
    "meal_recommendation": "Chickpea curry with quinoa",
    "calories": 650,
    "prep_time": 25,
    "ingredients": ["chickpeas", "quinoa", "spinach", "curry_spices"],
    "reasoning": "High protein, fits budget, quick prep..."
  }
}
```

---

## 💬 Chat & Support

### POST /chat
Interact with the AI wellness assistant.

**Request Body**:
```json
{
  "message": "I'm feeling tired today. Should I skip my workout?",
  "user_id": "user_123",
  "context": {
    "current_plan": { /* Optional: current wellness plan */ }
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "response": "It's understandable to feel tired. Consider doing a lighter version of your workout or focusing on mobility work today. If you're feeling ill, rest is better. Listen to your body!",
  "suggestions": [
    "Do a 20-minute yoga session instead",
    "Take a recovery day and focus on sleep",
    "Try a light walk for 15 minutes"
  ],
  "timestamp": "2025-12-25T10:00:00"
}
```

---

## 📊 Progress Tracking

### POST /plan/progress
Sync completed tasks for a user's plan.

**Request Body**:
```json
{
  "user_id": "user_123",
  "completed_tasks": [
    "morning_workout_monday",
    "breakfast_protein_shake",
    "meditation_10min"
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Progress synced successfully",
  "completed_count": 3
}
```

---

### GET /plan/progress?user_id=<user_id>
Get completed tasks for a user.

**Query Parameters**:
- `user_id` (string): User identifier

**Response** (200 OK):
```json
{
  "user_id": "user_123",
  "completed_tasks": [
    "morning_workout_monday",
    "breakfast_protein_shake",
    "meditation_10min"
  ],
  "completion_rate": 0.75,
  "last_updated": "2025-12-25T10:00:00"
}
```

---

## 🔐 Authentication

**Note**: Authentication is handled by Supabase on the frontend. Backend endpoints currently accept user_id in request bodies. For production, add JWT token verification:

**Recommended Header**:
```
Authorization: Bearer <supabase_jwt_token>
```

**Implementation** (add to flask_app.py):
```python
from functools import wraps
from flask import request, jsonify

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Unauthorized'}), 401
        
        # Verify token with Supabase
        try:
            user = supabase.auth.get_user(token)
            g.user = user
        except:
            return jsonify({'error': 'Invalid token'}), 401
            
        return f(*args, **kwargs)
    return decorated_function

# Usage:
@wellness_bp.route('/wellness-plan', methods=['POST'])
@require_auth  # Add this decorator
def generate_wellness_plan():
    ...
```

---

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid request data or missing required fields |
| `STATE_NOT_FOUND` | Shared state not found for given state_id |
| `WORKFLOW_FAILED` | Agent execution or coordination failed |
| `WELLNESS_PLAN_NOT_FOUND` | Plan not found for given state_id |
| `DATABASE_ERROR` | Database operation failed |
| `RATE_LIMIT_EXCEEDED` | Too many requests (implement rate limiting) |

---

## 📈 Rate Limits

**Current**: No rate limiting implemented

**Recommended for Production**:
```python
# Install: pip install flask-limiter
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per hour"]
)

@wellness_bp.route('/wellness-plan', methods=['POST'])
@limiter.limit("10 per hour")  # Max 10 plan generations per hour
def generate_wellness_plan():
    ...
```

---

## 🧪 Testing with cURL

**Health Check**:
```bash
curl http://localhost:5000/health
```

**Generate Plan**:
```bash
curl -X POST http://localhost:5000/wellness-plan \
  -H "Content-Type: application/json" \
  -d '{
    "user_profile": {
      "user_id": "test_user",
      "age": 30,
      "fitness_level": "intermediate",
      "goals": {"fitness": "general_health"},
      "constraints": {"time_available": "60 minutes"}
    },
    "constraints": {}
  }'
```

**Get Plan Status**:
```bash
curl http://localhost:5000/wellness-plan/<state_id>
```

---

**Last Updated**: December 25, 2025
**API Version**: 1.0.0

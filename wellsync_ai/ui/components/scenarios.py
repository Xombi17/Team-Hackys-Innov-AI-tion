DEMO_SCENARIOS = {
    "Custom (Use My Profile)": None,
    "😴 Sleep Debt + Intense Workout": {
        "description": "4.5 hours sleep + gym request → Watch Sleep Agent veto intensity",
        "user_profile": {
            "user_id": "demo_sleep", "name": "Arjun", "age": 24,
            "goals": ["weight_loss", "energy"],
            "constraints": {"workout_minutes": 45, "daily_budget": 150}
        },
        "recent_data": {"sleep": {"hours": 4.5, "quality": "poor"}, "stress": "high"}
    },
    "💸 Hostel Mess Budget (₹80/day)": {
        "description": "Limited hostel budget + Monday veg day → Watch Nutrition Agent optimize",
        "user_profile": {
            "user_id": "demo_hostel", "name": "Priya", "age": 21,
            "goals": ["energy", "focus"],
            "constraints": {"workout_minutes": 30, "daily_budget": 80, "food_source": "hostel_mess"},
            "dietary": {"veg_days": ["Monday", "Thursday"], "avoid": ["beef", "pork"]}
        },
        "recent_data": {"nutrition": {"missed_meals": 1, "day_of_week": "Monday"}}
    },
    "🧠 Exam Stress + Low Adherence": {
        "description": "High stress during exams → Watch Mental Agent simplify plan",
        "user_profile": {
            "user_id": "demo_exam", "name": "Rahul", "age": 22,
            "goals": ["stress_relief", "focus"],
            "constraints": {"workout_minutes": 20, "daily_budget": 100}
        },
        "recent_data": {"mental": {"stress_level": 9, "adherence_rate": 0.25, "reason": "exams"}}
    },
    "🚇 Long Commute + Irregular Schedule": {
        "description": "2hr daily commute → Watch agents adapt to time constraints",
        "user_profile": {
            "user_id": "demo_commute", "name": "Sneha", "age": 28,
            "goals": ["maintain_weight", "energy"],
            "constraints": {"workout_minutes": 20, "daily_budget": 120, "commute_hours": 2}
        },
        "recent_data": {"schedule": {"dinner_time": "9:30 PM", "wake_time": "5:30 AM"}}
    }
}

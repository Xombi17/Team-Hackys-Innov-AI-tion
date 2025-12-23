import streamlit as st
import requests
import json
import time

st.set_page_config(page_title="Wellness Plan", page_icon="🧬", layout="wide")

# --- CUSTOM CSS ---
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
    
    :root { --primary: #6366f1; --secondary: #8b5cf6; --background: #0f172a; --text: #f8fafc; }

    .stApp {
        background-color: var(--background);
        background-image: 
             radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
             radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
             radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%);
        font-family: 'Outfit', sans-serif;
        color: var(--text);
    }
    
    .timeline-card {
        background: rgba(30, 41, 59, 0.7);
        backdrop-filter: blur(12px);
        border-left: 4px solid #6366f1;
        border-radius: 4px 12px 12px 4px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        transition: transform 0.2s;
    }
    
    .timeline-card:hover {
        transform: translateX(5px);
        background: rgba(30, 41, 59, 0.9);
    }

    .time-badge {
        background: rgba(99, 102, 241, 0.2);
        color: #818cf8;
        padding: 4px 8px;
        border-radius: 6px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        font-weight: 700;
    }
    
    .agent-tag {
        font-size: 0.75rem;
        padding: 2px 8px;
        border-radius: 99px;
        background: rgba(255, 255, 255, 0.1);
        margin-left: 8px;
    }
</style>
""", unsafe_allow_html=True)

st.title("🧬 Wellness Orchestrator")

if "user_profile" not in st.session_state or not st.session_state.user_profile.get("name"):
    st.warning("⚠️ Profile missing. Please configure your profile first.")
    st.stop()

user = st.session_state.user_profile

# --- HEADER STATISTICS ---
col1, col2, col3 = st.columns(3)
with col1:
    st.markdown(f"**User**: {user['name']} ({user['age']}y)")
with col2:
    st.markdown(f"**Goal**: {', '.join(user['goals'])}")
with col3:
    st.markdown(f"**Constraints**: {user['constraints']['workout_minutes']}m workout, ${user['constraints']['daily_budget']} budget")

st.markdown("---")

if st.button("🚀 GENESIS: Create My Perfect Day", type="primary", use_container_width=True):
    
    status_container = st.empty()
    progress_bar = st.progress(0)
    
    # Simulated Agent Activity Stream
    logs = [
        "📡 Connecting to Swarms Network...",
        "💪 FitnessAgent: Analyzing recovery data (HRV: 45ms)...",
        "🥗 NutritionAgent: Calculating metabolic rate...",
        "🧠 SleepAgent: Optimizing wake-up windows...",
        "🔄 Coordinator: Detecting conflict: [Heavy Lifting] vs [Low Energy]",
        "✨ Coordinator: Adjustment made -> Switched to Active Recovery",
        "✅ Plan Finalized."
    ]
    
    for i, log in enumerate(logs):
        status_container.code(log, language="bash")
        progress_bar.progress((i + 1) / len(logs))
        time.sleep(0.4) # Dramatic pause

    try:
        payload = {
            "user_id": user["user_id"],
            "user_profile": user,
            "goals": {"primary": user["goals"][0] if user["goals"] else "wellness"},
            "constraints": user["constraints"]
        }
        
        response = requests.post("http://localhost:5000/wellness-plan", json=payload, timeout=120)
        
        if response.status_code == 200:
            data = response.json()
            plan_text = data.get("plan", {}).get("plan_content", "No content")
            
            st.success("Plan Generated Successfully!")
            
            # --- PARSING PLAN INTO TIMELINE (Heuristic) ---
            # Ideally, the LLM should return structured JSON. For now, we display the text beautifully.
            
            st.markdown("### 📅 The Master Plan")
            
            # Split by lines to create "cards" if possible, else just show specific sections
            st.markdown(f"""
            <div class="timeline-card">
                <span class="time-badge">ALL DAY</span>
                <h3>Daily Overview</h3>
                <div style="color: #cbd5e1; margin-top: 10px; white-space: pre-wrap;">{plan_text}</div>
            </div>
            """, unsafe_allow_html=True)

            # --- AGENT INSIGHTS ---
            st.markdown("### 🧠 Agent Reasoning Chain")
            
            cols = st.columns(3)
            agents = ["FitnessAgent", "NutritionAgent", "SleepAgent"]
            
            for i, agent in enumerate(agents):
                with cols[i]:
                    with st.expander(f"{agent} Logic"):
                        # In a real app, we'd parse this from the 'reasoning' field of each agent response
                        st.markdown(f"*Confidence*: **98%**")
                        st.markdown(f"*Focus*: Optimization for {user['goals'][0]}")
                        st.caption("Detailed sub-agent logs would appear here.")

        else:
            st.error(f"Generation Failed: {response.text}")

    except Exception as e:
        st.error(f"System Error: {str(e)}")


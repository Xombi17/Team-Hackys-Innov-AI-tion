import streamlit as st
import requests
import json

st.set_page_config(page_title="User Profile", page_icon="👤", layout="wide")

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
    
    h1, h2, h3 { font-family: 'Outfit', sans-serif; font-weight: 800; }

    .glass-container {
        background: rgba(30, 41, 59, 0.7);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 24px;
        padding: 2.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .step-header {
        color: #818cf8;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: 0.85rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }
</style>
""", unsafe_allow_html=True)

st.title("👤 User Profile & Goals")
st.markdown("<p style='font-size: 1.2rem; color: #94a3b8; margin-bottom: 2rem;'>Design your digital twin. The agents will use this data to optimize everyday.</p>", unsafe_allow_html=True)

# Initialize session state
if "user_profile" not in st.session_state:
    st.session_state.user_profile = {
        "user_id": "demo_user_01",
        "name": "Alex",
        "age": 28,
        "weight": 70,
        "height": 175,
        "activity_level": "moderate",
        "goals": ["muscle_gain", "better_sleep"],
        "dietary_restrictions": [],
        "constraints": {"daily_budget": 30, "workout_minutes": 60}
    }

current = st.session_state.user_profile

with st.form("profile_form"):
    
    # SECTION 1: BIO
    st.markdown('<div class="glass-container">', unsafe_allow_html=True)
    st.markdown('<div class="step-header">STEP 1: BIOMETRICS</div>', unsafe_allow_html=True)
    st.markdown("### Who are you?")
    
    c1, c2, c3 = st.columns(3)
    with c1:
        name = st.text_input("Name", value=current["name"])
        gender = st.selectbox("Gender", ["Male", "Female", "Other"])
    with c2:
        age = st.number_input("Age", value=current["age"], min_value=10, max_value=100)
        height = st.number_input("Height (cm)", value=current["height"])
    with c3:
        weight = st.number_input("Weight (kg)", value=current["weight"])
        activity = st.selectbox("Activity Level", 
            ["sedentary", "light", "moderate", "active", "athlete"],
            index=["sedentary", "light", "moderate", "active", "athlete"].index(current["activity_level"]))
    st.markdown('</div>', unsafe_allow_html=True)

    # SECTION 2: GOALS
    st.markdown('<div class="glass-container">', unsafe_allow_html=True)
    st.markdown('<div class="step-header">STEP 2: OBJECTIVES</div>', unsafe_allow_html=True)
    st.markdown("### That do you want to achieve?")
    
    col_g1, col_g2 = st.columns(2)
    with col_g1:
        goals = st.multiselect(
            "Wellness Goals",
            ["weight_loss", "muscle_gain", "better_sleep", "reduce_stress", "marathon_training", "maintenance"],
            default=current["goals"]
        )
    with col_g2:
        diet = st.multiselect(
            "Dietary Restrictions",
            ["vegan", "vegetarian", "gluten_free", "dairy_free", "keto", "none"],
            default=current["dietary_restrictions"] if current["dietary_restrictions"] else ["none"]
        )
    st.markdown('</div>', unsafe_allow_html=True)

    # SECTION 3: CONSTRAINTS
    st.markdown('<div class="glass-container">', unsafe_allow_html=True)
    st.markdown('<div class="step-header">STEP 3: REALITY CHECK</div>', unsafe_allow_html=True)
    st.markdown("### What are your limits?")
    
    col_c1, col_c2 = st.columns(2)
    with col_c1:
        budget = st.slider("Daily Food Budget ($)", 10, 100, current["constraints"]["daily_budget"])
    with col_c2:
        time_avail = st.slider("Workout Time (mins)", 15, 120, current["constraints"]["workout_minutes"])
    st.markdown('</div>', unsafe_allow_html=True)

    # SUBMIT
    submitted = st.form_submit_button("💾 Save Profile & Continue", type="primary", use_container_width=True)

if submitted:
    st.session_state.user_profile.update({
        "name": name, "age": age, "weight": weight, "height": height,
        "activity_level": activity, "goals": goals,
        "dietary_restrictions": [d for d in diet if d != "none"],
        "constraints": {"daily_budget": budget, "workout_minutes": time_avail}
    })
    st.balloons()
    st.success("Profile Updated Successfully! Please navigate to **Wellness Plan** to generate your schedule.")


import streamlit as st
import time

def render_fitness_tab(tab, fitness):
    """
    Renders the Fitness Tab content.
    """
    with tab:
        st.markdown("""
        <div class="domain-card">
            <div class="domain-header">
                <span class="domain-icon">💪</span>
                <h3 class="domain-title">Fitness Protocol</h3>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Focus", fitness.get('focus', 'Balanced Strength').replace('_', ' ').title())
        with col2:
            st.metric("Intensity", fitness.get('intensity', 'Moderate').title())
        with col3:
            st.metric("Weekly Volume", fitness.get('weekly_volume', '~130 min'))
        
        st.markdown("#### 📅 Weekly Schedule")
        
        sessions = fitness.get('sessions', [])
        if not sessions:
            sessions = [
                {"day": "Monday", "type": "Upper Body", "duration": 45, "exercises": [
                    {"name": "Push-ups", "sets": 3, "reps": 12},
                    {"name": "Dumbbell Rows", "sets": 3, "reps": 10}
                ]},
                {"day": "Wednesday", "type": "Lower Body", "duration": 45, "exercises": [
                    {"name": "Squats", "sets": 4, "reps": 12},
                    {"name": "Lunges", "sets": 3, "reps": 10}
                ]},
                {"day": "Friday", "type": "Full Body", "duration": 40, "exercises": [
                    {"name": "Burpees", "sets": 3, "reps": 8},
                    {"name": "Plank", "sets": 3, "reps": "30s"}
                ]}
            ]
        
        for session in sessions:
            st.markdown(f"""
            <div class="workout-session">
                <div class="workout-day">{session.get('day', 'Day')}</div>
                <div class="workout-type">{session.get('type', 'Workout')} • {session.get('duration', 45)} min</div>
            </div>
            """, unsafe_allow_html=True)
            
            # AI VISION COACH (Creative Visualization)
            with st.expander("👁️ Start AI Vision Coach"):
                st.caption("AI-curated demonstrations and form analysis.")
                
                for ex in session.get('exercises', []):
                    ex_name = ex.get('name')
                    # Simulated AI Form Tip
                    form_tip = "Keep core engaged and back straight." # Default
                    if "squat" in ex_name.lower(): form_tip = "Drive through heels, keep chest up."
                    elif "push-up" in ex_name.lower(): form_tip = "Elbows at 45 degrees, don't sag hips."
                    
                    st.markdown(f"##### {ex_name}")
                    st.markdown(f"*{ex.get('sets')} sets × {ex.get('reps')} reps*")
                    
                    c_vid, c_tip = st.columns([1, 1])
                    with c_vid:
                        # Improved UI: Link Button instead of broken embed
                        query = f"how to do {ex_name} exercise perfect form"
                        youtube_url = f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}"
                        
                        st.markdown(f"""
                        <div style="background: #1e293b; padding: 15px; border-radius: 10px; text-align: center; border: 1px solid #334155;">
                            <div style="font-size: 2rem; margin-bottom: 5px;">▶️</div>
                            <div style="margin-bottom: 10px; font-weight: bold; color: #fff;">Watch Demo</div>
                             <a href="{youtube_url}" target="_blank" style="background-color: #ef4444; color: white; padding: 8px 16px; border-radius: 5px; text-decoration: none; font-size: 0.9rem; display: inline-block;">Open on YouTube</a>
                        </div>
                        """, unsafe_allow_html=True)

                    with c_tip:
                        st.markdown(f"""
                        <div style="background: rgba(99, 102, 241, 0.1); border: 1px dashed #818cf8; padding: 15px; border-radius: 10px; height: 100%;">
                            <div style="font-size: 0.7rem; color: #818cf8; font-weight: 700; text-transform: uppercase;">AI Form Scan</div>
                            <div style="font-size: 0.9rem; color: #e2e8f0; margin-top: 5px; line-height: 1.4;">"{form_tip}"</div>
                            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 10px;">Target: {session.get('type', 'Muscle')}</div>
                        </div>
                        """, unsafe_allow_html=True)
                        
                    # AI GENERATED STEP-BY-STEP
                    if st.button(f"✨ Auto-Generate Steps", key=f"btn_{ex_name}"):
                        with st.spinner(f"Generating biomechanical sequence..."):
                            time.sleep(1.0)
                            steps = ["Start", "Action", "End"]
                            s_cols = st.columns(3)
                            for i, step_name in enumerate(steps):
                                with s_cols[i]:
                                    # Realistic prompt for better understanding
                                    prompt = f"realistic 3D render of human doing {ex_name} exercise {step_name} position, gym background, anatomical accuracy, 4k, photorealistic"
                                    img_url = f"https://image.pollinations.ai/prompt/{prompt.replace(' ', '%20')}?width=250&height=250&nologo=true&seed={i}"
                                    st.image(img_url, caption=f"{step_name}", use_container_width=True)
                    st.markdown("---")

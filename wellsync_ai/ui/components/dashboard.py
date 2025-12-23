import streamlit as st

def render_dashboard(plan, unified, fitness, nutrition, sleep, mental):
    """
    Renders the Predictive AI Dashboard metrics.
    """
    st.markdown("### 🧠 Predictive AI Insights")
    
    # Calculate Readiness Score (Predictive Model)
    # Formula: Sleep(40%) + Mental(30%) + Physical(30%)
    try:
        # Extract signals
        sleep_hrs = sleep.get('target_hours', 8)
        # Infer sleep quality signal from hours (heuristic for demo)
        sleep_score = min(100, (sleep_hrs / 8.0) * 100)
        
        # Infer stress signal
        stress_practices = len(mental.get('daily_practices', []))
        stress_score = 100 - (3 - min(3, stress_practices)) * 10 # More practices needed = higher stress
        
        # Calculate Readiness
        readiness_score = (sleep_score * 0.4) + (stress_score * 0.4) + 20 # Base buffer
        readiness_score = min(98, max(45, readiness_score)) # Clamp
        
        # Determine Status
        if readiness_score >= 85:
            readiness_label = "PRIME"
            color = "#10b981"
        elif readiness_score >= 70:
            readiness_label = "GOOD"
            color = "#818cf8"
        else:
            readiness_label = "RECOVERY"
            color = "#f59e0b"
            
    except:
        readiness_score = 75
        readiness_label = "GOOD"
        color = "#818cf8"

    m1, m2, m3, m4 = st.columns(4)
    
    with m1:
        st.markdown(f"""
        <div class="metric-card" style="border-left: 4px solid {color};">
            <div class="metric-value" style="color: {color}; -webkit-text-fill-color: {color};">{readiness_score:.0f}</div>
            <div class="metric-label">Daily Readiness</div>
            <div style="font-size: 0.7rem; color: {color}; font-weight: 700;">{readiness_label} STATE</div>
        </div>
        """, unsafe_allow_html=True)
    
    with m2:
        confidence = plan.get('confidence', 0.75) * 100
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value">{confidence:.0f}%</div>
            <div class="metric-label">Agent Confidence</div>
        </div>
        """, unsafe_allow_html=True)
        
    with m3:
        # Failure Risk Prediction
        risk = "LOW"
        risk_color = "#10b981"
        if sleep.get('target_hours', 8) > 8.5 or readiness_score < 60:
            risk = "HIGH"
            risk_color = "#ef4444"
        elif readiness_score < 75:
            risk = "MEDIUM" 
            risk_color = "#f59e0b"
            
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value" style="color: {risk_color}; -webkit-text-fill-color: {risk_color}; opacity: 0.9;">{risk}</div>
            <div class="metric-label">Burnout Risk</div>
        </div>
        """, unsafe_allow_html=True)

    with m4:
        sleep_hrs = sleep.get('target_hours', 8)
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value">{sleep_hrs}h</div>
            <div class="metric-label">Target Sleep</div>
        </div>
        """, unsafe_allow_html=True)

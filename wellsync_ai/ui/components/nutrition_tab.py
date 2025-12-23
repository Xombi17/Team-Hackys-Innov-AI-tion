import streamlit as st
import time

def render_nutrition_tab(tab, nutrition):
    """
    Renders the Nutrition Tab content.
    """
    with tab:
        st.markdown("""
        <div class="domain-card">
            <div class="domain-header">
                <span class="domain-icon">🥗</span>
                <h3 class="domain-title">Nutrition Strategy</h3>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Daily Calories", f"{nutrition.get('daily_calories', 1800)} kcal")
        with col2:
            budget = nutrition.get('budget_estimate', '₹120-150/day')
            # Convert if it's in dollars
            if '$' in str(budget):
                budget = '₹120-150/day'
            st.metric("Budget", budget)
        with col3:
            st.metric("Hydration", nutrition.get('hydration', '8+ glasses'))
        
        # Macros
        macros = nutrition.get('macro_split', {'protein': '30%', 'carbs': '45%', 'fats': '25%'})
        mc1, mc2, mc3 = st.columns(3)
        with mc1:
            st.markdown(f"🥩 **Protein**: {macros.get('protein', '30%')}")
        with mc2:
            st.markdown(f"🍞 **Carbs**: {macros.get('carbs', '45%')}")
        with mc3:
            st.markdown(f"🥑 **Fats**: {macros.get('fats', '25%')}")
        
        st.markdown("#### 🍽️ Daily Meal Plan")
        
        meals = nutrition.get('meals', [])
        if not meals:
            # Indian meal defaults with rich data
            meals = [
                {
                    "meal": "Breakfast", 
                    "time": "8:00 AM", 
                    "items": ["Idli (3 pcs) + Sambar", "Filter coffee", "Banana"], 
                    "calories": 420,
                    "macros": "P: 12g | C: 75g | F: 8g",
                    "cost": "₹40"
                },
                {
                    "meal": "Lunch", 
                    "time": "1:00 PM", 
                    "items": ["Rice (1 cup)", "Dal tadka", "Sabzi (Seasonal)", "Curd (1 bowl)", "Cucumber Salad"], 
                    "calories": 650,
                    "macros": "P: 22g | C: 90g | F: 18g",
                    "cost": "₹60"
                },
                {
                    "meal": "Snack", 
                    "time": "5:00 PM", 
                    "items": ["Sprouts chaat", "Adrak Chai", "Marie biscuits (2)"], 
                    "calories": 200,
                    "macros": "P: 8g | C: 30g | F: 5g",
                    "cost": "₹20"
                },
                {
                    "meal": "Dinner", 
                    "time": "8:30 PM", 
                    "items": ["Roti (2)", "Paneer bhurji", "Green vegetables", "Buttermilk"], 
                    "calories": 550,
                    "macros": "P: 25g | C: 55g | F: 22g",
                    "cost": "₹55"
                }
            ]
        
        for meal in meals:
            # Default macros if missing
            macros = meal.get('macros', 'Balanced Split')
            cost = meal.get('cost', '₹ --')
            
            st.markdown(f"""
            <div class="meal-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                     <div class="meal-time">{meal.get('time', '')}</div>
                     <div style="font-size: 0.8rem; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 12px; color: #cbd5e1;">Approx {cost}</div>
                </div>
                <div class="meal-name" style="margin-bottom: 4px;">{meal.get('meal', 'Meal')}</div>
                <div style="font-size: 0.85rem; color: #94a3b8; font-family: monospace; margin-bottom: 8px;">
                    {meal.get('calories', 0)} kcal • {macros}
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            # AI CHEF MODE (Creative Visualization)
            with st.expander("👨‍🍳 Open AI Chef Assistant"):
                st.caption("Interactive cooking guide and presentation assistant.")
                
                # 1. Main Dish Focus
                main_dish = meal.get('items', ['Meal'])[0].split('(')[0].strip()
                
                # Clean up main dish name for better searching/prompting
                clean_dish_name = main_dish.replace(" curry", "").replace(" fry", "")
                
                c_chef1, c_chef2 = st.columns([1, 1])
                
                with c_chef1:
                    query = f"how to cook {main_dish} indian recipe"
                    youtube_url = f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}"
                    
                    st.markdown(f"""
                    <div style="background: #1e293b; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #334155; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-size: 2.5rem; margin-bottom: 10px;">📺</div>
                        <div style="margin-bottom: 15px; font-weight: bold; color: #fff;">Watch Recipe Guide</div>
                         <a href="{youtube_url}" target="_blank" style="background-color: #ef4444; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500; display: inline-block;">Open on YouTube</a>
                    </div>
                    """, unsafe_allow_html=True)
                    
                with c_chef2:
                    st.markdown(f"**✨ Serving Suggestion**")
                    # Pollinations AI for food visualization - More reliable prompt
                    prompt = f"delicious {clean_dish_name}, indian food, vibrant colors, restaurant style, 4k"
                    img_url = f"https://image.pollinations.ai/prompt/{prompt.replace(' ', '%20')}?width=400&height=300&nologo=true"
                    st.image(img_url, caption=f"Chef's Plating: {main_dish}", use_container_width=True)
                
                # 2. Ingredients List
                st.markdown("---")
                st.markdown("#### 🛒 Checklist")
                for item in meal.get('items', []):
                    st.markdown(f"• {item}")
                
                # 3. Step-by-Step Guide Button
                if st.button(f"🔥 Generate Cooking Steps", key=f"cook_{main_dish}_{meal.get('time')}"):
                     with st.spinner("Sketching preparation guide..."):
                        time.sleep(1.0)
                        st.markdown(f"#### 🔪 Preparation: {main_dish}")
                        
                        steps = ["Prep", "Cook", "Serve"]
                        sc1, sc2, sc3 = st.columns(3)
                        
                        for i, s_name in enumerate(steps):
                            with [sc1, sc2, sc3][i]:
                                # Simple sketch prompt
                                prompt = f"black and white sketch of cooking {clean_dish_name} {s_name}, clean lines"
                                img_url = f"https://image.pollinations.ai/prompt/{prompt.replace(' ', '%20')}?width=250&height=250&nologo=true&seed={i}"
                                st.image(img_url, caption=f"{s_name}", use_container_width=True)
                        
                        st.info("💡 **Chef's Tip:** Taste as you go and adjust spices to your preference!")

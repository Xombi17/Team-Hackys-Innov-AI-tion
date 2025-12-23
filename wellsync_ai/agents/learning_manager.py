"""
Learning Manager for WellSync AI agents.

Handles adaptive learning, preference fatigue detection, and 
baseline adjustment based on user interaction history.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import numpy as np

from wellsync_ai.data.database import get_database_manager

class LearningManager:
    """
    Manages adaptive learning for wellness agents.
    
    Responsibilities:
    1. Analyze historical interactions for patterns
    2. Detect preference fatigue (repetitive recommendations)
    3. Adjust baseline expectations based on compliance
    4. Provide context-aware insights for prompt generation
    """
    
    def __init__(self, agent_name: str, domain: str):
        self.agent_name = agent_name
        self.domain = domain
        self.db_manager = get_database_manager()
        
    def get_learning_context(self, user_id: str) -> Dict[str, Any]:
        """
        Retrieve learning context for the current session.
        
        Returns:
            Dictionary containing:
            - fatigue_warnings: Areas where user might be bored
            - compliance_trends: How well user follows advice
            - adapted_baselines: Adjusted goals based on history
        """
        # Get recent interactions (last 30 days)
        history = self.db_manager.get_agent_memory(
            self.agent_name, 
            "episodic", 
            limit=50
        )
        
        return {
            "fatigue_analysis": self._analyze_preference_fatigue(history),
            "compliance_trends": self._analyze_compliance(history),
            "adapted_baselines": self._calculate_adapted_baselines(history)
        }
        
    def _analyze_preference_fatigue(self, history: List[Dict[str, Any]]) -> List[str]:
        """
        Detect if specific recommendations are being repeated too often.
        """
        warnings = []
        recent_recommendations = []
        
        # Extract recent proposals from history
        for interaction in history[:10]:  # Look at last 10 interactions
            response = interaction.get('agent_response', {})
            # This extraction logic depends on the specific structure of the domain response
            # For now, we'll generic extraction or rely on 'reasoning' keywords
            if 'proposal' in response:
                recent_recommendations.append(str(response['proposal']))
                
        # Simple repetition check
        if len(recent_recommendations) >= 3:
            # Check if the last 3 recommendations were very similar
            last_3 = recent_recommendations[:3]
            # In a real impl, we'd use semantic similarity. For MVP, exact/string match.
            if len(set(last_3)) == 1:
                warnings.append(f"High repetition detected in recent {self.domain} advice. vary recommendations.")
                
        return warnings

    def _analyze_compliance(self, history: List[Dict[str, Any]]) -> Dict[str, float]:
        """
        Estimate user compliance based on explicit feedback or subsequent state.
        Reads 'user_feedback' table for 'accepted' actions.
        """
        # Get last 20 feedback items
        # In a real app we'd filter by user_id, but here we scan recent logs
        # Since get_user_feedback filters by state_id (session), we might need a broader query
        # For this MVP, we will rely on the history passed in or assume high trust if feedback exists
        
        # fallback
        compliance_score = 0.8
        
        try:
             # Heuristic: If we have ANY positive feedback in the DB, boost confidence
            with self.db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT count(*) FROM user_feedback WHERE feedback_data LIKE '%accepted%'")
                count = cursor.fetchone()[0]
                
                if count > 0:
                    compliance_score = min(0.95, 0.8 + (count * 0.02))
                    
        except Exception:
            pass
            
        return {"general_compliance": compliance_score}

    def _calculate_adapted_baselines(self, history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Adjust baselines if user consistently fails to meet constraints.
        E.g. If compliance is low, lower step targets or workout duration.
        """
        adjustments = {}
        
        # Check compliance trend
        compliance = self._analyze_compliance(history).get("general_compliance", 0.8)
        
        if compliance < 0.6:
            # Low compliance -> Simplify everything
            adjustments["workout_intensity_cap"] = "Low"
            adjustments["meal_prep_complexity"] = "Simple"
        elif compliance > 0.9:
            # High compliance -> Allow advanced plans
            adjustments["allow_advanced_techniques"] = True
            
        return adjustments

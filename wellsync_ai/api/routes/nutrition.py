from flask import Blueprint, jsonify, g, request
from datetime import datetime
import asyncio
import structlog
from typing import Dict, Any

from wellsync_ai.api.utils import validate_json_request, WellnessAPIError

logger = structlog.get_logger()
nutrition_bp = Blueprint('nutrition', __name__)

@nutrition_bp.route('/nutrition/state/<user_id>', methods=['GET'])
def get_nutrition_state(user_id: str):
    """
    Get Nutrition State
    ---
    tags:
      - Nutrition
    summary: Get current nutrition state for a user
    description: Returns budget, availability, meal history, and nutrition targets
    parameters:
      - name: user_id
        in: path
        type: string
        required: true
        description: User ID
    responses:
      200:
        description: Nutrition state retrieved successfully
      500:
        description: Failed to get nutrition state
    """
    try:
        logger.info(
            "Nutrition state requested",
            request_id=g.request_id,
            user_id=user_id
        )
        
        from wellsync_ai.data.nutrition_state import get_nutrition_state as get_state
        
        state = get_state(user_id)
        context = state.get_decision_context()
        
        response_data = {
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'request_id': g.request_id,
            'user_id': user_id,
            'state': state.to_dict(),
            'decision_context': context
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        logger.error(
            "Get nutrition state failed",
            request_id=g.request_id,
            user_id=user_id,
            error=str(e)
        )
        
        raise WellnessAPIError(
            f"Failed to get nutrition state: {str(e)}",
            status_code=500,
            error_code="GET_NUTRITION_STATE_FAILED"
        )

@nutrition_bp.route('/nutrition/decision', methods=['POST'])
@validate_json_request(required_fields=['user_profile'])
def trigger_nutrition_decision(request_data: Dict[str, Any]):
    """
    Trigger Nutrition Decision
    ---
    tags:
      - Nutrition
    summary: Trigger a nutrition decision using hierarchical swarm
    description: Runs the full decision loop with all nutrition worker agents
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - user_profile
          properties:
            user_profile:
              type: object
              description: User profile data
            constraints:
              type: object
              description: User constraints
            shared_state:
              type: object
              description: Shared state data
    responses:
      200:
        description: Nutrition decision generated successfully
      500:
        description: Nutrition decision failed
    """
    try:
        logger.info(
            "Nutrition decision requested",
            request_id=g.request_id,
            user_id=request_data.get('user_profile', {}).get('user_id')
        )
        
        from wellsync_ai.agents.nutrition_swarm import NutritionManager
        import asyncio
        
        user_profile = request_data['user_profile']
        constraints = request_data.get('constraints', {})
        shared_state_data = request_data.get('shared_state', {})
        
        # Run hierarchical decision
        manager = NutritionManager()
        
        try:
            # Run async decision logic
            # Use asyncio.run for the async loop
            # This replicates original code's async execution
            decision = asyncio.run(manager.run_hierarchical_decision(
                user_profile,
                constraints,
                shared_state_data
            ))
            
            response_data = {
                'success': True,
                'decision': decision,
                'timestamp': datetime.now().isoformat(),
                'request_id': g.request_id
            }
            
            return jsonify(response_data), 200
            
        except Exception as e:
            logger.error(f"Manager decision failed: {e}")
            raise
            
    except Exception as e:
        logger.error(
            "Nutrition decision failed",
            request_id=g.request_id,
            error=str(e)
        )
        
        raise WellnessAPIError(
            f"Failed to generate nutrition decision: {str(e)}",
            status_code=500,
            error_code="NUTRITION_DECISION_FAILED"
        )

@nutrition_bp.route('/nutrition/feedback', methods=['POST'])
@validate_json_request(required_fields=['user_id', 'feedback'])
def submit_nutrition_feedback(request_data: Dict[str, Any]):
    """
    Submit Nutrition Feedback
    ---
    tags:
      - Nutrition
    summary: Submit feedback for nutrition updates
    description: Update nutrition state with meal logs, rejections, expenses
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - user_id
            - feedback
          properties:
            user_id:
              type: string
            feedback:
              type: object
    responses:
      200:
        description: Feedback processed successfully
      500:
        description: Failed to process feedback
    """
    try:
        logger.info(
            "Nutrition feedback submitted",
            request_id=g.request_id,
            user_id=request_data.get('user_id')
        )
        
        from wellsync_ai.data.nutrition_state import get_nutrition_state
        
        user_id = request_data['user_id']
        feedback = request_data['feedback']
        
        state = get_nutrition_state(user_id)
        
        # Process feedback
        if 'rejected_items' in feedback:
            for item in feedback['rejected_items']:
                state.history.add_rejection(
                    item.get('name', item),
                    item.get('reason', '')
                )
        
        if 'meal_consumed' in feedback:
            state.history.add_meal(feedback['meal_consumed'])
        
        if 'expense' in feedback:
            state.budget.add_expense(
                feedback['expense'].get('amount', 0),
                feedback['expense'].get('description', '')
            )
        
        # Recalculate fatigue
        state.history.calculate_fatigue()
        
        # Save updated state
        state.save()
        
        response_data = {
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'request_id': g.request_id,
            'user_id': user_id,
            'message': 'Nutrition feedback processed successfully',
            'updated_context': state.get_decision_context()
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        logger.error(
            "Submit nutrition feedback failed",
            request_id=g.request_id,
            error=str(e)
        )
        
        raise WellnessAPIError(
            f"Failed to submit nutrition feedback: {str(e)}",
            status_code=500,
            error_code="SUBMIT_NUTRITION_FEEDBACK_FAILED"
        )

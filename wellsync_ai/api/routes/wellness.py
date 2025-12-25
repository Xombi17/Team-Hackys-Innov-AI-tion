from flask import Blueprint, jsonify, g, request
from datetime import datetime
import asyncio
import structlog
from typing import Dict, Any

from wellsync_ai.api.utils import validate_json_request, validate_user_data, WellnessAPIError
from wellsync_ai.data.database import get_database_manager
from wellsync_ai.data.shared_state import create_shared_state, get_shared_state

logger = structlog.get_logger()
wellness_bp = Blueprint('wellness', __name__)

@wellness_bp.route('/wellness-plan', methods=['POST'])
@validate_json_request(required_fields=['user_profile', 'constraints'])
@validate_user_data
def generate_wellness_plan(request_data: Dict[str, Any]):
    """
    Generate Wellness Plan
    ---
    tags:
      - Wellness Plan
    summary: Generate a personalized wellness plan
    description: Uses multi-agent AI system to create coordinated fitness, nutrition, sleep, and mental wellness recommendations
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - user_profile
            - constraints
          properties:
            user_profile:
              type: object
              description: User profile data
              properties:
                user_id:
                  type: string
            constraints:
              type: object
              description: User constraints and limitations
            goals:
              type: object
              description: User wellness goals
            recent_data:
              type: object
              description: Optional recent data (cravings, soreness, etc.)
    responses:
      200:
        description: Wellness plan generated successfully
      400:
        description: Invalid request data
      500:
        description: Plan generation failed
    """
    try:
        logger.info(
            "Wellness plan generation started",
            request_id=g.request_id,
            user_id=request_data.get('user_profile', {}).get('user_id', 'anonymous')
        )
        
        # Extract inputs
        user_profile = request_data['user_profile']
        constraints = request_data['constraints']
        recent_data = request_data.get('recent_data', {})
        goals = request_data.get('goals', {})
        
        db_manager = get_database_manager()

        # Create or get shared state
        state_id = request_data.get('state_id')
        if state_id:
            shared_state = get_shared_state(state_id)
            if not shared_state:
                raise WellnessAPIError(
                    f"Shared state not found: {state_id}",
                    status_code=404,
                    error_code="STATE_NOT_FOUND"
                )
        else:
            shared_state = create_shared_state(user_profile.get('user_id'))
        
        # Update shared state
        shared_state.update_user_profile({
            **user_profile,
            'goals': goals,
            'constraints': constraints
        })
        
        if recent_data:
            for data_type, data in recent_data.items():
                shared_state.update_recent_data(data_type, data)
        
        # Log request
        db_manager.log_api_request(
            endpoint='/wellness-plan',
            method='POST',
            request_data=request_data,
            request_id=g.request_id,
            user_id=user_profile.get('user_id', 'anonymous')
        )
        
        # EXECUTE WORKFLOW
        # Local import to avoid circular dependencies
        from wellsync_ai.workflows.wellness_orchestrator import WellnessWorkflowOrchestrator
        
        orchestrator = WellnessWorkflowOrchestrator()
        
        # Run async workflow
        result = asyncio.run(orchestrator.execute_workflow(shared_state.state_id))
        
        if not result:
            raise WellnessAPIError(
                "Workflow execution failed",
                status_code=500,
                error_code="WORKFLOW_FAILED"
            )
        
        # Extract the unified plan from the workflow result
        unified_plan = result.get('plan', {})
        
        # Store plan in database
        db_manager.store_wellness_plan(
            user_id=user_profile.get('user_id'),
            plan_data=unified_plan,
            confidence=unified_plan.get('confidence', 0.85)
        )
        
        response_data = {
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'request_id': g.request_id,
            'state_id': shared_state.state_id,
            'plan': unified_plan,
            'metadata': result.get('metadata', {})
        }
        
        logger.info(
            "Wellness plan generation completed",
            request_id=g.request_id,
            state_id=shared_state.state_id
        )
        
        return jsonify(response_data), 200
        
    except WellnessAPIError:
        raise
    except Exception as e:
        logger.error(
            "Wellness plan generation failed",
            request_id=g.request_id,
            error=str(e)
        )
        raise WellnessAPIError(
            f"Failed to generate wellness plan: {str(e)}",
            status_code=500,
            error_code="GENERATION_FAILED"
        )

@wellness_bp.route('/wellness-plan/<state_id>', methods=['GET'])
def get_wellness_plan_status(state_id: str):
    """
    Get Wellness Plan Status
    ---
    tags:
      - Wellness Plan
    summary: Get status of a wellness plan generation
    parameters:
      - name: state_id
        in: path
        type: string
        required: true
    responses:
      200:
        description: Plan status retrieved
      404:
        description: Plan not found
    """
    try:
        logger.info(
            "Wellness plan status requested",
            request_id=g.request_id,
            state_id=state_id
        )
        
        shared_state = get_shared_state(state_id)
        if not shared_state:
            raise WellnessAPIError(
                f"Wellness plan not found: {state_id}",
                status_code=404,
                error_code="WELLNESS_PLAN_NOT_FOUND"
            )
        
        state_data = shared_state.get_state_data()
        
        response_data = {
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'request_id': g.request_id,
            'state_id': state_id,
            'status': state_data.get('workflow_status', 'unknown'),
            'user_profile': state_data.get('user_profile'),
            'current_plans': state_data.get('current_plans', {}),
            'constraint_violations': state_data.get('constraint_violations', []),
            'last_updated': state_data.get('metadata', {}).get('last_updated'),
            'state_summary': shared_state.get_state_summary()
        }
        
        return jsonify(response_data), 200
        
    except WellnessAPIError:
        raise
    except Exception as e:
        logger.error(
            "Get wellness plan status failed",
            request_id=g.request_id,
            state_id=state_id,
            error=str(e)
        )
        raise WellnessAPIError(
            f"Failed to get wellness plan status: {str(e)}",
            status_code=500,
            error_code="GET_STATUS_FAILED"
        )

@wellness_bp.route('/wellness-plan/<state_id>/feedback', methods=['POST'])
@validate_json_request(required_fields=['feedback'])
def submit_wellness_plan_feedback(state_id: str, request_data: Dict[str, Any]):
    """
    Submit Feedback
    ---
    tags:
      - Wellness Plan
    summary: Submit feedback for a plan
    parameters:
      - name: state_id
        in: path
        required: true
        type: string
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - feedback
          properties:
            feedback:
              type: object
    responses:
      200:
        description: Feedback submitted
    """
    try:
        logger.info("Feedback submitted", state_id=state_id, request_id=g.request_id)
        
        shared_state = get_shared_state(state_id)
        if not shared_state:
            raise WellnessAPIError(f"Plan not found: {state_id}", 404, "NOT_FOUND")
            
        feedback = request_data['feedback']
        db_manager = get_database_manager()
        
        shared_state.update_recent_data('user_feedback', {
            'feedback': feedback,
            'submitted_at': datetime.now().isoformat(),
            'request_id': g.request_id
        })
        
        db_manager.store_user_feedback(state_id=state_id, feedback=feedback, request_id=g.request_id)
        
        return jsonify({
            'success': True, 
            'message': 'Feedback received',
            'state_id': state_id
        }), 200
    except Exception as e:
        raise WellnessAPIError(f"Feedback failed: {str(e)}", 500)

@wellness_bp.route('/plan/progress', methods=['GET', 'POST'])
def sync_progress():
    """
    Sync Task Progress
    ---
    tags:
      - Wellness Plan
    summary: sync completed tasks
    description: Get or Update completed tasks list for the user's latest plan
    parameters:
      - in: query
        name: user_id
        type: string
        description: (GET) User ID to fetch progress for
      - in: body
        name: body
        schema:
          type: object
          properties:
            user_id:
              type: string
            completed_tasks:
              type: array
              items:
                type: string
    responses:
      200:
        description: Synced successfully
    """
    db_manager = get_database_manager()
    if not db_manager.use_supabase:
        # Fallback for local sqlite if needed, but for now we assume Supabase for Sync
        return jsonify({'success': False, 'message': 'Cloud sync requires Supabase'}), 503

    supabase = db_manager.supabase

    try:
        if request.method == 'GET':
            user_id = request.args.get('user_id')
            if not user_id:
                return jsonify({'success': False, 'message': 'User ID required'}), 400

            # Find latest plan from wellness_plans
            response = supabase.table('wellness_plans')\
                .select('completed_tasks')\
                .eq('user_id', user_id)\
                .order('created_at', desc=True)\
                .limit(1)\
                .execute()
            
            if not response.data:
                return jsonify({'success': True, 'completed_tasks': []}), 200
            
            tasks = response.data[0].get('completed_tasks') or []
            return jsonify({'success': True, 'completed_tasks': tasks}), 200

        # POST
        data = request.get_json()
        if not data:
             return jsonify({'success': False, 'message': 'No JSON'}), 400
             
        user_id = data.get('user_id')
        completed_tasks = data.get('completed_tasks', [])
        
        logger.info("Syncing progress", user_id=user_id)

        # Find latest plan
        response = supabase.table('wellness_plans')\
            .select('id')\
            .eq('user_id', user_id)\
            .order('created_at', desc=True)\
            .limit(1)\
            .execute()

        if not response.data:
                return jsonify({'success': False, 'message': 'No plan found'}), 404
        
        plan_id = response.data[0]['id']
        
        # Update
        supabase.table('wellness_plans')\
            .update({'completed_tasks': completed_tasks})\
            .eq('id', plan_id)\
            .execute()
            
        return jsonify({'success': True}), 200

    except Exception as e:
        logger.error("Sync failed", error=str(e))
        return jsonify({'success': False, 'error': str(e)}), 500

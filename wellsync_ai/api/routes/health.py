from flask import Blueprint, jsonify, g
from datetime import datetime
import structlog
from wellsync_ai.data.database import get_database_manager
from wellsync_ai.data.redis_client import get_redis_manager

logger = structlog.get_logger()
health_bp = Blueprint('health', __name__)

@health_bp.route('/', methods=['GET'])
def index():
    """
    API Root
    ---
    tags:
      - Health
    summary: Get API information
    description: Returns basic API info and available endpoints
    responses:
      200:
        description: API info returned successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
            service:
              type: string
            version:
              type: string
            status:
              type: string
            endpoints:
              type: object
    """
    return jsonify({
        'success': True,
        'service': 'WellSync AI API',
        'version': '1.0.0',
        'status': 'active',
        'message': 'Welcome to the WellSync AI Multi-Agent Wellness API',
        'endpoints': {
            'health': '/health',
            'wellness_plan': '/wellness-plan (POST)',
            'agents_status': '/agents/status',
            'docs': '/docs'
        }
    }), 200

@health_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health Check
    ---
    tags:
      - Health
    summary: Check API health status
    description: Returns health status of API and connected services (database, Redis)
    responses:
      200:
        description: API is healthy
        schema:
          type: object
          properties:
            status:
              type: string
              enum: [healthy, unhealthy]
            timestamp:
              type: string
            version:
              type: string
            services:
              type: object
      503:
        description: API is unhealthy
    """
    try:
        db_manager = get_database_manager()
        redis_manager = get_redis_manager()
        
        # Check database connection
        db_status = db_manager.health_check()
        
        # Check Redis connection
        redis_status = redis_manager.health_check()
        
        health_status = {
            'status': 'healthy' if db_status and redis_status else 'unhealthy',
            'timestamp': datetime.now().isoformat(),
            'version': '1.0.1',
            'services': {
                'database': {
                    'status': 'healthy' if db_status else 'unhealthy',
                    'type': 'supabase' if db_manager.use_supabase else 'sqlite'
                },
                'redis': 'healthy' if redis_status else 'fallback'
            }
        }
        
        status_code = 200 if health_status['status'] == 'healthy' else 503
        
        return jsonify(health_status), status_code
        
    except Exception as e:
        logger.error("Health check failed", error=str(e))
        return jsonify({
            'status': 'unhealthy',
            'timestamp': datetime.now().isoformat(),
            'error': str(e)
        }), 503

@health_bp.route('/agents/status', methods=['GET'])
def get_agents_status():
    """
    Get Agents Status
    ---
    tags:
      - Agents
    summary: Get status of all AI agents
    description: Returns health and status information for all wellness agents in the system
    responses:
      200:
        description: Agent status returned successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
            agents:
              type: object
              description: Status of each agent
            total_agents:
              type: integer
            healthy_agents:
              type: integer
            swarm_architecture:
              type: string
      500:
        description: Failed to get agent status
    """
    try:
        logger.info(
            "Agents status requested",
            request_id=g.request_id
        )
        
        # Import agents and get real status
        # Note: Local imports to avoid circular dependencies and overhead if not used
        try:
            from wellsync_ai.agents.fitness_agent import FitnessAgent
            from wellsync_ai.agents.nutrition_agent import NutritionAgent
            from wellsync_ai.agents.sleep_agent import SleepAgent
            from wellsync_ai.agents.mental_wellness_agent import MentalWellnessAgent
            from wellsync_ai.agents.coordinator_agent import CoordinatorAgent
            
            agents_status = {}
            healthy_count = 0
            
            # Check each agent type
            agent_classes = {
                'FitnessAgent': FitnessAgent,
                'NutritionAgent': NutritionAgent,
                'SleepAgent': SleepAgent,
                'MentalWellnessAgent': MentalWellnessAgent,
                'CoordinatorAgent': CoordinatorAgent
            }
            
            for name, agent_class in agent_classes.items():
                try:
                    # Agents are healthy if they can be instantiated
                    agent = agent_class()
                    status_info = agent.get_agent_status()
                    agents_status[name] = {
                        'status': 'active',
                        'health': 'healthy',
                        'domain': status_info.get('domain', 'unknown'),
                        'confidence_threshold': status_info.get('confidence_threshold', 0.7)
                    }
                    healthy_count += 1
                except Exception as e:
                    agents_status[name] = {
                        'status': 'error',
                        'health': 'unhealthy',
                        'error': str(e)
                    }
        except ImportError as e:
            logger.error(f"Failed to import agents: {e}")
            agents_status = {"error": f"Import failed: {e}"}
            healthy_count = 0
            
        # Add nutrition swarm agents
        try:
            from wellsync_ai.agents.nutrition_swarm import (
                NutritionManager,
                ConstraintBudgetAnalyst,
                AvailabilityMapper,
                PreferenceFatigueModeler,
                RecoveryTimingAdvisor
            )
            
            swarm_agents = {
                'NutritionManager': NutritionManager,
                'ConstraintBudgetAnalyst': ConstraintBudgetAnalyst,
                'AvailabilityMapper': AvailabilityMapper,
                'PreferenceFatigueModeler': PreferenceFatigueModeler,
                'RecoveryTimingAdvisor': RecoveryTimingAdvisor
            }
            
            for name, agent_class in swarm_agents.items():
                try:
                    agent = agent_class()
                    agents_status[name] = {
                        'status': 'active',
                        'health': 'healthy',
                        'type': 'nutrition_swarm',
                        'role': 'manager' if name == 'NutritionManager' else 'worker'
                    }
                    healthy_count += 1
                except Exception as e:
                    agents_status[name] = {
                        'status': 'error',
                        'health': 'unhealthy',
                        'error': str(e)
                    }
        except ImportError:
            pass  # Swarm not yet fully integrated
        
        response_data = {
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'request_id': g.request_id,
            'agents': agents_status,
            'total_agents': len(agents_status),
            'healthy_agents': healthy_count,
            'swarm_architecture': 'hierarchical'
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        logger.error(
            "Get agents status failed",
            request_id=g.request_id,
            error=str(e)
        )
        
        return jsonify({
            'success': False,
            'error': {
                'code': 'GET_AGENTS_STATUS_FAILED',
                'message': f'Failed to get agents status: {str(e)}',
                'timestamp': datetime.now().isoformat()
            },
            'request_id': g.request_id
        }), 500

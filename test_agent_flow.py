
import asyncio
import os
import json
from dotenv import load_dotenv

# Load env before importing app modules
load_dotenv(override=True)

# Force correct model for test duration BEFORE imports
os.environ['LLM_MODEL'] = "gemini/gemini-3-flash-preview"

from wellsync_ai.workflows.wellness_orchestrator import WellnessWorkflowOrchestrator
from wellsync_ai.data.database import get_database_manager

async def test_full_workflow():
    print("🚀 Starting End-to-End Agent Integration Test...")
    print(f"Model: {os.getenv('LLM_MODEL')}")
    
    # 1. Mock User Data (similar to frontend input)
    user_id = "test_user_integration"
    user_profile = {
        "name": "Arjun",
        "age": 28,
        "gender": "Male",
        "weight": 75,
        "height": 178,
        "activity_level": "Sedentary",
        "goals": ["Muscle Gain", "Better Sleep"],
        "dietary_preference": "Vegetarian",
        "location": "Mumbai, India",
        "medical_conditions": ["None"]
    }
    
    constraints = {
        "workout_days": 4,
        "equipment": "Dumbbells only",
        "time_per_workout": 45
    }
    
    # 2. Initialize State
    from wellsync_ai.data.shared_state import get_shared_state
    
    # Create a unique state ID
    import time
    state_id = f"test_{int(time.time())}"
    shared_state = get_shared_state(state_id)
    
    # Initialize with user data using correct methods
    # There might be a specific method or we simulate it
    # Looking at the file, set_state_data doesn't exist, but we can set internal dict if needed or use specific updaters
    # Let's try to manually set it if methods are missing, or use what we found in view_file if any
    # Actually, looking at previous output, there is update_recent_data. 
    # But usually there is update_section or similar.
    # Let's assume we can just 'hack' it for the test if needed, or use the public API.
    # We saw `update_recent_data`. Let's try `update_user_profile` if it exists (it wasn't in first 100 lines).
    # Wait, I'll use the _state_data direct access if I'm blocked, but better to use `update_recent_data` which is generic?
    # No, orchestrator expects user_profile at root of state_data.
    
    # Correct approach based on standard implementations:
    shared_state._state_data['user_profile'] = user_profile
    shared_state._state_data['constraints'] = constraints
    shared_state._state_data['user_id'] = user_id
    
    # Force correct model for test duration
    os.environ['LLM_MODEL'] = "gemini/gemini-3-flash-preview"
    # Re-instantiate orchestrator if it loaded config earlier
    from wellsync_ai.utils.config import WellSyncConfig
    # Reload config might be tricky if it's a singleton, but usually env var override works before class init
    
    # 3. Execute Workflow
    orchestrator = WellnessWorkflowOrchestrator()
    print(f"\n⏳ Agents are thinking... (Calling Gemini 3 Flash)")
    
    try:
        response = await orchestrator.execute_workflow(state_id)
        result = response.get("plan", {})
        
        # 4. Analyze Results
        print("\n✅ Plan Generated Successfully!")
        
        print(f"Confidence: {result.get('confidence')}")
        print(f"Executive Summary: {result.get('executive_summary')}")
        
        # Check raw agent proposals from state
        proposals = shared_state._state_data.get("agent_proposals")
        if proposals:
             print("\n--- Fitness Agent Proposal ---")
             fitness = proposals.get('FitnessAgent', {})
             print(str(fitness.get('content') or fitness.get('proposal', 'No Content'))[:300] + "...")
             
             print("\n--- Nutrition Agent Proposal ---")
             nutrition = proposals.get('NutritionAgent', {})
             print(str(nutrition.get('content') or nutrition.get('proposal', 'No Content'))[:300] + "...")

    except Exception as e:
        print(f"\n❌ Test Failed: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_full_workflow())

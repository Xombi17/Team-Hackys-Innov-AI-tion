from typing import List, Dict, Any
import time

class ChatContext:
    """
    Manages chat context and history for a user.
    Currently uses in-memory storage, but can be extended to Redis/DB.
    """
    
    # Simple in-memory storage for hackathon usage
    _memory_storage: Dict[str, List[Dict[str, Any]]] = {}
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        if user_id not in self._memory_storage:
            self._memory_storage[user_id] = []
            
    def add_message(self, role: str, content: str):
        """Add a message to the history."""
        self._memory_storage[self.user_id].append({
            "role": role,
            "content": content,
            "timestamp": time.time()
        })
        
    def get_history(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent chat history."""
        return self._memory_storage[self.user_id][-limit:]
        
    def get_context_string(self) -> str:
        """Format history as a context string for the LLM."""
        history = self.get_history()
        return "\n".join([f"{msg['role']}: {msg['content']}" for msg in history])
        
    def clear_history(self):
        """Clear user history."""
        self._memory_storage[self.user_id] = []

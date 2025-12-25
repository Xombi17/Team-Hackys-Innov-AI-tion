import structlog
try:
    import google.generativeai as genai
except ImportError:
    genai = None

from wellsync_ai.utils.llm_config import LLMConfig

logger = structlog.get_logger()

class GoogleGeminiChat:
    """
    Wrapper for Google Gemini Chat API.
    """
    
    def __init__(self, config: LLMConfig):
        self.config = config
        if genai and self.config.api_key:
            genai.configure(api_key=self.config.api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
             self.model = None
             logger.warning("Gemini API not configured or library missing")
             
    def generate_response(self, message: str, context: str = "") -> str:
        """
        Generate a response from the LLM.
        """
        if not self.model:
            return "I am unable to process your request at the moment (LLM not configured)."
            
        try:
            # Simple prompt construction
            prompt = f"{context}\n\nUser: {message}\nAI:"
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error("LLM Generation Failed", error=str(e))
            return "I'm having trouble thinking right now. Please try again later."

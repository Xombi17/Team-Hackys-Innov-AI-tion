import os
from dotenv import load_dotenv

load_dotenv()

class LLMConfig:
    """
    Configuration for LLM services.
    """
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = os.getenv("LLM_MODEL", "gemini/gemini-pro")
        self.temperature = 0.7
        self.max_tokens = 1000

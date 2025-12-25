from functools import wraps
from typing import Optional, List, Dict, Any
from flask import request, jsonify, g
from datetime import datetime
import structlog
import traceback

logger = structlog.get_logger()

class WellnessAPIError(Exception):
    """Custom exception for wellness API errors."""
    
    def __init__(self, message: str, status_code: int = 400, error_code: str = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code or "WELLNESS_API_ERROR"

def validate_json_request(required_fields: Optional[list] = None):
    """Decorator to validate JSON request format and required fields."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Check content type
            if not request.is_json:
                raise WellnessAPIError(
                    "Request must be JSON format",
                    status_code=400,
                    error_code="INVALID_CONTENT_TYPE"
                )
            
            # Get JSON data
            try:
                data = request.get_json()
                if data is None:
                    raise WellnessAPIError(
                        "Invalid JSON in request body",
                        status_code=400,
                        error_code="INVALID_JSON"
                    )
            except Exception as e:
                raise WellnessAPIError(
                    f"JSON parsing error: {str(e)}",
                    status_code=400,
                    error_code="JSON_PARSE_ERROR"
                )
            
            # Validate required fields
            if required_fields:
                missing_fields = []
                for field in required_fields:
                    if field not in data:
                        missing_fields.append(field)
                
                if missing_fields:
                    raise WellnessAPIError(
                        f"Missing required fields: {', '.join(missing_fields)}",
                        status_code=400,
                        error_code="MISSING_REQUIRED_FIELDS"
                    )
            
            # Add validated data to kwargs
            kwargs['request_data'] = data
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator

def validate_user_data(f):
    """Decorator to validate user data structure."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        request_data = kwargs.get('request_data', {})
        
        # Validate user profile structure
        user_profile = request_data.get('user_profile', {})
        if not isinstance(user_profile, dict):
            raise WellnessAPIError(
                "user_profile must be a dictionary",
                status_code=400,
                error_code="INVALID_USER_PROFILE"
            )
        
        user_id = user_profile.get('user_id')
        if not user_id:
            raise WellnessAPIError(
                "user_id is required in user_profile",
                status_code=400,
                error_code="MISSING_USER_ID"
            )
            
        return f(*args, **kwargs)
    
    return decorated_function

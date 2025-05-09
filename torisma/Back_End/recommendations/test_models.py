import google.generativeai as genai
from django.conf import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def list_available_models():
    try:
        # Configure Gemini
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        # List available models
        for m in genai.list_models():
            logger.info(f"Model: {m.name}")
            logger.info(f"Display name: {m.display_name}")
            logger.info(f"Description: {m.description}")
            logger.info(f"Generation methods: {m.supported_generation_methods}")
            logger.info("---")
            
    except Exception as e:
        logger.error(f"Error listing models: {str(e)}")

if __name__ == "__main__":
    list_available_models() 
# recommendations/utils.py
from django.conf import settings
import google.generativeai as genai
import logging
import time
import re
import os

logger = logging.getLogger(__name__)

def detect_language(query):
    """
    Detect the language of the query.
    Returns 'ar' for Arabic, 'fr' for French, or 'en' for English.
    """
    # Check for Arabic characters
    if re.search('[\u0600-\u06FF]', query):
        return 'ar'
    
    # Common French words and patterns
    french_words = [
        'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles',
        'suis', 'es', 'est', 'sommes', 'êtes', 'sont',
        'le', 'la', 'les', 'un', 'une', 'des',
        'et', 'ou', 'mais', 'donc', 'car', 'ni',
        'voulez', 'pouvez', 'devez', 'allez', 'venez',
        'bonjour', 'merci', "s'il", 'vous', 'plait',
        'comment', 'pourquoi', 'quand', 'où', 'qui',
        'que', 'quel', 'quelle', 'quels', 'quelles'
    ]
    
    # Check for French words
    query_lower = query.lower()
    french_word_count = sum(1 for word in french_words if word in query_lower)
    
    # If more than 2 French words are found, consider it French
    if french_word_count > 2:
        return 'fr'
    
    # Check for English words
    english_words = [
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
        'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
        'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
        'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their'
    ]
    english_word_count = sum(1 for word in english_words if word in query_lower)
    
    # If more than 2 English words are found, consider it English
    if english_word_count > 2:
        return 'en'
    
    # Default to English if no other language is detected
    return 'en'

def get_tourism_recommendation(query):
    """
    Get tourism recommendations using the Gemini API.
    """
    try:
        # Log the start of the function
        logger.info("Starting get_tourism_recommendation function")
        
        # Check for API key
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            logger.error("GEMINI_API_KEY not found in environment variables")
            return "Désolé, le service n'est pas configuré correctement. Veuillez contacter l'administrateur."

        # Configure the API
        genai.configure(api_key=api_key)
        
        # Initialize the model
        model = genai.GenerativeModel('gemini-1.5-flash-8b')
        
        # Detect language
        language = detect_language(query)
        
        # Prepare the prompt based on language
        if language == 'ar':
            prompt = f"""أنت مساعد سياحي متخصص في الجزائر. يجب أن تكون إجاباتك:
            1. باللغة العربية
            2. دقيقة ومفصلة
            3. تركز على الثقافة والتقاليد الجزائرية
            4. تتضمن معلومات عملية (مثل أفضل الأوقات للزيارة، وسائل النقل، الخ)
            5. تتضمن توصيات للأماكن السياحية والأنشطة

            السؤال: {query}

            الرجاء تقديم إجابة شاملة ومفيدة في جملتين إلى ثلاث جمل فقط."""
        elif language == 'fr':
            prompt = f"""Vous êtes un assistant touristique spécialisé sur l'Algérie. Vos réponses doivent être:
            1. En français
            2. Précises et détaillées
            3. Axées sur la culture et les traditions algériennes
            4. Inclure des informations pratiques (meilleures périodes, transports, etc.)
            5. Inclure des recommandations de lieux et d'activités

            Question: {query}

            Veuillez fournir une réponse complète et utile en seulement deux à trois phrases."""
        else:
            prompt = f"""You are a tourism assistant specialized in Algeria. Your responses must be:
            1. In English
            2. Accurate and detailed
            3. Focused on Algerian culture and traditions
            4. Include practical information (best times to visit, transportation, etc.)
            5. Include recommendations for places and activities

            Question: {query}

            Please provide a comprehensive and helpful response in just two to three sentences."""

        # Generate response
        response = model.generate_content(prompt)
        
        # Check for safety filter blocks
        if response.prompt_feedback and response.prompt_feedback.block_reason:
            logger.warning(f"Response blocked by safety filter: {response.prompt_feedback.block_reason}")
            if language == 'ar':
                return "عذراً، لا يمكنني معالجة هذا الطلب. يرجى إعادة صياغة سؤالك."
            elif language == 'fr':
                return "Désolé, je ne peux pas traiter cette demande. Veuillez reformuler votre question."
            else:
                return "Sorry, I cannot process this request. Please rephrase your question."

        # Return the response text
        return response.text

    except Exception as e:
        logger.error(f"Error in get_tourism_recommendation: {str(e)}")
        if language == 'ar':
            return "عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً."
        elif language == 'fr':
            return "Désolé, une erreur s'est produite lors du traitement de votre demande. Veuillez réessayer plus tard."
        else:
            return "Sorry, an error occurred while processing your request. Please try again later."
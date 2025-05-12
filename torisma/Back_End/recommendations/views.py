# recommendations/views.py
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from django.middleware.csrf import get_token
from .utils import get_tourism_recommendation, detect_language
import json
import logging

logger = logging.getLogger(__name__)

class CustomAuthenticationFailed(AuthenticationFailed):
    def __init__(self, detail=None):
        super().__init__(detail)
        self.status_code = 401

def generate_concise_recommendation(user_query, is_authenticated=True):
    """
    Generates a concise tourism recommendation, explicitly stating the query language.
    If the user is not authenticated, include a login button in the response.
    """
    language = detect_language(user_query)
    prompt = f"Provide a brief and engaging recommendation (max 2-3 sentences per suggestion) for tourism in Algeria based on the query: '{user_query}'. Focus on the most appealing aspects for a first-time visitor interested in this topic. Respond in {language}."
    recommendation = get_tourism_recommendation(prompt)

    if not is_authenticated:
        login_url = "http://localhost:5173/connect"
        login_text = "Login" if language == 'en' else "se connecter" if language == 'fr' else "تسجيل الدخول"
        recommendation += f"<br/><a href='{login_url}' class='login-link'>{login_text}</a>"

    return recommendation

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_recommendation(request):
    """
    Handle tourism recommendation requests.
    Requires authentication and returns concise AI-generated recommendations.
    """
    try:
        # Log the incoming request
        logger.info(f"Received recommendation request from user {request.user.id}")

        data = json.loads(request.body)
        user_query = data.get('query')

        if not user_query:
            logger.warning("Empty query received")
            return JsonResponse({
                'error': 'La requête est requise'
            }, status=400)

        # Log the query
        logger.info(f"Processing query: {user_query[:100]}...")

        recommendation = generate_concise_recommendation(user_query, is_authenticated=True)

        # Log successful response
        logger.info("Successfully generated concise recommendation")

        return JsonResponse({'response': recommendation})

    except json.JSONDecodeError:
        logger.error("Invalid JSON in request body")
        return JsonResponse({
            'error': 'Format de requête invalide'
        }, status=400)
    except Exception as e:
        logger.error(f"Unexpected error in get_recommendation: {str(e)}")
        return JsonResponse({
            'error': 'Une erreur est survenue lors du traitement de votre demande'
        }, status=500)

@api_view(['POST'])
@permission_classes([])  # No authentication required
def get_recommendation_unauthenticated(request):
    """
    Handle tourism recommendation requests for unauthenticated users.
    Returns concise AI-generated recommendations with a login prompt.
    """
    try:
        # Log the incoming request
        logger.info("Received unauthenticated recommendation request")

        data = json.loads(request.body)
        user_query = data.get('query')

        if not user_query:
            logger.warning("Empty query received")
            return JsonResponse({
                'error': 'La requête est requise'
            }, status=400)

        # Log the query
        logger.info(f"Processing query: {user_query[:100]}...")

        recommendation = generate_concise_recommendation(user_query, is_authenticated=False)

        # Log successful response
        logger.info("Successfully generated concise recommendation with login prompt")

        return JsonResponse({'response': recommendation})

    except json.JSONDecodeError:
        logger.error("Invalid JSON in request body")
        return JsonResponse({
            'error': 'Format de requête invalide'
        }, status=400)
    except Exception as e:
        logger.error(f"Unexpected error in get_recommendation_unauthenticated: {str(e)}")
        return JsonResponse({
            'error': 'Une erreur est survenue lors du traitement de votre demande'
        }, status=500)

@api_view(['GET'])
def get_csrf_token(request):
    """
    Get CSRF token for the frontend.
    """
    return JsonResponse({'csrfToken': get_token(request)})

def handle_authentication_error(request, exc):
    """
    Custom handler for authentication errors.
    Returns a user-friendly response with login link.
    """
    login_url = "http://localhost:5173/connect"

    try:
        # Try to get the query from the request body
        data = json.loads(request.body)
        user_query = data.get('query', '')

        # Detect language from the query
        language = detect_language(user_query)

        if language == 'ar':
            message = "يجب تسجيل الدخول للوصول إلى هذه الخدمة"
            login_text = "تسجيل الدخول"
        elif language == 'fr':
            message = "Vous devez être connecté pour accéder à ce service"
            login_text = "se connecter"
        else:
            message = "You need to be logged in to access this service"
            login_text = "Login"

    except (json.JSONDecodeError, AttributeError):
        # If we can't get the query or detect language, default to French
        message = "Vous devez être connecté pour accéder à ce service"
        login_text = "se connecter"

    return JsonResponse({
        'error': message,
        'login_required': True,
        'login_url': login_url,
        'login_text': login_text
    }, status=401)


def custom_exception_handler(exc, context):
    """
    Custom exception handler for DRF.
    """
    if isinstance(exc, AuthenticationFailed):
        return handle_authentication_error(context['request'], exc)
    return None
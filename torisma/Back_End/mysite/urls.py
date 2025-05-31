"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
import debug_toolbar
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from django.views.decorators.csrf import csrf_exempt
from corsheaders.defaults import default_headers
from users.views import PasswordResetConfirmView

schema_view = get_schema_view(
   openapi.Info(
      title="TourismA API",
      default_version='v1',
      description="API documentation for the TourismA project",
      terms_of_service="https://www.example.com/terms/",
      contact=openapi.Contact(email="support@TourismA.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/listings/', include('listings.urls')),
    path('api/coupons/', include('coupons.urls')),
    path('api/reservations/', include('reservations.urls')),
    path('__debug__/', include('debug_toolbar.urls')),
    path('', include('rating.urls')),
    path('recommendations/', include('recommendations.urls')),
    path('api/users/password/reset/<str:uidb64>/<str:token>/', 
         PasswordResetConfirmView.as_view(), 
         name='password_reset_confirm'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Add CORS headers to all responses
def add_cors_headers(response):
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = ", ".join(default_headers)
    return response

# Apply CORS headers to all views
for pattern in urlpatterns:
    if hasattr(pattern, '_callback'):
        pattern._callback = add_cors_headers(pattern._callback)

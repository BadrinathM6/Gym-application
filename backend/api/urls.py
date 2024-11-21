from django.urls import path
from .views import LoginView, UserDetailView, DietaryPreferenceView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('user/', UserDetailView.as_view(), name='Dasboard'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dietary-preferences/', DietaryPreferenceView.as_view(), name='dietary_preferences'),
]
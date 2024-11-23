from django.urls import path
from .views import LoginView, UserDetailView, DietaryPreferenceView, BodyTypeProfileView, PhysicalProfileView, AgeUpdateView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('user/', UserDetailView.as_view(), name='Dasboard'),
     path('update-age/', AgeUpdateView.as_view(), name='update_age'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dietary-preferences/', DietaryPreferenceView.as_view(), name='dietary_preferences'),
    path('physical-profile/', PhysicalProfileView.as_view(), name='physical_profile'),
    path('body-type/', BodyTypeProfileView.as_view(), name='body_type'),
]
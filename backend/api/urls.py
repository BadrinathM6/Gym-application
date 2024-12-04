from django.urls import path
from .views import WorkoutStartView, WorkoutDayListView, WorkoutCompleteView, UserWorkoutStatsView, WorkoutDayDetailView, WorkoutProgramListView, WorkoutProgramProgressView, LoginView, DietaryPreferenceUpdateView, PhysicalProfileUpdateView, BodyTypeProfileUpdateView, UserProfileDetailView, HomePageView, WorkoutListView, WorkoutCategoriesView, UserWorkoutView, FavoriteWorkoutToggleView, UserDetailView, AIChatView, DietaryPreferenceView, BodyTypeProfileView, PhysicalProfileView, AgeUpdateView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('user/', UserDetailView.as_view(), name='Dasboard'),
     path('update-age/', AgeUpdateView.as_view(), name='update_age'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dietary-preferences/', DietaryPreferenceView.as_view(), name='dietary_preferences'),
    path('physical-profile/', PhysicalProfileView.as_view(), name='physical_profile'),
    path('body-type/', BodyTypeProfileView.as_view(), name='body_type'),
    path('ai-chat/', AIChatView.as_view(), name='ai_chat'),
    path('home/', HomePageView.as_view(), name='home_page'),
    path('workouts/', WorkoutListView.as_view(), name='workout_list'),
    path('workout-categories/', WorkoutCategoriesView.as_view(), name='workout_categories'),
    path('user-workouts/', UserWorkoutView.as_view(), name='user_workouts'),
    path('toggle-favorite/', FavoriteWorkoutToggleView.as_view(), name='toggle_favorite'),
    path('profile/', UserProfileDetailView.as_view(), name='user_profile'),
    path('update-dietary-preferences/', DietaryPreferenceUpdateView.as_view(), name='update_dietary_preferences'),
    path('update-physical-profile/', PhysicalProfileUpdateView.as_view(), name='update_physical_profile'),
    path('update-body-type/', BodyTypeProfileUpdateView.as_view(), name='update_body_type'),
    path('workout-programs/', WorkoutProgramListView.as_view(), name='workout_programs'),
    path('workout-program/<int:program_id>/progress/', WorkoutProgramProgressView.as_view(), name='program_progress'),
    path('workout-program/<int:program_id>/week/<int:week_number>/days/', WorkoutDayListView.as_view(), name='workout_days'),
    path('workout-day/<int:day_id>/', WorkoutDayDetailView.as_view(), name='workout_day_detail'),
    path('workout-day/<int:day_id>/start/', WorkoutStartView.as_view(), name='workout_start'),
    path('workout-day/<int:day_id>/complete/', WorkoutCompleteView.as_view(), name='workout_complete'),
    path('workout-stats/', UserWorkoutStatsView.as_view(), name='workout_stats'),
]
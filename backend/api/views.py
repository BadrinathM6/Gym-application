from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import FoodCategorySerializer, FoodSerializer, LoginSerializer, UserExerciseProgressSerializer, UserFoodLogSerializer, UserProfileSerializer, UserWorkoutSerializer, WorkoutDaySerializer, WorkoutProgramSerializer, UserWorkoutProgressSerializer, HomeBannerSerializer, HomeProgramSerializer, AIChatSerializer, UserSerializer, DietaryPreferenceSerializer, BodyTypeProfileSerializer, PhysicalProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.conf import settings
from .models import DietaryPreference, BodyTypeProfile, FavoriteFoods, Food, FoodCategory, PhysicalProfile, HomeProgram, HomeBanner, UserFoodLog, UserWeekWorkout, UserExerciseProgress, UserWorkoutProgress, WorkoutDay, WorkoutExercise, WorkoutProgram
import cohere
import logging
import random
from django.db.models import Q
from django.utils import timezone
from django.shortcuts import get_object_or_404

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.data.get('user_id')
        password = request.data.get('password')

        if not user_id or not password:
            missing_fields = []
            if not user_id:
                missing_fields.append('user_id')
            if not password:
                missing_fields.append('password')
            return Response(
                {'error': f'Missing required fields: {", ".join(missing_fields)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                user_id=serializer.validated_data['user_id'],
                password=serializer.validated_data['password']
            )

            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                })
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request): 
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        return self.put(request)
    
class AgeUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def put(self, request):
        """
        Update user's age
        """
        age = request.data.get('age')
        
        if age is None:
            return Response(
                {'error': 'Age is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        serializer = UserSerializer(
            request.user,
            data={'age': age},
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        """
        Get user's age
        """
        serializer = UserSerializer(request.user)
        return Response({'age': serializer.data.get('age')}, status=status.HTTP_200_OK)
    
class DietaryPreferenceView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        try:
            dietary_preference = DietaryPreference.objects.get(user=request.user)
            serializer = DietaryPreferenceSerializer(dietary_preference)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except DietaryPreference.DoesNotExist:
            return Response({'message': 'No dietary preferences set'}, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request):
        serializer = DietaryPreferenceSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        try:
            dietary_preference = DietaryPreference.objects.get(user=request.user)
            serializer = DietaryPreferenceSerializer(
                dietary_preference, 
                data=request.data, 
                partial=True, 
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except DietaryPreference.DoesNotExist:
            return self.post(request)
        
class PhysicalProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        try:
            profile = PhysicalProfile.objects.get(user=request.user)
            serializer = PhysicalProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except PhysicalProfile.DoesNotExist:
            return Response(
                {'message': 'Physical profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def post(self, request):
        serializer = PhysicalProfileSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            profile = serializer.save()
            return Response({
                **serializer.data,
                'bmi': profile.bmi,
                'bmi_category': profile.bmi_category
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        try:
            profile = PhysicalProfile.objects.get(user=request.user)
            serializer = PhysicalProfileSerializer(
                profile,
                data=request.data,
                partial=True,
                context={'request': request}
            )
            if serializer.is_valid():
                profile = serializer.save()
                return Response({
                    **serializer.data,
                    'bmi': profile.bmi,
                    'bmi_category': profile.bmi_category
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PhysicalProfile.DoesNotExist:
            return self.post(request)

class BodyTypeProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        try:
            profile = BodyTypeProfile.objects.get(user=request.user)
            serializer = BodyTypeProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except BodyTypeProfile.DoesNotExist:
            return Response(
                {'message': 'Body type profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def post(self, request):
        serializer = BodyTypeProfileSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        try:
            profile = BodyTypeProfile.objects.get(user=request.user)
            serializer = BodyTypeProfileSerializer(
                profile,
                data=request.data,
                partial=True,
                context={'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except BodyTypeProfile.DoesNotExist:
            return self.post(request)
        
logger = logging.getLogger(__name__)

class AIChatView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Initialize Cohere client
        try:
            self.cohere_client = cohere.Client(settings.COHERE_API_KEY)
        except Exception as e:
            self.cohere_client = None
            print(f"Cohere Client Initialization Error: {e}")

    def generate_fitness_context(self, user_message):
        """
        Create a structured context for fitness-related queries
        """
        fitness_context = (
            "You are a professional fitness assistant. "
            "Provide motivational, scientifically-backed, and safe fitness advice. "
            f"Respond to this query in a helpful, concise manner: {user_message}"
        )
        return fitness_context

    def post(self, request):
        try:
            # Validate incoming request
            serializer = AIChatSerializer(data=request.data)
            
            if not serializer.is_valid():
                return Response(
                    serializer.errors, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user_message = serializer.validated_data['message']
            
            # Fallback responses
            fallback_responses = [
                "Fitness is a personal journey. Consistency is key to seeing results.",
                "Every small step counts towards your fitness goals.",
                "Remember to consult with a healthcare professional before starting any new fitness regimen.",
                "Nutrition and exercise go hand in hand in achieving fitness goals."
            ]

            # Attempt to generate response with Cohere
            try:
                if not self.cohere_client:
                    raise Exception("Cohere client not initialized")

                # Generate response using Cohere's generation endpoint
                response = self.cohere_client.generate(
                    model='command-nightly',  # Use the most capable model
                    prompt=self.generate_fitness_context(user_message),
                    max_tokens=150,
                    temperature=0.7,
                    k=0,
                    p=0.75,
                    frequency_penalty=0,
                    presence_penalty=0,
                    stop_sequences=[],
                    return_likelihoods='NONE'
                )

                # Extract and clean the generated text
                if response.generations:
                    ai_response = response.generations[0].text.strip()
                    
                    # Ensure response is not empty
                    if not ai_response:
                        ai_response = random.choice(fallback_responses)
                else:
                    ai_response = random.choice(fallback_responses)

            except Exception as cohere_error:
                print(f"Cohere API Error: {cohere_error}")
                ai_response = random.choice(fallback_responses)

            return Response({
                'message': ai_response
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(f"Unexpected error in AI chat: {e}")
            return Response({
                'error': 'Failed to process your request',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class HomePageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve data for home page
        """
        try:
            # Get active programs
            programs = HomeProgram.objects.filter(active=True)
            program_serializer = HomeProgramSerializer(programs, many=True)

            # Get active banners
            banners = HomeBanner.objects.filter(is_active=True)
            banner_serializer = HomeBannerSerializer(banners, many=True)

            # Prepare response data
            response_data = {
                'programs': program_serializer.data,
                'banners': banner_serializer.data
            }

            return Response(response_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                'error': str(e),
                'status': 'error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class WorkoutListView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        # Retrieve the user's body type profile
        try:
            body_type_profile = BodyTypeProfile.objects.get(user=request.user)
            body_type = body_type_profile.body_type
        except BodyTypeProfile.DoesNotExist:
            return Response(
                {"error": "No body type profile found for the user"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find WorkoutPrograms based on body type
        if body_type == 'FLABBY':
            # If FLABBY, use IDs 7 or 8
            workouts = WorkoutProgram.objects.filter(bodytype_id__in=[7])
        elif body_type == 'SKINNY':
            # Assuming SKINNY might use a different ID
            workouts = WorkoutProgram.objects.filter(bodytype_id__in=[9])
        elif body_type == 'IDEAL':
            workouts = WorkoutProgram.objects.filter(bodytype_id__in=[8])
        else:
            # Fallback for any unexpected body type
            workouts = WorkoutProgram.objects.filter(bodytype_id__in=[7,8,9])

        # Check if any workouts exist
        if not workouts.exists():
            return Response(
                {
                    "error": f"No workouts found for {body_type} body type",
                    "user_bodytype_id": body_type_profile.id,
                    "existing_bodytype_ids": list(WorkoutProgram.objects.values_list('bodytype_id', flat=True).distinct())
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Serialize workouts
        serializer = WorkoutProgramSerializer(workouts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class WorkoutCategoriesView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        # Return list of workout categories
        categories = [choice[0] for choice in WorkoutProgram.CATEGORY_CHOICES]
        return Response(categories, status=status.HTTP_200_OK)

class UserWorkoutView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        # Get user's workouts
        user_workouts = UserWeekWorkout.objects.filter(user=request.user)
        serializer = UserWorkoutSerializer(user_workouts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Start a new workout
        workout_id = request.data.get('workout_id')
        workout = get_object_or_404(WorkoutProgram, id=workout_id)

        # Create or update UserWorkout
        user_workout, created = UserWeekWorkout.objects.get_or_create(
            user=request.user, 
            workout=workout
        )
        
        user_workout.started_at = timezone.now()
        user_workout.save()

        serializer = UserWorkoutSerializer(user_workout)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request):
        # End workout and log calories
        workout_id = request.data.get('workout_id')
        calories = request.data.get('calories', 0)

        user_workout = get_object_or_404(
            UserWeekWorkout, 
            user=request.user, 
            workout_id=workout_id, 
            ended_at__isnull=True
        )
        
        user_workout.ended_at = timezone.now()
        user_workout.calories_burned = calories
        user_workout.save()

        serializer = UserWorkoutSerializer(user_workout)
        return Response(serializer.data, status=status.HTTP_200_OK)

class FavoriteWorkoutToggleView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        workout_id = request.data.get('workout_id')
        workout = get_object_or_404(WorkoutProgram, id=workout_id)

        user_workout, created = UserWeekWorkout.objects.get_or_create(
            user=request.user, 
            workout=workout
        )
        
        user_workout.is_favorite = not user_workout.is_favorite
        user_workout.save()

        serializer = UserWorkoutSerializer(user_workout)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        """
        Retrieve user profile details
        """
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        """
        Update user profile
        """
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DietaryPreferenceUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        dietary_preference, created = DietaryPreference.objects.get_or_create(user=request.user)
        serializer = DietaryPreferenceSerializer(dietary_preference)
        return Response(serializer.data)

    def put(self, request):
        dietary_preference, created = DietaryPreference.objects.get_or_create(user=request.user)
        serializer = DietaryPreferenceSerializer(dietary_preference, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PhysicalProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        physical_profile, created = PhysicalProfile.objects.get_or_create(user=request.user)
        serializer = PhysicalProfileSerializer(physical_profile)
        return Response(serializer.data)

    def put(self, request):
        physical_profile, created = PhysicalProfile.objects.get_or_create(user=request.user)
        serializer = PhysicalProfileSerializer(physical_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BodyTypeProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        body_type_profile, created = BodyTypeProfile.objects.get_or_create(user=request.user)
        serializer = BodyTypeProfileSerializer(body_type_profile)
        return Response(serializer.data)

    def put(self, request):
        body_type_profile, created = BodyTypeProfile.objects.get_or_create(user=request.user)
        serializer = BodyTypeProfileSerializer(body_type_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class WorkoutProgramListView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        """
        Get available workout programs
        """
        programs = WorkoutProgram.objects.all()
        serializer = WorkoutProgramSerializer(programs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class WorkoutProgramProgressView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, program_id):
        """
        Get user's progress in a specific workout program
        """
        program = get_object_or_404(WorkoutProgram, id=program_id)
        
        # Get or create user's workout progress
        progress, created = UserWorkoutProgress.objects.get_or_create(
            user=request.user,
            program=program
        )
        
        serializer = UserWorkoutProgressSerializer(progress)
        return Response(serializer.data, status=status.HTTP_200_OK)

class WorkoutDayListView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, program_id, week_number):
        """
        Get workout days for a specific program and week
        """
        workout_days = WorkoutDay.objects.filter(
            program_id=program_id
        ).order_by('week_number', 'day_number')

        # Filter the workout days for the specified week
        week_days = workout_days.filter(week_number=week_number)

        serializer = WorkoutDaySerializer(week_days, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class WorkoutDayDetailView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, day_id):
        """
        Get detailed workout for a specific day
        """
        workout_day = get_object_or_404(WorkoutDay, id=day_id)
        serializer = WorkoutDaySerializer(workout_day)
        return Response(serializer.data, status=status.HTTP_200_OK)

class WorkoutStartView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, day_id):
        """
        Start a workout day
        """
        workout_day = get_object_or_404(WorkoutDay, id=day_id)
        
        # Update user workout progress
        progress, created = UserWorkoutProgress.objects.get_or_create(
            user=request.user,
            program=workout_day.program
        )
        
        progress.current_week = workout_day.week_number
        progress.current_day = workout_day.day_number
        progress.save()
        
        # Track individual exercise progress
        for exercise in workout_day.exercises.all():
            UserExerciseProgress.objects.get_or_create(
                user=request.user,
                exercise=exercise
            )
        
        return Response({
            'message': 'Workout started',
            'day': WorkoutDaySerializer(workout_day).data
        }, status=status.HTTP_200_OK)

class WorkoutCompleteView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, day_id):
        """
        Complete a workout day with progress tracking
        """
        workout_day = get_object_or_404(WorkoutDay, id=day_id)
        
        # Update workout progress
        progress = UserWorkoutProgress.objects.get(
            user=request.user, 
            program=workout_day.program
        )
        
        # Mark day as completed
        progress.completed_workouts.add(workout_day)
        
        # Calculate progress percentage
        total_days = WorkoutDay.objects.filter(
            program=workout_day.program, 
            week_number=workout_day.week_number
        ).count()
        completed_days = progress.completed_workouts.filter(
            week_number=workout_day.week_number
        ).count()
        
        progress.progress_percentage = (completed_days / total_days) * 100
        
        # Update total workout stats
        progress.total_calories_burned += sum(
            exercise.calories_burned for exercise in workout_day.exercises.all()
        )
        progress.save()
        
        return Response({
            'message': 'Workout completed',
            'progress_percentage': progress.progress_percentage
        }, status=status.HTTP_200_OK)

class UserWorkoutStatsView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        """
        Get overall workout statistics for the user
        """
        workout_progresses = UserWorkoutProgress.objects.filter(user=request.user)
        
        stats = {
            'total_programs_enrolled': workout_progresses.count(),
            'total_calories_burned': sum(progress.total_calories_burned for progress in workout_progresses),
            'total_workout_time': sum((progress.total_workout_time for progress in workout_progresses), timezone.timedelta()),
            'completed_programs': workout_progresses.filter(
                progress_percentage=100
            ).count()
        }
        
        return Response(stats, status=status.HTTP_200_OK)
    
class ExerciseDetailView(APIView):
    """
    Retrieve details of a specific exercise
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, exercise_id):
        exercise = get_object_or_404(WorkoutExercise, id=exercise_id)
        
        # Check if user has existing progress for this exercise
        user_progress, created = UserExerciseProgress.objects.get_or_create(
            user=request.user,
            exercise=exercise
        )
        
        serializer = UserExerciseProgressSerializer(user_progress)
        return Response({
            'exercise': {
                'id': exercise.id,
                'name': exercise.name,
                'description': exercise.description,
                'default_duration': exercise.default_duration,
                'default_reps': exercise.default_reps,
                'demonstration_video_url': exercise.demonstration_video_url,
                'animation_path': exercise.animation_path
            },
            'user_progress': serializer.data
        }, status=status.HTTP_200_OK)

class UpdateExerciseProgressView(APIView):
    """
    Update user's progress for a specific exercise
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def put(self, request, exercise_id):
        exercise = get_object_or_404(WorkoutExercise, id=exercise_id)
        
        # Get or create user progress
        user_progress, created = UserExerciseProgress.objects.get_or_create(
            user=request.user,
            exercise=exercise
        )
        
        # Update progress
        serializer = UserExerciseProgressSerializer(
            user_progress, 
            data=request.data, 
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Exercise progress updated successfully',
                'progress': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WorkoutDayProgressView(APIView):
    """
    Track and calculate progress for an entire workout day
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, day_id):
        """
        Get overall progress for a workout day
        """
        workout_day = get_object_or_404(WorkoutDay, id=day_id)
        
        # Get progress for each exercise in the day
        exercise_progresses = []
        total_calories_burned = 0
        
        for exercise in workout_day.exercises.all():
            user_progress, _ = UserExerciseProgress.objects.get_or_create(
                user=request.user,
                exercise=exercise
            )
            
            serializer = UserExerciseProgressSerializer(user_progress)
            exercise_progresses.append(serializer.data)
            total_calories_burned += user_progress.calories_burned
        
        return Response({
            'workout_day': {
                'id': workout_day.id,
                'week_number': workout_day.week_number,
                'day_number': workout_day.day_number
            },
            'exercises': exercise_progresses,
            'total_calories_burned': total_calories_burned
        }, status=status.HTTP_200_OK)

    def post(self, request, day_id):
        """
        Complete a workout day and finalize progress
        """
        workout_day = get_object_or_404(WorkoutDay, id=day_id)
        
        # Update progress for each exercise
        exercise_progresses = []
        total_calories_burned = 0
        
        for exercise in workout_day.exercises.all():
            user_progress, _ = UserExerciseProgress.objects.get_or_create(
                user=request.user,
                exercise=exercise
            )
            
            # Update exercise progress from request data
            progress_data = request.data.get(str(exercise.id), {})
            serializer = UserExerciseProgressSerializer(
                user_progress, 
                data=progress_data, 
                partial=True
            )
            
            if serializer.is_valid():
                serializer.save()
                exercise_progresses.append(serializer.data)
                total_calories_burned += serializer.data['calories_burned']
        
        return Response({
            'message': 'Workout day completed successfully',
            'exercises': exercise_progresses,
            'total_calories_burned': total_calories_burned
        }, status=status.HTTP_200_OK)
    
class FoodCategoryListView(APIView):
    """
    Retrieve food categories filtered by body type
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            # Retrieve the user's body type profile
            try:
                body_type_profile = BodyTypeProfile.objects.get(user=request.user)
                body_type = body_type_profile.body_type
            except BodyTypeProfile.DoesNotExist:
                return Response(
                    {"error": "No body type profile found for the user"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            categories = FoodCategory.objects.filter(bodytype__body_type=body_type)

            # Fetch food categories based on body type
            # if body_type == 'FLABBY':
            #     categories = FoodCategory.objects.filter(body_type='FLABBY')
            # elif body_type == 'SKINNY':
            #     categories = FoodCategory.objects.filter(body_type='SKINNY')
            # elif body_type == 'IDEAL':
            #     categories = FoodCategory.objects.filter(body_type='IDEAL')
            # else:
            #     categories = FoodCategory.objects.filter(body_type__in=['FLABBY', 'SKINNY', 'IDEAL'])

            # Check if categories exist
            if not categories.exists():
                return Response(
                    {"error": f"No food categories found for {body_type} body type"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Serialize and return data
            serializer = FoodCategorySerializer(categories, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": "Error retrieving food categories", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
class FoodListView(APIView):
    """
    Retrieve food items filtered by body type and other parameters
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            # Retrieve the user's body type profile
            try:
                body_type_profile = BodyTypeProfile.objects.get(user=request.user)
                body_type = body_type_profile.body_type
            except BodyTypeProfile.DoesNotExist:
                return Response(
                    {"error": "No body type profile found for the user"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            foods = Food.objects.filter(bodytype__body_type=body_type)

            # Filter food items based on body type
            # if body_type == 'FLABBY':
            #     foods = Food.objects.filter(body_type='FLABBY')
            # elif body_type == 'SKINNY':
            #     foods = Food.objects.filter(body_type='SKINNY')
            # elif body_type == 'IDEAL':
            #     foods = Food.objects.filter(body_type='IDEAL')
            # else:
            #     foods = Food.objects.filter(body_type__in=['FLABBY', 'SKINNY', 'IDEAL'])

            # Additional filtering: meal type and recommended status

            meal_type = request.query_params.get('meal_type')
            if meal_type:
                foods = foods.filter(meal_type=meal_type)

            recommended_only = request.query_params.get('recommended', 'false').lower() == 'true'
            if recommended_only:
                foods = foods.filter(is_recommended=True)


            # Check if any foods exist
            if not foods.exists():
                return Response(
                    {"error": f"No food items found for {body_type} body type"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Serialize and return data
            serializer = FoodSerializer(foods, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": "Error retrieving food items", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
class UserFoodLogView(APIView):
    """
    Manage user's food log with additional functionality
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        """
        Retrieve user's food log for the current day
        """
        from django.utils import timezone
        today = timezone.now().date()
        
        food_logs = UserFoodLog.objects.filter(
            user=request.user, 
            consumed_at__date=today
        ).order_by('-consumed_at')
        
        serializer = UserFoodLogSerializer(food_logs, many=True)
        
        # Calculate total daily metrics
        total_calories = sum(log.calories_consumed for log in food_logs)
        
        response_data = {
            'food_logs': serializer.data,
            'total_calories': total_calories
        }
        
        return Response(response_data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Log a food item consumption with additional validation
        """
        food_id = request.data.get('food_id')
        serving_size = request.data.get('serving_size', 1)

        try:
            food = Food.objects.get(id=food_id)
            
            # Check if the food is suitable for user's body type
            body_type_profile = BodyTypeProfile.objects.get(user=request.user)
            if food.body_type not in [body_type_profile.body_type, 'IDEAL']:
                return Response(
                    {"error": "This food is not recommended for your body type"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            food_log = UserFoodLog.objects.create(
                user=request.user,
                food=food,
                serving_size=serving_size
            )

            serializer = UserFoodLogSerializer(food_log)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Food.DoesNotExist:
            return Response(
                {"error": "Food item not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except BodyTypeProfile.DoesNotExist:
            return Response(
                {"error": "No body type profile found"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
class DailyNutritionSummaryView(APIView):
    """
    Get daily nutrition summary for the user
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        today = timezone.now().date()

        # Get today's food logs
        food_logs = UserFoodLog.objects.filter(
            user=request.user, 
            consumed_at__date=today
        )

        # Calculate total nutrients
        total_calories = sum(log.calories_consumed for log in food_logs)
        total_protein = sum(log.food.protein * log.serving_size for log in food_logs)
        total_carbs = sum(log.food.carbs * log.serving_size for log in food_logs)
        total_fat = sum(log.food.fat * log.serving_size for log in food_logs)

        # Get user's body type profile
        try:
            body_type_profile = PhysicalProfile.objects.get(user=request.user)
            bmi = body_type_profile.bmi
            weight = body_type_profile.weight
        except PhysicalProfile.DoesNotExist:
            bmi = None
            weight = None

        summary = {
            'total_calories': total_calories,
            'total_protein': total_protein,
            'total_carbs': total_carbs,
            'total_fat': total_fat,
            'bmi': bmi,
            'weight': weight
        }

        return Response(summary, status=status.HTTP_200_OK)
    
class FoodCategoriesView(APIView):
    """
    Get list of food categories
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        """
        Return list of food category choices
        """
        categories = [choice[0] for choice in FoodCategory.CATEGORY_CHOICES]
        return Response(categories, status=status.HTTP_200_OK)
    
class FavoriteFoodView(APIView):
    """
    Manage user's favorite foods
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        """
        Add or remove a food item from favorites
        """
        food_id = request.data.get('food_id')
        
        try:
            food = Food.objects.get(id=food_id)
            
            # Check if the food is already a favorite
            favorite, created = FavoriteFoods.objects.get_or_create(
                user=request.user,
                food=food
            )
            
            if not created:
                # If already exists, remove from favorites
                favorite.delete()
                return Response(
                    {"message": "Food removed from favorites", "is_favorite": False},
                    status=status.HTTP_200_OK
                )
            
            return Response(
                {"message": "Food added to favorites", "is_favorite": True},
                status=status.HTTP_201_CREATED
            )

        except Food.DoesNotExist:
            return Response(
                {"error": "Food item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def get(self, request):
        """
        Retrieve user's favorite foods
        """
        favorite_foods = FavoriteFoods.objects.filter(user=request.user)
        
        # Use the context to pass request for is_favorite method
        serializer = FoodSerializer(
            [fav.food for fav in favorite_foods], 
            many=True, 
            context={'request': request}
        )
        
        return Response(serializer.data, status=status.HTTP_200_OK)

class MealTypeFilterView(APIView):
    """
    Retrieve foods by meal type with consumption tracking
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        """
        Retrieve foods for a specific meal type
        """
        try:
            # Get user's body type
            body_type_profile = BodyTypeProfile.objects.get(user=request.user)
            body_type = body_type_profile.body_type

            # Base queryset for foods matching the user's body type
            foods = Food.objects.filter(bodytype__body_type=body_type)

            category_name = request.query_params.get('category_name')
            if category_name:
                foods = foods.filter(category__name__iexact=category_name)

            # Apply meal type filter if provided
            meal_type = request.query_params.get('meal_type')
            if meal_type:
                foods = foods.filter(meal_type=meal_type)

            # Apply 'recommended only' filter if specified
            recommended_only = request.query_params.get('recommended', 'false').lower() == 'true'
            if recommended_only:
                foods = foods.filter(is_recommended=True)

            # Check if any foods exist
            if not foods.exists():
                return Response(
                    {"error": f"No food items found for {body_type} body type"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Get today's consumed food IDs for the user and meal type
            consumed_foods = UserFoodLog.objects.filter(
                user=request.user,
                food__meal_type=meal_type,
                consumed_at__date=timezone.now().date()
            ).values_list('food_id', flat=True)

            # Exclude consumed foods
            foods = foods.exclude(id__in=consumed_foods)

            # Serialize and return the filtered foods
            serializer = FoodSerializer(
                foods, 
                many=True, 
                context={'request': request}
            )

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Food.DoesNotExist:
            return Response(
                {"error": "Food item not found"},
                status=status.HTTP_404_NOT_FOUND
            )
    

    def post(self, request):
        """
        Mark food as consumed for a specific meal type
        """
        food_id = request.data.get('food_id')
        serving_size = request.data.get('serving_size')
        
        try:
            food = Food.objects.get(id=food_id)
            
            # Create food log entry
            food_log = UserFoodLog.objects.create(
                user=request.user,
                food=food,
                serving_size=serving_size # Default quantity
            )
            
            # Serialize the consumed food log
            serializer = UserFoodLogSerializer(food_log)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Food.DoesNotExist:
            return Response(
                {"error": "Food item not found"},
                status=status.HTTP_404_NOT_FOUND
            )
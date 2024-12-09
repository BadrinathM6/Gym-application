from rest_framework import serializers
from .models import CustomUser, FavoriteFoods, FoodCategory, Food, UserFoodLog, DietaryPreference, PhysicalProfile, BodyTypeProfile, HomeBanner, HomeProgram, WorkoutProgram, WorkoutExercise, WorkoutDay, UserExerciseProgress, UserWorkoutProgress, UserWeekWorkout

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('user_id', 'gender', 'age')
        extra_kwargs = {
            'password': {'write_only': True},
            'age': {'required': True, 'min_value': 13, 'max_value': 100}
        }
    
    def validate_age(self, value):
        """
        Validate age constraints
        """
        if value < 13:
            raise serializers.ValidationError("Users must be at least 13 years old")
        if value > 100:
            raise serializers.ValidationError("Please enter a valid age")
        return value

class LoginSerializer(serializers.Serializer):
    user_id = serializers.CharField(max_length=50)
    password = serializers.CharField(max_length=128, write_only=True)
    gender = serializers.ChoiceField(choices=CustomUser.GENDER_CHOICES, required=False)

    def validate(self, data):
        if not data.get('user_id') or not data.get('password'):
            raise serializers.ValidationError("User ID and password are required.")
        return data

class DietaryPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietaryPreference
        fields = ['diet_type', 'allergies', 'dietary_restrictions']
        
    def create(self, validated_data):
        user = self.context['request'].user
        dietary_preference, created = DietaryPreference.objects.get_or_create(
            user=user, 
            defaults=validated_data
        )
        
        if not created:
            for key, value in validated_data.items():
                setattr(dietary_preference, key, value)
            dietary_preference.save()
        
        return dietary_preference
    
class PhysicalProfileSerializer(serializers.ModelSerializer):
    bmi = serializers.DecimalField(max_digits=4, decimal_places=2, read_only=True)
    bmi_category = serializers.CharField(read_only=True)

    class Meta:
        model = PhysicalProfile
        fields = [
            'height',
            'weight',
            'bmi',
            'bmi_category',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):
        """
        Validate height and weight values
        """
        height = data.get('height', 0)
        weight = data.get('weight', 0)

        if height <= 0:
            raise serializers.ValidationError("Height must be greater than 0")
        if weight <= 0:
            raise serializers.ValidationError("Weight must be greater than 0")
        if height > 300:  # Reasonable maximum height in cm
            raise serializers.ValidationError("Height seems unrealistic")
        if weight > 500:  # Reasonable maximum weight in kg
            raise serializers.ValidationError("Weight seems unrealistic")

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        physical_profile, created = PhysicalProfile.objects.get_or_create(
            user=user,
            defaults=validated_data
        )
        
        if not created:
            for key, value in validated_data.items():
                setattr(physical_profile, key, value)
            physical_profile.save()
        
        return physical_profile

class BodyTypeProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyTypeProfile
        fields = [
            'body_type',
            'fitness_goal',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        user = self.context['request'].user
        body_type_profile, created = BodyTypeProfile.objects.get_or_create(
            user=user,
            defaults=validated_data
        )
        
        if not created:
            for key, value in validated_data.items():
                setattr(body_type_profile, key, value)
            body_type_profile.save()
        
        return body_type_profile
    
class AIChatSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=1000)

class HomeProgramSerializer(serializers.ModelSerializer):

    class Meta:
        model = HomeProgram
        fields = [
            'id', 
            'title', 
            'category', 
            'description', 
            'image_path'
        ]
        read_only_fields = ['id']

class HomeBannerSerializer(serializers.ModelSerializer):

    class Meta:
        model = HomeBanner
        fields = [
            'id', 
            'title', 
            'subtitle', 
            'image_path', 
            'order'
        ]
        read_only_fields = ['id']

class HomePageSerializer(serializers.Serializer):
    programs = HomeProgramSerializer(many=True)
    banners = HomeBannerSerializer(many=True)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['user_id', 'gender', 'age']
        extra_kwargs = {
            'user_id': {'read_only': True},
            'age': {'required': False}
        }
    
    def validate_age(self, value):
        if value is not None and (value < 13 or value > 100):
            raise serializers.ValidationError("Age must be between 13 and 100")
        return value
    
    def validate_gender(self, value):
        if value not in dict(self.Meta.model.GENDER_CHOICES):
            raise serializers.ValidationError("Invalid gender selection")
        return value
    
class WorkoutExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutExercise
        fields = [
            'id', 
            'name', 
            'description', 
            'default_duration', 
            'default_reps',
            'default_set',
            'calories_per_set',
            'calories_per_minute',
            'demonstration_video_url',
            'animation_path'
        ]

class WorkoutDaySerializer(serializers.ModelSerializer):
    exercises = WorkoutExerciseSerializer(many=True, read_only=True)
    
    class Meta:
        model = WorkoutDay
        fields = ['id', 'week_number', 'day_number', 'difficulty', 'exercises']

class WorkoutProgramSerializer(serializers.ModelSerializer):
    bodytype = serializers.StringRelatedField()
    days = WorkoutDaySerializer(many=True, read_only=True)
    
    class Meta:
        model = WorkoutProgram
        fields = ['id', 'name', 'description', 'total_weeks', 'days', 'week', 'week_no', 'image', 'category', 'bodytype']

class UserWorkoutSerializer(serializers.ModelSerializer):
    workout = WorkoutProgramSerializer(read_only=True)
    
    class Meta:
        model = UserWeekWorkout
        fields = ['id', 'workout', 'is_favorite', 'started_at', 'ended_at', 'calories_burned']

class UserWorkoutProgressSerializer(serializers.ModelSerializer):
    program = WorkoutProgramSerializer(read_only=True)
    
    class Meta:
        model = UserWorkoutProgress
        fields = ['user', 'program', 'current_week', 'current_day', 
                  'progress_percentage', 'total_calories_burned', 'total_workout_time']

class UserExerciseProgressSerializer(serializers.ModelSerializer):
    exercise = WorkoutExerciseSerializer(read_only=True)
    
    class Meta:
        model = UserExerciseProgress
        fields = [
            'id', 
            'exercise', 
            'duration', 
            'reps', 
            'sets_completed', 
            'calories_burned',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['calories_burned']

    def update(self, instance, validated_data):
        # Allow updating duration, reps, and sets_completed
        instance.duration = validated_data.get('duration', instance.duration)
        instance.reps = validated_data.get('reps', instance.reps)
        instance.sets_completed = validated_data.get('sets_completed', instance.sets_completed)
        
        # Recalculate calories
        instance.calories_burned = instance.calculate_calories()
        instance.save()
        
        return instance
    
class FoodCategorySerializer(serializers.ModelSerializer):
    body_type = serializers.CharField(source='bodytype.body_type')
    class Meta:
        model = FoodCategory
        fields = [
            'id', 
            'name', 
            'body_type',
            'description', 
            'image_path'
        ]

class FoodSerializer(serializers.ModelSerializer):
    body_type = serializers.CharField(source='bodytype.body_type', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_body_type = serializers.CharField(source='category.bodytype.body_type', read_only=True)
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Food
        fields = [
            'id', 
            'name', 
            'description', 
            'body_type',
            'category_name',
            'category_body_type',
            'meal_type',
            'calories', 
            'protein', 
            'carbs', 
            'fat', 
            'serving_size', 
            'image_path',
            'is_recommended',
            'is_favorite'
        ]

    def get_is_favorite(self, obj):
        # Check if the request is available in the context
        request = self.context.get('request')
        
        # If no request or user is not authenticated, return False
        if not request or not request.user.is_authenticated:
            return False
        
        # Check if the food is in user's favorites
        return FavoriteFoods.objects.filter(
            user=request.user, 
            food=obj
        ).exists()

class UserFoodLogSerializer(serializers.ModelSerializer):
    food = FoodSerializer(read_only=True)
    
    class Meta:
        model = UserFoodLog
        fields = [
            'id', 
            'user', 
            'food', 
            'serving_size', 
            'consumed_at', 
            'calories_consumed'
        ]
        read_only_fields = ['calories_consumed', 'consumed_at']

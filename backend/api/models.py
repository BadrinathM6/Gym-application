from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.conf import settings

class CustomUserManager(BaseUserManager):
    def create_user(self, user_id, password=None):
        if not user_id:
            raise ValueError('Users must have a user ID')
        
        user = self.model(user_id=user_id)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, user_id, password=None):
        user = self.create_user(user_id=user_id, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
        ('N', 'Prefer not to say')
    ]
    
    user_id = models.CharField(max_length=50, unique=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    age = models.PositiveIntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'user_id'
    REQUIRED_FIELDS = ['gender']
    
    def __str__(self):
        return self.user_id


class DietaryPreference(models.Model):
    DIET_TYPES = [
        ('VEG', 'Vegetarian'),
        ('NON_VEG', 'Non-Vegetarian'),
        ('VEGAN', 'Vegan')
    ]
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='dietary_preference')
    diet_type = models.CharField(max_length=10, choices=DIET_TYPES)
    allergies = models.TextField(blank=True, null=True)
    dietary_restrictions = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.user_id}'s Dietary Preference: {self.get_diet_type_display()}"

class PhysicalProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='physical_profile'
    )
    height = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Height in centimeters"
    )
    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Weight in kilograms"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def bmi(self):
        """Calculate BMI: weight (kg) / (height (m))²"""
        height_in_meters = self.height / 100
        return round(self.weight / (height_in_meters ** 2), 2)

    @property
    def bmi_category(self):
        bmi = self.bmi
        if bmi < 18.5:
            return "Underweight"
        elif 18.5 <= bmi < 25:
            return "Normal weight"
        elif 25 <= bmi < 30:
            return "Overweight"
        else:
            return "Obese"

    def __str__(self):
        return f"{self.user.user_id}'s Physical Profile - BMI: {self.bmi}"

class BodyTypeProfile(models.Model):
    BODY_TYPE_CHOICES = [
        ('SKINNY', 'Skinny - Need to gain muscle mass'),
        ('FLABBY', 'Flabby - Need to lose fat and tone up'),
        ('IDEAL', 'Ideal - Maintain current physique')
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='body_type_profile'
    )
    body_type = models.CharField(
        max_length=20,
        choices=BODY_TYPE_CHOICES
    )
    fitness_goal = models.TextField(
        help_text="Specific fitness goals based on body type",
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.user_id}'s Body Type - {self.get_body_type_display()}"

class HomeProgram(models.Model):
    PROGRAM_CATEGORIES = [
        ('WEIGHT_LOSS', 'Weight Loss'),
        ('STRENGTH', 'Strength Training'), 
        ('YOGA', 'Yoga'),
        ('CARDIO', 'Cardio')
    ]

    title = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=PROGRAM_CATEGORIES)
    description = models.TextField(blank=True)
    image_path = models.CharField(max_length=255) # Use image path instead of ImageField
    active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.title

class HomeBanner(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True, null=True)
    image_path = models.CharField(max_length=255) # Use image path instead of ImageField
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class WorkoutProgram(models.Model):
    
    WEEK_CHOICES = [
        ('Week 1', 'Assessment Week'),
        ('Week 2', 'Main Part'),
        ('Week 3', 'Deload Week'),
        ('Week 4', 'Brutal Week'),
        ('Week 5', 'Stretching')
    ]

    CATEGORY_CHOICES = [
        ('Abs', 'Abs'),
        ('Upper Body', 'Upper Body'),
        ('Lower Body', 'Lower Body'),
        ('Cardio', 'Cardio')
    ]

    name = models.CharField(max_length=200)
    description = models.TextField()
    total_weeks = models.IntegerField(default=5)
    week_no = models.IntegerField(default=1)
    week = models.CharField(max_length=20, choices=WEEK_CHOICES)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    image = models.CharField(max_length=255)
    bodytype = models.ForeignKey(BodyTypeProfile, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name
    
class UserWeekWorkout(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    workout = models.ForeignKey(WorkoutProgram, on_delete=models.CASCADE)
    is_favorite = models.BooleanField(default=False)
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    calories_burned = models.FloatField(default=0)

    class Meta:
        unique_together = ('user', 'workout')

    def __str__(self):
        return f"{self.user.user_id} - {self.workout.title}"

class WorkoutDay(models.Model):
    """
    Represents a specific day in a workout program
    """
    DIFFICULTY_CHOICES = [
        ('BEGINNER', 'Beginner'),
        ('INTERMEDIATE', 'Intermediate'),
        ('ADVANCED', 'Advanced')
    ]

    program = models.ForeignKey(WorkoutProgram, on_delete=models.CASCADE, related_name='days')
    week_number = models.IntegerField()
    day_number = models.IntegerField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='BEGINNER')
    
    def __str__(self):
        return f"{self.program.name} - Week {self.week_number} Day {self.day_number}"

class WorkoutExercise(models.Model):
    """
    Represents individual exercises for a specific workout day
    """
    EQUIPMENT_CHOICES = [
        ('BODYWEIGHT', 'Bodyweight'),
        ('DUMBBELL', 'Dumbbell'),
        ('RESISTANCE_BAND', 'Resistance Band'),
        ('NO_EQUIPMENT', 'No Equipment')
    ]

    workout_day = models.ForeignKey(WorkoutDay, on_delete=models.CASCADE, related_name='exercises')
    name = models.CharField(max_length=200)
    description = models.TextField()
    default_duration = models.IntegerField(default=20)  # in seconds
    default_reps = models.IntegerField(default=10)
    default_set= models.IntegerField(default=1)
    calories_per_set = models.FloatField(default=0.5)  # estimated calories burned per set
    calories_per_minute = models.FloatField(default=0)
    demonstration_video_url = models.URLField(null=True, blank=True)
    animation_path = models.CharField(max_length=255, null=True, blank=True)

class UserWorkoutProgress(models.Model):
    """
    Tracks user progress through workout programs
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    program = models.ForeignKey(WorkoutProgram, on_delete=models.CASCADE)
    current_week = models.IntegerField(default=1)
    current_day = models.IntegerField(default=1)
    progress_percentage = models.FloatField(default=0)
    
    completed_workouts = models.ManyToManyField(WorkoutDay, related_name='completed_by')
    total_calories_burned = models.FloatField(default=0)
    total_workout_time = models.DurationField(default=timezone.timedelta)

class UserExerciseProgress(models.Model):
    """
    Track individual user's progress for a specific exercise
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    exercise = models.ForeignKey(WorkoutExercise, on_delete=models.CASCADE)
    
    # Customizable exercise parameters
    duration = models.IntegerField(default=0)  # in seconds
    reps = models.IntegerField(default=0)
    sets_completed = models.IntegerField(default=0)
    
    # Progress tracking
    progress_percentage = models.FloatField(default=0)
    total_workout_time = models.IntegerField(default=0)  # in seconds
    
    # Calories tracking
    calories_burned = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_progress_percentage(self):
        """
        Calculate progress percentage based on both duration and sets/reps.
        """
        duration_progress = 0
        sets_progress = 0

        # Calculate progress for duration
        if self.duration > 0 and self.exercise.default_duration > 0:
            duration_progress = (self.duration / self.exercise.default_duration) * 100

        # Calculate progress for sets
        if self.sets_completed > 0 and self.exercise.default_set > 0:
            sets_progress = (self.sets_completed / self.exercise.default_set) * 100

        # Combine progress metrics if both are applicable
        if self.exercise.default_duration > 0 and self.exercise.default_set > 0:
            total_progress = (duration_progress + sets_progress) / 2
        elif self.exercise.default_duration > 0:
            total_progress = duration_progress
        else:
            total_progress = sets_progress

        # Clamp progress between 0 and 100
        return min(max(total_progress, 0), 100)

    def calculate_calories(self):
        """
        Calculate calories burned based on sets, reps, and duration.
        """
        calories = 0.0

        # Calories from sets
        if self.sets_completed > 0:
            calories += self.exercise.calories_per_set * self.sets_completed

        # Calories from duration
        if self.duration > 0:
            calories += (self.duration / 60) * self.exercise.calories_per_minute

        return round(calories, 2)

    def save(self, *args, **kwargs):
        # Auto-calculate progress percentage and calories when saving
        self.progress_percentage = self.calculate_progress_percentage()
        self.total_workout_time = self.duration
        self.calories_burned = self.calculate_calories()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.exercise.name} Progress"

class FoodCategory(models.Model):

    name = models.CharField(max_length=100)
    bodytype = models.ForeignKey(BodyTypeProfile, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)
    image_path = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.body_type} - {self.category}"

class Food(models.Model):
    MEAL_TYPE_CHOICES = [
        ('BREAKFAST', 'Breakfast'),
        ('LUNCH', 'Lunch'),
        ('DINNER', 'Dinner'),
        ('SNACKS', 'Snacks')
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(FoodCategory, on_delete=models.CASCADE, related_name='foods', default=1)
    bodytype = models.ForeignKey(BodyTypeProfile, on_delete=models.CASCADE)
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPE_CHOICES)
    calories = models.IntegerField()
    protein = models.DecimalField(max_digits=5, decimal_places=2)
    carbs = models.DecimalField(max_digits=5, decimal_places=2)
    fat = models.DecimalField(max_digits=5, decimal_places=2)
    serving_size = models.CharField(max_length=100)
    image_path = models.CharField(max_length=255, blank=True, null=True)
    is_recommended = models.BooleanField(default=False)

class UserFoodLog(models.Model):
    """
    Tracks user's food consumption
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    serving_size = models.DecimalField(max_digits=5, decimal_places=2, default=100)
    consumed_at = models.DateTimeField(auto_now_add=True)
    calories_consumed = models.IntegerField()

    def save(self, *args, **kwargs):
        """
        Calculate calories consumed based on quantity
        """
        self.calories_consumed = self.food.calories * (self.serving_size)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.user_id} - {self.food.name} - {self.consumed_at}"
    
class FavoriteFoods(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'food')

    def __str__(self):
        return f"{self.user.username}'s favorite - {self.food.name}"
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
    sets = models.IntegerField()
    reps = models.IntegerField()
    rest_time = models.IntegerField(help_text="Rest time in seconds")
    equipment = models.CharField(max_length=50, choices=EQUIPMENT_CHOICES)
    demonstration_video_url = models.URLField(null=True, blank=True)
    calories_burned = models.FloatField(default=0)

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
    Tracks individual exercise completions and progress
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    exercise = models.ForeignKey(WorkoutExercise, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    sets_completed = models.IntegerField(default=0)
    time_spent = models.DurationField(default=timezone.timedelta)
    calories_burned = models.FloatField(default=0)
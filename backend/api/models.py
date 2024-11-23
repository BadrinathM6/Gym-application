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
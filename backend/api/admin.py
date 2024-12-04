from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser, PhysicalProfile, HomeProgram, HomeBanner, DietaryPreference, BodyTypeProfile, WorkoutProgram, WorkoutDay, WorkoutExercise, UserWeekWorkout, UserWorkoutProgress, UserExerciseProgress

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('user_id', 'is_active', 'is_staff', 'last_login', 'date_joined')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'date_joined')
    search_fields = ('user_id',)
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('user_id', 'password')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('user_id', 'password1', 'password2', 'is_active', 'is_staff'),
        }),
    )
    
    readonly_fields = ('date_joined', 'last_login')


# Custom filter for BMI category in PhysicalProfile
class BMICategoryFilter(admin.SimpleListFilter):
    title = 'BMI Category'
    parameter_name = 'bmi_category'

    def lookups(self, request, model_admin):
        return [
            ('underweight', 'Underweight'),
            ('normal', 'Normal weight'),
            ('overweight', 'Overweight'),
            ('obese', 'Obese'),
        ]

    def queryset(self, request, queryset):
        if self.value() == 'underweight':
            return queryset.filter(weight__lt=18.5)
        elif self.value() == 'normal':
            return queryset.filter(weight__gte=18.5, weight__lt=25)
        elif self.value() == 'overweight':
            return queryset.filter(weight__gte=25, weight__lt=30)
        elif self.value() == 'obese':
            return queryset.filter(weight__gte=30)
        return queryset


# Admin for PhysicalProfile
@admin.register(PhysicalProfile)
class PhysicalProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'height', 'weight', 'bmi', 'bmi_category', 'created_at', 'updated_at')
    list_filter = (BMICategoryFilter,)  # Use the custom filter
    search_fields = ('user__user_id',)


# Admin for DietaryPreference
@admin.register(DietaryPreference)
class DietaryPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'diet_type', 'allergies', 'dietary_restrictions')
    list_filter = ('diet_type',)
    search_fields = ('user__user_id',)


# Admin for BodyTypeProfile
@admin.register(BodyTypeProfile)
class BodyTypeProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'body_type', 'fitness_goal', 'created_at', 'updated_at')
    list_filter = ('body_type',)
    search_fields = ('user__user_id',)

@admin.register(HomeProgram)
class HomeProgramAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'active')
    list_filter = ('category', 'active')
    search_fields = ('title', 'description')

# Admin for HomeBanner
@admin.register(HomeBanner)
class HomeBannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle', 'order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title', 'subtitle')
    ordering = ('order',)

# Admin for WorkoutProgram
@admin.register(WorkoutProgram)
class WorkoutProgramAdmin(admin.ModelAdmin):
    list_display = ('name', 'week', 'category', 'total_weeks')
    list_filter = ('week', 'category')
    search_fields = ('name', 'description')

# Admin for WorkoutDay
@admin.register(WorkoutDay)
class WorkoutDayAdmin(admin.ModelAdmin):
    list_display = ('program', 'week_number', 'day_number', 'difficulty')
    list_filter = ('difficulty', 'program')
    search_fields = ('program__name',)

# Admin for WorkoutExercise
@admin.register(WorkoutExercise)
class WorkoutExerciseAdmin(admin.ModelAdmin):
    list_display = ('name', 'workout_day', 'sets', 'reps', 'equipment')
    list_filter = ('equipment', 'workout_day__program')
    search_fields = ('name', 'description')

# Admin for UserWeekWorkout
@admin.register(UserWeekWorkout)
class UserWeekWorkoutAdmin(admin.ModelAdmin):
    list_display = ('user', 'workout', 'is_favorite', 'started_at', 'ended_at')
    list_filter = ('is_favorite', 'workout__category')
    search_fields = ('user__user_id', 'workout__name')

# Admin for UserWorkoutProgress
@admin.register(UserWorkoutProgress)
class UserWorkoutProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'program', 'current_week', 'current_day', 'progress_percentage')
    list_filter = ('program', 'current_week')
    search_fields = ('user__user_id', 'program__name')

# Admin for UserExerciseProgress
@admin.register(UserExerciseProgress)
class UserExerciseProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'exercise', 'completed', 'sets_completed', 'calories_burned')
    list_filter = ('completed', 'exercise__workout_day__program')
    search_fields = ('user__user_id', 'exercise__name')



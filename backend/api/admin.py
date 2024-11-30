from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser, PhysicalProfile, HomeProgram, HomeBanner, DietaryPreference, BodyTypeProfile

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

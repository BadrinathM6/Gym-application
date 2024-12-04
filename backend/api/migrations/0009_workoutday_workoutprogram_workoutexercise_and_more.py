# Generated by Django 5.1.3 on 2024-12-03 16:57

import datetime
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_workout_userworkout'),
    ]

    operations = [
        migrations.CreateModel(
            name='WorkoutDay',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('week_number', models.IntegerField()),
                ('day_number', models.IntegerField()),
                ('difficulty', models.CharField(choices=[('BEGINNER', 'Beginner'), ('INTERMEDIATE', 'Intermediate'), ('ADVANCED', 'Advanced')], default='BEGINNER', max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='WorkoutProgram',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('total_weeks', models.IntegerField(default=5)),
                ('week', models.CharField(choices=[('Week 1', 'Assessment Week'), ('Week 2', 'Main Part'), ('Week 3', 'Deload Week'), ('Week 4', 'Brutal Week'), ('Week 5', 'Stretching')], max_length=20)),
                ('category', models.CharField(choices=[('Abs', 'Abs'), ('Upper Body', 'Upper Body'), ('Lower Body', 'Lower Body'), ('Cardio', 'Cardio')], max_length=20)),
                ('image', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='WorkoutExercise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('sets', models.IntegerField()),
                ('reps', models.IntegerField()),
                ('rest_time', models.IntegerField(help_text='Rest time in seconds')),
                ('equipment', models.CharField(choices=[('BODYWEIGHT', 'Bodyweight'), ('DUMBBELL', 'Dumbbell'), ('RESISTANCE_BAND', 'Resistance Band'), ('NO_EQUIPMENT', 'No Equipment')], max_length=50)),
                ('demonstration_video_url', models.URLField(blank=True, null=True)),
                ('calories_burned', models.FloatField(default=0)),
                ('workout_day', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exercises', to='api.workoutday')),
            ],
        ),
        migrations.CreateModel(
            name='UserExerciseProgress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('completed', models.BooleanField(default=False)),
                ('sets_completed', models.IntegerField(default=0)),
                ('time_spent', models.DurationField(default=datetime.timedelta)),
                ('calories_burned', models.FloatField(default=0)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.workoutexercise')),
            ],
        ),
        migrations.AddField(
            model_name='workoutday',
            name='program',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='days', to='api.workoutprogram'),
        ),
        migrations.CreateModel(
            name='UserWorkoutProgress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('current_week', models.IntegerField(default=1)),
                ('current_day', models.IntegerField(default=1)),
                ('progress_percentage', models.FloatField(default=0)),
                ('total_calories_burned', models.FloatField(default=0)),
                ('total_workout_time', models.DurationField(default=datetime.timedelta)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('completed_workouts', models.ManyToManyField(related_name='completed_by', to='api.workoutday')),
                ('program', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.workoutprogram')),
            ],
        ),
        migrations.CreateModel(
            name='UserWeekWorkout',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_favorite', models.BooleanField(default=False)),
                ('started_at', models.DateTimeField(blank=True, null=True)),
                ('ended_at', models.DateTimeField(blank=True, null=True)),
                ('calories_burned', models.FloatField(default=0)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('workout', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.workoutprogram')),
            ],
            options={
                'unique_together': {('user', 'workout')},
            },
        ),
        migrations.DeleteModel(
            name='UserWorkout',
        ),
        migrations.DeleteModel(
            name='Workout',
        ),
    ]
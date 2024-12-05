# Generated by Django 5.1.3 on 2024-12-05 07:49

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_workoutprogram_week_no'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userexerciseprogress',
            name='completed',
        ),
        migrations.RemoveField(
            model_name='userexerciseprogress',
            name='time_spent',
        ),
        migrations.RemoveField(
            model_name='workoutexercise',
            name='calories_burned',
        ),
        migrations.RemoveField(
            model_name='workoutexercise',
            name='equipment',
        ),
        migrations.RemoveField(
            model_name='workoutexercise',
            name='reps',
        ),
        migrations.RemoveField(
            model_name='workoutexercise',
            name='rest_time',
        ),
        migrations.RemoveField(
            model_name='workoutexercise',
            name='sets',
        ),
        migrations.AddField(
            model_name='userexerciseprogress',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userexerciseprogress',
            name='duration',
            field=models.IntegerField(default=20),
        ),
        migrations.AddField(
            model_name='userexerciseprogress',
            name='reps',
            field=models.IntegerField(default=10),
        ),
        migrations.AddField(
            model_name='userexerciseprogress',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='workoutexercise',
            name='animation_path',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='workoutexercise',
            name='calories_per_set',
            field=models.FloatField(default=0.5),
        ),
        migrations.AddField(
            model_name='workoutexercise',
            name='default_duration',
            field=models.IntegerField(default=20),
        ),
        migrations.AddField(
            model_name='workoutexercise',
            name='default_reps',
            field=models.IntegerField(default=10),
        ),
    ]

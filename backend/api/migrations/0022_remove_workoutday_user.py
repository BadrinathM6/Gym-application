# Generated by Django 5.1.3 on 2025-01-02 10:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_workoutday_user_alter_customuser_age_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='workoutday',
            name='user',
        ),
    ]

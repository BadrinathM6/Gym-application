# Generated by Django 5.1.3 on 2024-11-23 14:55

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_dietarypreference'),
    ]

    operations = [
        migrations.CreateModel(
            name='BodyTypeProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body_type', models.CharField(choices=[('SKINNY', 'Skinny - Need to gain muscle mass'), ('FLABBY', 'Flabby - Need to lose fat and tone up'), ('IDEAL', 'Ideal - Maintain current physique')], max_length=20)),
                ('fitness_goal', models.TextField(blank=True, help_text='Specific fitness goals based on body type')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='body_type_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PhysicalProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('height', models.DecimalField(decimal_places=2, help_text='Height in centimeters', max_digits=5)),
                ('weight', models.DecimalField(decimal_places=2, help_text='Weight in kilograms', max_digits=5)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='physical_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]

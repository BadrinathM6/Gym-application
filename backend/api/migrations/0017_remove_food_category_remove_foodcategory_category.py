# Generated by Django 5.1.3 on 2024-12-07 15:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_remove_food_body_type_remove_foodcategory_body_type_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='food',
            name='category',
        ),
        migrations.RemoveField(
            model_name='foodcategory',
            name='category',
        ),
    ]
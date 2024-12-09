# Generated by Django 5.1.3 on 2024-12-09 15:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_remove_userfoodlog_quantity_userfoodlog_serving_size'),
    ]

    operations = [
        migrations.AddField(
            model_name='food',
            name='category',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='foods', to='api.foodcategory'),
        ),
    ]
# Generated by Django 5.1.3 on 2024-11-30 06:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_homebanner_homeprogram'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='homebanner',
            name='image',
        ),
        migrations.RemoveField(
            model_name='homeprogram',
            name='image',
        ),
        migrations.AddField(
            model_name='homebanner',
            name='image_path',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='homeprogram',
            name='image_path',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
    ]

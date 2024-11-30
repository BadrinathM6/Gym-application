from django.core.management.base import BaseCommand
from ...models import HomeProgram, HomeBanner

class Command(BaseCommand):
    help = 'Populate initial home page data'

    def handle(self, *args, **kwargs):
        # Create initial programs
        programs_data = [
            {
                'title': 'Weight Loss',
                'category': 'WEIGHT_LOSS',
                'description': 'Targeted program to help you lose weight effectively',
                'image_path': 'https://res.cloudinary.com/dmohbdzs1/image/upload/v1732948649/kbtqo1watloafihz9pvh.jpg'
            },
            {
                'title': 'Strength Training',
                'category': 'STRENGTH',
                'description': 'Build muscle and increase overall strength',
                'image_path': 'https://res.cloudinary.com/dmohbdzs1/image/upload/v1732948649/lm4qvkmpmwtvagvc4pft.jpg'
            },
            {
                'title': 'Yoga',
                'category': 'YOGA',
                'description': 'Improve flexibility, balance, and mental wellness',
                'image_path': 'https://res.cloudinary.com/dmohbdzs1/image/upload/v1732948649/eoj91tpncbwjzzxzyu5a.jpg'
            },
            {
                'title': 'Cardio',
                'category': 'CARDIO',
                'description': 'Enhance cardiovascular health and endurance',
                'image_path': 'https://res.cloudinary.com/dmohbdzs1/image/upload/v1732948649/pj14sosvfcqwitd5iavk.jpg'
            }
        ]

        for program_info in programs_data:
            HomeProgram.objects.get_or_create(
                title=program_info['title'],
                defaults=program_info
            )

        # Create banner images
        banners_data = [
            {
                'title': 'Join Our Team',
                'subtitle': 'Professional training, personalized results',
                'image_path': 'https://res.cloudinary.com/dmohbdzs1/image/upload/v1732953580/yxtmksfvlpeyxjs8eatt.jpg',
                'order': 1
            },
            {
                'title': 'Gym Facilities',
                'subtitle': 'State-of-the-art fitness equipment',
                'image_path': 'https://res.cloudinary.com/dmohbdzs1/image/upload/v1732953393/Untitled_design_aab2ai.png',
                'order': 2
            },
            {
                'title': 'Healthy Diet',
                'subtitle': 'Comprehensive wellness programs',
                'image_path': 'https://res.cloudinary.com/dmohbdzs1/image/upload/v1732948993/banner1_pm06gk.jpg',
                'order': 3
            }
        ]

        for banner_info in banners_data:
            HomeBanner.objects.get_or_create(
                title=banner_info['title'],
                defaults=banner_info
            )

        self.stdout.write(self.style.SUCCESS('Successfully populated home page data'))
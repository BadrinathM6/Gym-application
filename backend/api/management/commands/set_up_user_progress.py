from django.core.management.base import BaseCommand
from ...models import WorkoutProgram, UserWorkoutProgress

class Command(BaseCommand):
    help = 'Set up initial user workout progress data'

    def handle(self, *args, **options):
        # Define the body types and their respective program details
        body_types = {
            'Ideal': {'total_weeks': 12, 'total_days': 7},
            'Skinny': {'total_weeks': 12, 'total_days': 7},
            'Flabby': {'total_weeks': 12, 'total_days': 7}
        }

        # Create users and workout programs
        for body_type, program_details in body_types.items():
            user = User.objects.create(username=f'{body_type} User')
            program = WorkoutProgram.objects.create(
                name=f'{body_type} Body Type Program',
                total_weeks=program_details['total_weeks']
            )

            # Create UserWorkoutProgress records
            for week in range(1, program_details['total_weeks'] + 1):
                for day in range(1, program_details['total_days'] + 1):
                    UserWorkoutProgress.objects.create(
                        user=user,
                        program=program,
                        current_week=week,
                        current_day=day,
                        progress_percentage=0,
                        total_calories_burned=0,
                        total_workout_time=0
                    )

        self.stdout.write(self.style.SUCCESS('Initial user workout progress data set up successfully.'))
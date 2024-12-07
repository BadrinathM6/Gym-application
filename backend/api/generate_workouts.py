import csv
import random

class WorkoutGenerator:
    def __init__(self):
        self.workout_types = [
            "Running", "Sprint Intervals", "Jump Rope", "High Knees", "Jumping Jacks",
            "Mountain Climbers", "Burpees", "Skater Hops", "Box Jumps", "Stair Climbing",
            "Cycling", "Swimming", "Rowing", "Elliptical Training", "Cross-Country Skiing",
            "Squats", "Lunges", "Push-ups", "Pull-ups", "Dips", "Plank Variations",
            "Deadlifts", "Kettlebell Swings", "Resistance Band Exercises", "Wall Sits",
            "Bench Press", "Shoulder Press", "Bicep Curls", "Tricep Extensions", "Leg Press",
            "Crunches", "Russian Twists", "Leg Raises", "Bicycle Crunches", "Planks",
            "Side Planks", "Ab Rollouts", "Bird Dogs", "Superman Holds", "Hollow Body Holds",
            "Oblique Twists", "Hanging Leg Raises", "Plank Jacks", "Medicine Ball Slams",
            "Tabata Intervals", "Circuit Training", "Plyometric Drills", "Bodyweight Complex",
            "Explosive Movements", "Interval Sprints", "Cross-Training Circuits",
            "Battle Rope Exercises", "Kettlebell Complex", "TRX Suspension Training",
            "Dynamic Stretching", "Yoga Flow", "Mobility Drills", "Foam Rolling",
            "Stretching Routines", "Pilates", "Tai Chi Movements", "Joint Mobility Exercises",
            "Active Recovery"
        ]

    def generate_description(self, workout_name):
        descriptions = [
            f"Intense {workout_name} session focusing on full-body engagement and cardiovascular endurance.",
            f"Dynamic {workout_name} workout designed to challenge multiple muscle groups and improve overall fitness.",
            f"Strategically crafted {workout_name} exercise to enhance strength, flexibility, and metabolic conditioning.",
            f"High-energy {workout_name} routine targeting comprehensive physical development and performance.",
            f"Precision-engineered {workout_name} training method to optimize muscular strength and endurance."
        ]
        return random.choice(descriptions)

    def generate_workouts(self):
        workouts = []
        workout_id = 1

        for body_type in range(3):  # Flappy, Skinny, Ideal
            for week in range(1, 13):  # 12 weeks
                for day in range(1, 8):  # 7 days per week
                    day_workouts = random.sample(self.workout_types, 5)  # 5 unique workouts per day

                    for workout_name in day_workouts:
                        if body_type == 0:  # Flappy
                            default_duration = random.randint(300, 600)
                            default_sets = random.randint(2, 3)
                            default_reps = random.randint(10, 15)
                            calories_per_minute = random.uniform(4.0, 6.0)
                        elif body_type == 1:  # Skinny
                            default_duration = random.randint(480, 900)
                            default_sets = random.randint(3, 4)
                            default_reps = random.randint(15, 20)
                            calories_per_minute = random.uniform(6.0, 8.0)
                        else:  # Ideal
                            default_duration = random.randint(600, 1200)
                            default_sets = random.randint(4, 5)
                            default_reps = random.randint(20, 25)
                            calories_per_minute = random.uniform(8.0, 10.0)

                        workout = {
                            'id': workout_id,
                            'name': workout_name,
                            'description': self.generate_description(workout_name),
                            'demonstration_video_url': f'https://example.com/{workout_name.lower().replace(" ", "-")}',
                            'workout_day_id': day,
                            'animation_path': f'https://example.com/{workout_name.lower().replace(" ", "-")}-animation.jpg',
                            'calories_per_set': round(calories_per_minute * default_duration / default_sets, 2),
                            'default_duration': default_duration,
                            'default_reps': default_reps,
                            'default_sets': default_sets,
                            'calories_per_minute': round(calories_per_minute, 2),
                            'week': week,
                            'program_id': body_type * 12 + week
                        }
                        workouts.append(workout)
                        workout_id += 1

        return workouts

    def save_to_csv(self, workouts, filename='workouts.csv'):
        keys = ['id', 'name', 'description', 'demonstration_video_url', 'workout_day_id',
                'animation_path', 'calories_per_set', 'default_duration',
                'default_reps', 'default_sets', 'calories_per_minute', 'week', 'program_id']

        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=keys)
            writer.writeheader()
            writer.writerows(workouts)


# Generate and save workouts
generator = WorkoutGenerator()
workouts = generator.generate_workouts()
generator.save_to_csv(workouts)

print(f"Generated {len(workouts)} unique workouts in workouts.csv")

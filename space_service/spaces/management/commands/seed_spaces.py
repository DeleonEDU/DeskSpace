from django.core.management.base import BaseCommand

from spaces.models import Location, Floor, Space


class Command(BaseCommand):
    help = "Seed locations, floors, and spaces for DeskSpace"

    def handle(self, *args, **options):
        loc, _ = Location.objects.get_or_create(
            name="cospace HQ",
            defaults={"address": "123 Main St", "city": "Kyiv", "country": "Ukraine"},
        )

        for level in [1, 2, 3, 4, 5]:
            floor, _ = Floor.objects.get_or_create(
                location=loc, level=level, defaults={"name": f"{level}-й поверх"}
            )

            rooms = [
                {"name": "Кімната 01", "type": "meeting_room", "capacity": 4, "price": 250, "svg_id": "r1"},
                {"name": "Кімната 02", "type": "meeting_room", "capacity": 6, "price": 320, "svg_id": "r2"},
                {"name": "Кімната 03", "type": "meeting_room", "capacity": 8, "price": 400, "svg_id": "r3"},
                {"name": "Кімната 04", "type": "meeting_room", "capacity": 2, "price": 180, "svg_id": "r4"},
                {"name": "Кімната 05", "type": "meeting_room", "capacity": 4, "price": 250, "svg_id": "r5"},
                {"name": "Кімната 06", "type": "meeting_room", "capacity": 4, "price": 250, "svg_id": "r6"},
                {"name": "Кімната 07", "type": "meeting_room", "capacity": 3, "price": 220, "svg_id": "r7"},
                {"name": "Кімната 08", "type": "meeting_room", "capacity": 6, "price": 320, "svg_id": "r8"},
                {"name": "Кімната 09", "type": "meeting_room", "capacity": 5, "price": 280, "svg_id": "r9"},
                {"name": "Кімната 10", "type": "meeting_room", "capacity": 10, "price": 480, "svg_id": "r10"},
            ]

            for i in range(1, 21):
                rooms.append(
                    {
                        "name": f"Стіл #{i}",
                        "type": "desk",
                        "capacity": 1,
                        "price": 50,
                        "svg_id": f"d{i}",
                    }
                )

            for room in rooms:
                Space.objects.get_or_create(
                    floor=floor,
                    name=room["name"],
                    defaults={
                        "space_type": room["type"],
                        "capacity": room["capacity"],
                        "price_per_hour": room["price"],
                        "svg_element_id": room["svg_id"],
                    },
                )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))

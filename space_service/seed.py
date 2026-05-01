import os
import sys
import django

# Setup Django environment
sys.path.append('/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from spaces.models import Location, Floor, Space

def seed():
    loc, _ = Location.objects.get_or_create(name="cospace HQ", address="123 Main St", city="Kyiv", country="Ukraine")
    
    for level in [1, 2, 3, 4, 5]:
        floor, _ = Floor.objects.get_or_create(location=loc, level=level, name=f"{level}-й поверх")
        
        # Create some rooms (meeting rooms)
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
        
        # Create some open space desks
        for i in range(1, 21):
            rooms.append({
                "name": f"Стіл #{i}", 
                "type": "desk", 
                "capacity": 1, 
                "price": 50, 
                "svg_id": f"d{i}"
            })
            
        for r in rooms:
            Space.objects.get_or_create(
                floor=floor,
                name=r["name"],
                defaults={
                    "space_type": r["type"],
                    "capacity": r["capacity"],
                    "price_per_hour": r["price"],
                    "svg_element_id": r["svg_id"]
                }
            )
            
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed()

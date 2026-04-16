from django.db import models

class Location(models.Model):
    """
    Building or branch of the coworking (for example, 'Kyivska Street, 1').
    """
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.city}, {self.country})"

class Floor(models.Model):
    """
    Floor in a specific building.
    Has a map (background), on which the desks and meeting rooms will be placed.
    """
    location = models.ForeignKey(Location, related_name='floors', on_delete=models.CASCADE)
    level = models.IntegerField(help_text="Floor number (for example, 4)")
    name = models.CharField(max_length=100, blank=True, help_text="Floor name (for example, '4-th floor')")
    map_image = models.FileField(upload_to='floor_maps/', blank=True, null=True, help_text="Файл мапи поверху (ідеально - SVG, або PNG/JPG)")
    
    def __str__(self):
        return f"{self.location.name} - Floor {self.level}"
    
    class Meta:
        ordering = ['level']

class Amenity(models.Model):
    """
    Amenities (TV, Whiteboard, Camera, Coffee, etc.).
    """
    name = models.CharField(max_length=100)
    icon_name = models.CharField(max_length=50, blank=True, help_text="Icon name for the frontend")

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Amenities"

class Space(models.Model):
    """
    Specific booking place (Desk or Meeting Room).
    Has coordinates for displaying on the floor map.
    """
    SPACE_TYPES = [
        ('desk', 'Desk'),
        ('meeting_room', 'Meeting Room'),
        ('private_office', 'Private Office'),
    ]

    floor = models.ForeignKey(Floor, related_name='spaces', on_delete=models.CASCADE)
    name = models.CharField(max_length=255, help_text="For example, 'Desk #45' or 'CARPATI'")
    description = models.TextField(blank=True, help_text="Короткий опис простору")
    space_type = models.CharField(max_length=50, choices=SPACE_TYPES)
    capacity = models.PositiveIntegerField(default=1, help_text="Number of seats")
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Ідентифікатор елемента всередині SVG-мапи поверху (наприклад 'table-45' або 'room-karpaty')
    svg_element_id = models.CharField(max_length=100, blank=True, help_text="Element ID in the SVG map")
    
    amenities = models.ManyToManyField(Amenity, blank=True, related_name='spaces')
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.get_space_type_display()}) - {self.floor}"

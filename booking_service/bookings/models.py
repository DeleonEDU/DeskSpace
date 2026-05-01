from django.db import models

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    user_id = models.IntegerField(help_text="ID of the user from auth_service")
    space_id = models.IntegerField(help_text="ID of the space from space_service")
    
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking {self.id} for Space {self.space_id} by User {self.user_id}"

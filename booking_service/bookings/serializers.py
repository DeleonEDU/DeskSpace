from rest_framework import serializers

from bookings.models import Booking

SERIALIZER_VALIDATORS = {
    "time_order": (
        lambda data: data["start_time"] < data["end_time"],
        "End time must be after start time.",
    ),
}


class CreateBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ("space_id", "start_time", "end_time")

    def validate(self, data):
        failures = [
            message
            for _, (check, message) in SERIALIZER_VALIDATORS.items()
            if not check(data)
        ]
        if failures:
            raise serializers.ValidationError(failures[0])
        return data


class BookingResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = ("user_id", "status", "created_at", "updated_at")

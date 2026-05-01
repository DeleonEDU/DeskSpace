from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from .models import Booking
from .serializers import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Booking.objects.all().order_by('-created_at')
        
        # Allow filtering by date range to see occupied spaces
        start_time = self.request.query_params.get('start_time__gte')
        end_time = self.request.query_params.get('end_time__lte')
        
        if start_time and end_time:
            qs = qs.filter(
                status='confirmed',
                start_time__lt=end_time,
                end_time__gt=start_time
            )
            return qs

        if hasattr(user, 'is_staff') and user.is_staff:
            return qs
        return qs.filter(user_id=user.id)

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.id, status='confirmed')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        space_id = serializer.validated_data['space_id']
        start_time = serializer.validated_data['start_time']
        end_time = serializer.validated_data['end_time']
        
        # Check for overlapping bookings
        overlapping_bookings = Booking.objects.filter(
            space_id=space_id,
            status='confirmed'
        ).filter(
            Q(start_time__lt=end_time) & Q(end_time__gt=start_time)
        )
        
        if overlapping_bookings.exists():
            return Response(
                {"detail": "This space is already booked for the selected time."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Only allow deleting upcoming bookings
        from django.utils import timezone
        if instance.start_time <= timezone.now():
            return Response(
                {"detail": "Cannot delete past or ongoing bookings."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        instance.status = 'cancelled'
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def check_availability(self, request):
        space_id = request.query_params.get('space_id')
        start_time = request.query_params.get('start_time')
        end_time = request.query_params.get('end_time')

        if not all([space_id, start_time, end_time]):
            return Response(
                {"detail": "space_id, start_time, and end_time are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        overlapping_bookings = Booking.objects.filter(
            space_id=space_id,
            status='confirmed'
        ).filter(
            Q(start_time__lt=end_time) & Q(end_time__gt=start_time)
        )

        if overlapping_bookings.exists():
            return Response({"available": False})
        
        return Response({"available": True})

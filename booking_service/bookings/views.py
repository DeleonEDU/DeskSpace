from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from bookings.api.error_mapping import response_for_domain_error
from bookings.domain.exceptions import BookingDomainError
from bookings.permissions import IsBookingOwnerOrStaff
from bookings.repositories.booking_repository import BookingRepository
from bookings.serializers import BookingResponseSerializer, CreateBookingSerializer
from bookings.services.factory import get_booking_service

SERIALIZER_ACTION_MAP = {
    "create": CreateBookingSerializer,
    "default": BookingResponseSerializer,
}


class BookingViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [permissions.IsAuthenticated, IsBookingOwnerOrStaff]

    def get_serializer_class(self):
        return SERIALIZER_ACTION_MAP.get(
            self.action,
            SERIALIZER_ACTION_MAP["default"],
        )

    def get_booking_service(self):
        return get_booking_service()

    def get_repository(self):
        return BookingRepository()

    def get_queryset(self):
        user = self.request.user
        return self.get_repository().list_for_scope(
            user_id=user.id,
            is_staff=getattr(user, "is_staff", False),
            start_time_gte=self.request.query_params.get("start_time__gte"),
            end_time_lte=self.request.query_params.get("end_time__lte"),
        )

    def _auth_header(self) -> str | None:
        return self.request.headers.get("Authorization")

    def _handle_domain_error(self, error: BookingDomainError) -> Response:
        status_code, detail = response_for_domain_error(error)
        return Response({"detail": detail}, status=status_code)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            booking, _snapshot = self.get_booking_service().create_booking(
                user_id=request.user.id,
                space_id=serializer.validated_data["space_id"],
                start_time=serializer.validated_data["start_time"],
                end_time=serializer.validated_data["end_time"],
                auth_header=self._auth_header(),
            )
        except BookingDomainError as exc:
            return self._handle_domain_error(exc)

        output = BookingResponseSerializer(booking)
        headers = self.get_success_headers(output.data)
        return Response(output.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            self.get_booking_service().cancel_booking(instance)
        except BookingDomainError as exc:
            return self._handle_domain_error(exc)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["get"])
    def check_availability(self, request):
        try:
            params = self.get_booking_service().validate_availability_params(
                request.query_params
            )
            available = self.get_booking_service().check_availability(
                space_id=int(params["space_id"]),
                start_time=params["start_time"],
                end_time=params["end_time"],
                auth_header=self._auth_header(),
            )
        except BookingDomainError as exc:
            return self._handle_domain_error(exc)

        return Response({"available": available})

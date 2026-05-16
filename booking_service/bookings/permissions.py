from rest_framework import permissions

OBJECT_ACCESS_CHECKS = {
    "staff": lambda user, obj: getattr(user, "is_staff", False),
    "owner": lambda user, obj: obj.user_id == user.id,
}


class IsBookingOwnerOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        user = request.user
        return any(check(user, obj) for check in OBJECT_ACCESS_CHECKS.values())

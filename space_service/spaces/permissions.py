from rest_framework import permissions

WRITE_METHODS = frozenset({"POST", "PUT", "PATCH", "DELETE"})

PERMISSION_HANDLERS = {
    "read": lambda request, view: True,
    "write": lambda request, view: getattr(request.user, "is_staff", False),
}


class IsStaffOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        mode = "read" if request.method not in WRITE_METHODS else "write"
        return PERMISSION_HANDLERS[mode](request, view)

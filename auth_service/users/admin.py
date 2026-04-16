from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from users.models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('email', 'first_name', 'last_name', 'phone_number', 'password1', 'password2'),
            },
        ),
    )
    list_display = ['email', 'first_name', 'last_name', 'phone_number', 'is_active', 'is_staff', 'is_superuser']
    search_fields = ['email', 'first_name', 'last_name', 'phone_number']
    list_filter = ['is_active', 'is_staff', 'is_superuser']
    ordering = ['email']
    list_per_page = 10
    list_max_show_all = 100
    list_editable = ['is_active', 'is_staff', 'is_superuser']

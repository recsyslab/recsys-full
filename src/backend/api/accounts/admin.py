from django.contrib import admin
from api.accounts.models import CustomUser


class CustomUserAdmin(admin.ModelAdmin):
    """カスタムユーザ管理クラス"""
    list_display = (
        'id',
        'username',
        'profile_id',
        'profile_email_masked',
    )

    list_display_links = (
        'id',
        'username',
    )

    def profile_id(self, obj):
        return obj.user.user_id if obj.user else None
    profile_id.short_description = "user_id (UUID)"

    def profile_email_masked(self, obj):
        return obj.user.masked_email() if obj.user else None
    profile_email_masked.short_description = "Email (masked)"


admin.site.register(CustomUser, CustomUserAdmin)
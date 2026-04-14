from django.contrib import admin
from .models import User, Student, HeroImage, AppConfig

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('mobile_number', 'is_staff', 'is_superuser')
    search_fields = ('mobile_number',)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('reg_no', 'name', 'dob', 'result')
    search_fields = ('reg_no', 'name')
    list_filter = ('result',)

@admin.register(HeroImage)
class HeroImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle', 'is_active', 'order')
    list_editable = ('is_active', 'order')

@admin.register(AppConfig)
class AppConfigAdmin(admin.ModelAdmin):
    list_display = ('result_publish_at', 'is_published')

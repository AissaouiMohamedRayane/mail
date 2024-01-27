from django.contrib import admin

from .models import *
# Register your models here.
class adminEmail(admin.ModelAdmin):
    list_display=['user', 'sender', 'subject', 'timestamp']
    
admin.site.register(User)
admin.site.register(Email, adminEmail)
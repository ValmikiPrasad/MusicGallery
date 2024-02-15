from django.contrib import admin
from .models import Room
# Register your models here.
@admin.register(Room)

class RoomAdmin(admin.ModelAdmin):
    list_display=['id','code','host','guest_can_pause','votes_to_skip','created_at']
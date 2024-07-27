from django.contrib import admin

from helloworld.models import HelloWorld


@admin.register(HelloWorld)
class HelloWorldAdmin(admin.ModelAdmin):
    list_display = ["message"]
    list_filter = ["message"]

    ordering = ["-created_at"]

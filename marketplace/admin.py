from django.contrib import admin

from marketplace.models import Cart

class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'fooditem', 'quantity', 'updated_at')










# Register your models here.
admin.site.register(Cart,CartAdmin)
from django.contrib import admin
from .models import Product_Inventory, Sales, Sale_Item

# Register your models here.
admin.site.register(Product_Inventory)
admin.site.register(Sales)
admin.site.register(Sale_Item)


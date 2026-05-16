from django.urls import path
from . import views


urlpatterns = [
    path('inventory/', views.InventoryList, name='inventory-list'),
    path('inventory/create/', views.InventoryCreate, name='inventory-create'),

]
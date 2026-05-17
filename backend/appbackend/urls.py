from django.urls import path
from . import views


urlpatterns = [
    path('inventory/', views.InventoryList, name='inventory-list'),
    path('inventory/create/', views.RestockProducts, name='restock-products'),
    path("inventory/add-new/", views.AddnewProduct, name='add-new-product'),
    path('inventory/search/', views.SearchProduct, name='search-product'),
    path('sales/create/', views.CreateSale, name='create-sale'),
    path('sales/graph/', views.SalesGraphData, name='sales-graph'),
    path('login/', views.LoginView, name='login'),
]
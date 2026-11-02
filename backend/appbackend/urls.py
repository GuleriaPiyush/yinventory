from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from . import views



urlpatterns = [
    # Authentication endpoints
    path('login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.LogoutView.as_view(), name='token_blacklist'),

    # Inventory endpoints
    path('inventory/', views.InventoryList, name='inventory-list'),
    path('inventory/create/', views.RestockProducts, name='restock-products'),
    path("inventory/add-new/", views.AddnewProduct, name='add-new-product'),
    path('inventory/search/', views.SearchProduct, name='search-product'),

    # Sales endpoints
    path('sales/create/', views.CreateSale, name='create-sale'),
    path('sales/graph/', views.SalesGraphData, name='sales-graph'),
    path('sales/', views.sales, name='sales'),
]
from rest_framework import serializers
from .models import Product_Inventory, Sales, Sale_Item

class ProductInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Inventory
        fields = '__all__'
        read_only_fields = ['user']

class SaleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale_Item
        fields = '__all__'

class SalesSerializer(serializers.ModelSerializer):

    items = SaleItemSerializer(many=True, read_only=True)

    class Meta:
        model = Sales
        fields = '__all__'
        read_only_fields = ['user']
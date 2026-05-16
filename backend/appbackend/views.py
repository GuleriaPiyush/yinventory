from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal


# Create your views here.

@api_view(['GET'])
def InventoryList(request):
    inventory = Product_Inventory.objects.all()
    serializer = ProductInventorySerializer(inventory, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def RestockProducts(request):
    data = request.data
    barcode = data.get('barcode')

    # If barcode is provided, check if we need to update an existing product
    if barcode:
        try:
            existing_product = Product_Inventory.objects.filter(barcode=barcode).first()
            
            if existing_product:
                # Convert incoming values to Decimal for accurate math
                added_stock = Decimal(str(data.get('stock', 0)))
                added_cost = Decimal(str(data.get('cost_price', existing_product.cost_price)))
                added_selling = Decimal(str(data.get('selling_price', existing_product.selling_price)))

                old_stock = existing_product.stock
                new_stock = old_stock + added_stock

                # Calculate weighted average for cost and selling price
                if new_stock > 0:
                    new_cost_price = ((old_stock * existing_product.cost_price) + (added_stock * added_cost)) / new_stock
                    new_selling_price = ((old_stock * existing_product.selling_price) + (added_stock * added_selling)) / new_stock
                else:
                    new_cost_price = added_cost
                    new_selling_price = added_selling

                # Update existing product
                existing_product.stock = new_stock
                existing_product.cost_price = round(new_cost_price, 2)
                existing_product.selling_price = round(new_selling_price, 2)
                existing_product.save()

                serializer = ProductInventorySerializer(existing_product)
                # Return HTTP_200_OK since it was updated, not created
                return Response(serializer.data, status=status.HTTP_200_OK)
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # If barcode doesn't exist yet, proceed with normal creation
    
    return Response({"message": "barcode already exist kindly visit the  Add new items page "}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def AddnewProduct(request):
    data = request.data
    barcode = data.get('barcode')
    if Product_Inventory.objects.filter(barcode=barcode).exists():
        return Response({"message":"barcode already exist go to restock page"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # serializer = ProductInventorySerializer(data=data)
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer = ProductInventorySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)    
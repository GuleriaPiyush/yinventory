from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal

import uuid
from django.db import transaction
from django.db.models import Q



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

                if added_stock <= 0:
                    return Response({"error": "Restock quantity must be strictly positive."}, status=status.HTTP_400_BAD_REQUEST)

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
    
    return Response({"message": "barcode doesn't exist kindly visit the  Add new items page to add new items"}, status=status.HTTP_400_BAD_REQUEST)


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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def SearchProduct(request):
    """Searches for products by barcode or name"""
    query = request.GET.get('q','')
    products = Product_Inventory.objects.all()
    if query:
        products = products.filter(Q(barcode__icontains=query) | Q(name__icontains=query))
        
    
    serializer = ProductInventorySerializer(products, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def CreateSale(request):
    """Creates a Sale, saves Sale Items, and deducts stock from Inventory"""
    data = request.data
    customer_name = data.get('customer_name', '')
    customer_phone = data.get('customer_phone', '')
    
    # Convert empty strings to None to prevent PostgreSQL type errors (like 'invalid input syntax for type bigint')
    if not customer_name:
        customer_name = None
    if not customer_phone:
        customer_phone = None
        
    items = data.get('items', [])
    if not items:
        return Response({"error": "No items in the bill."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        # Use a transaction so if anything fails, no partial changes are saved
        with transaction.atomic():
            # 1. Create the main Sale record
            transaction_id = str(uuid.uuid4())[:12].upper()
            
            sale = Sales.objects.create(
                transaction_id=transaction_id,
                customer_name=customer_name,
                customer_phone=customer_phone,
                amount=0, 
                total_amount=0,
                products="Recorded in Sale_Item" # Placeholder for your redundant text field
            )
            total_amount = Decimal('0.00')
            # 2. Process each item
            for item in items:
                product_id = item.get('product_id')
                # Get the product
                product = Product_Inventory.objects.get(id=product_id)

                quantity = Decimal(str(item.get('quantity')))
                
                if quantity <= 0:
                    raise Exception(f"Quantity for {product.name} must be greater than zero.")
                
                # Deduct stock
                if product.stock < quantity:
                    raise Exception(f"Not enough stock for {product.name}. Available: {product.stock}")
                
                product.stock -= quantity
                product.save()
                # 3. Create Sale_Item record
                price_at_sale = product.selling_price
                subtotal = quantity * price_at_sale
                
                Sale_Item.objects.create(
                    sales=sale,
                    product=product,
                    quantity=quantity,
                    price_at_sale=price_at_sale,
                    subtotal=subtotal
                )
                total_amount += subtotal
            # 4. Update the final sale totals
            sale.amount = total_amount
            sale.total_amount = total_amount
            sale.save()
            return Response({
                "message": "Sale completed successfully", 
                "transaction_id": transaction_id
            }, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


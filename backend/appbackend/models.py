from django.conf import settings
from django.db import models



# Create your models here.

class Product_Inventory(models.Model):

    unit_choice = [
        ('kg', 'kg'),
        ('grams', 'grams'),
        ('pieces', 'pieces'),
    ]

    name = models.CharField(max_length=255)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=10, choices=unit_choice)
    barcode = models.CharField(max_length=50)



    def __str__(self):
        return f"{self.name} {self.stock} {self.unit} left"


class Sales(models.Model):
    
    # status_choice = [
    #     ('draft', 'draft'),
    #     ('confirmed', 'confirmed'),
    #     ('cancelled', 'cancelled'),
    # ]

    transaction_id = models.CharField(max_length=100, unique=True)
    products = models.TextField() #this field is redundant as we are storing items in Sale_Item model
    amount = models.DecimalField(max_digits=10, decimal_places=2) 
    created_at = models.DateTimeField(auto_now_add=True)

    customer_name = models.CharField(max_length=255, blank=True, null=True)
    customer_phone = models.CharField(max_length=20, null=True, blank=True)

    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.transaction_id}, {self.total_amount}, {self.customer_name},"    



class Sale_Item(models.Model):
    sales = models.ForeignKey(Sales, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product_Inventory,on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    price_at_sale = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)

    def save(self, *args, **kwargs):

        if not self.price_at_sale:
            self.price_at_sale = self.product.selling_price

        self.subtotal = self.quantity * self.price_at_sale
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} x {self.quantity} @ {self.price_at_sale}"

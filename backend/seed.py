import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from appbackend.models import Product_Inventory

items = [
    # Biscuits & Snacks
    {"name": "Parle-G Gold Biscuits", "cost_price": 25, "selling_price": 30, "stock": 300, "unit": "pieces", "barcode": "8901719273111"},
    {"name": "Britannia Good Day Cashew", "cost_price": 40, "selling_price": 45, "stock": 250, "unit": "pieces", "barcode": "8901063013214"},
    {"name": "Britannia Marie Gold", "cost_price": 30, "selling_price": 35, "stock": 200, "unit": "pieces", "barcode": "8901063124507"},
    {"name": "Sunfeast Dark Fantasy", "cost_price": 60, "selling_price": 75, "stock": 150, "unit": "pieces", "barcode": "8901725110059"},
    {"name": "Oreo Vanilla Creme", "cost_price": 70, "selling_price": 85, "stock": 180, "unit": "pieces", "barcode": "8904256700412"},
    {"name": "Haldiram's Bhujia Sev", "cost_price": 95, "selling_price": 105, "stock": 120, "unit": "grams", "barcode": "8904004400261"},
    {"name": "Haldiram's Moong Dal", "cost_price": 45, "selling_price": 50, "stock": 200, "unit": "grams", "barcode": "8904004400506"},
    {"name": "Haldiram's Aloo Bhujia", "cost_price": 100, "selling_price": 115, "stock": 150, "unit": "grams", "barcode": "8904004401206"},
    {"name": "Lays Classic Salted", "cost_price": 15, "selling_price": 20, "stock": 400, "unit": "pieces", "barcode": "8901491100511"},
    {"name": "Lays India's Magic Masala", "cost_price": 15, "selling_price": 20, "stock": 400, "unit": "pieces", "barcode": "8901491100528"},
    {"name": "Kurkure Masala Munch", "cost_price": 15, "selling_price": 20, "stock": 350, "unit": "pieces", "barcode": "8901491100610"},
    {"name": "Bingo Mad Angles", "cost_price": 15, "selling_price": 20, "stock": 300, "unit": "pieces", "barcode": "8901725134116"},
    {"name": "Balaji Wafers Simply Salted", "cost_price": 15, "selling_price": 20, "stock": 200, "unit": "pieces", "barcode": "8906000000018"},
    {"name": "Doritos Nacho Cheese", "cost_price": 40, "selling_price": 50, "stock": 100, "unit": "pieces", "barcode": "8901491101211"},
    {"name": "Bikano Bikaneri Bhujia", "cost_price": 85, "selling_price": 95, "stock": 120, "unit": "grams", "barcode": "8904030101155"},

    # Staples (Rice, Dal, Atta, Sugar, Oil)
    {"name": "Aashirvaad Whole Wheat Atta", "cost_price": 200, "selling_price": 230, "stock": 100, "unit": "kg", "barcode": "8901725134765"},
    {"name": "Aashirvaad Select Atta", "cost_price": 250, "selling_price": 280, "stock": 80, "unit": "kg", "barcode": "8901725111162"},
    {"name": "Pillsbury Chakki Fresh Atta", "cost_price": 210, "selling_price": 245, "stock": 90, "unit": "kg", "barcode": "8901010300125"},
    {"name": "Patanjali Whole Wheat Atta", "cost_price": 180, "selling_price": 210, "stock": 120, "unit": "kg", "barcode": "8904109401123"},
    {"name": "India Gate Basmati Rice", "cost_price": 450, "selling_price": 500, "stock": 60, "unit": "kg", "barcode": "8906001021487"},
    {"name": "Daawat Rozana Gold Basmati", "cost_price": 380, "selling_price": 420, "stock": 80, "unit": "kg", "barcode": "8901042940251"},
    {"name": "Kohinoor Super Silver Basmati", "cost_price": 400, "selling_price": 440, "stock": 50, "unit": "kg", "barcode": "8901042940252"},
    {"name": "Tata Sampann Toor Dal", "cost_price": 130, "selling_price": 155, "stock": 100, "unit": "kg", "barcode": "8901030303255"},
    {"name": "Tata Sampann Moong Dal", "cost_price": 120, "selling_price": 140, "stock": 100, "unit": "kg", "barcode": "8901030303256"},
    {"name": "Tata Sampann Chana Dal", "cost_price": 90, "selling_price": 110, "stock": 100, "unit": "kg", "barcode": "8901030303257"},
    {"name": "Tata Sampann Urad Dal", "cost_price": 140, "selling_price": 165, "stock": 80, "unit": "kg", "barcode": "8901030303258"},
    {"name": "Madhur Pure & Hygienic Sugar", "cost_price": 45, "selling_price": 55, "stock": 200, "unit": "kg", "barcode": "8906001021490"},
    {"name": "Uttam Sugar", "cost_price": 42, "selling_price": 50, "stock": 200, "unit": "kg", "barcode": "8906001021491"},
    {"name": "Fortune Soya Health Oil", "cost_price": 120, "selling_price": 140, "stock": 150, "unit": "pieces", "barcode": "8906007281015"},
    {"name": "Fortune Sunlite Refined Oil", "cost_price": 135, "selling_price": 155, "stock": 120, "unit": "pieces", "barcode": "8906007281014"},
    {"name": "Saffola Gold Cooking Oil", "cost_price": 180, "selling_price": 205, "stock": 100, "unit": "pieces", "barcode": "8901088011234"},
    {"name": "Dhara Mustard Oil", "cost_price": 160, "selling_price": 185, "stock": 90, "unit": "pieces", "barcode": "8901088011235"},
    {"name": "Patanjali Mustard Oil", "cost_price": 150, "selling_price": 175, "stock": 110, "unit": "pieces", "barcode": "8904109400226"},
    {"name": "Tata Salt", "cost_price": 20, "selling_price": 25, "stock": 300, "unit": "kg", "barcode": "8901030303254"},

    # Spices & Condiments
    {"name": "Everest Garam Masala", "cost_price": 75, "selling_price": 85, "stock": 200, "unit": "grams", "barcode": "8901786110034"},
    {"name": "Everest Chicken Masala", "cost_price": 60, "selling_price": 70, "stock": 150, "unit": "grams", "barcode": "8901786110035"},
    {"name": "Everest Meat Masala", "cost_price": 65, "selling_price": 75, "stock": 120, "unit": "grams", "barcode": "8901786110036"},
    {"name": "Everest Turmeric Powder", "cost_price": 30, "selling_price": 38, "stock": 250, "unit": "grams", "barcode": "8901786110037"},
    {"name": "Everest Red Chilli Powder", "cost_price": 45, "selling_price": 55, "stock": 200, "unit": "grams", "barcode": "8901786110038"},
    {"name": "MDH Chana Masala", "cost_price": 60, "selling_price": 68, "stock": 180, "unit": "grams", "barcode": "8902136000543"},
    {"name": "MDH Pav Bhaji Masala", "cost_price": 55, "selling_price": 65, "stock": 160, "unit": "grams", "barcode": "8902136000544"},
    {"name": "MDH Chunky Chat Masala", "cost_price": 62, "selling_price": 72, "stock": 150, "unit": "grams", "barcode": "8902136000545"},
    {"name": "Catch Coriander Powder", "cost_price": 55, "selling_price": 62, "stock": 190, "unit": "grams", "barcode": "8901192138904"},
    {"name": "Catch Black Pepper Powder", "cost_price": 70, "selling_price": 80, "stock": 140, "unit": "grams", "barcode": "8901192138905"},
    {"name": "Mother's Recipe Pickle Mango", "cost_price": 80, "selling_price": 95, "stock": 90, "unit": "pieces", "barcode": "8901030018593"},
    {"name": "Nilon's Mixed Pickle", "cost_price": 75, "selling_price": 90, "stock": 80, "unit": "pieces", "barcode": "8901030018594"},
    {"name": "Priya Gongura Pickle", "cost_price": 90, "selling_price": 110, "stock": 70, "unit": "pieces", "barcode": "8901030018595"},
    {"name": "Maggi Tomato Ketchup", "cost_price": 110, "selling_price": 130, "stock": 120, "unit": "pieces", "barcode": "8901058814783"},
    {"name": "Kissan Fresh Tomato Ketchup", "cost_price": 105, "selling_price": 125, "stock": 130, "unit": "pieces", "barcode": "8901058814784"},
    {"name": "Ching's Dark Soy Sauce", "cost_price": 50, "selling_price": 60, "stock": 80, "unit": "pieces", "barcode": "8901058814785"},
    {"name": "Ching's Red Chilli Sauce", "cost_price": 45, "selling_price": 55, "stock": 85, "unit": "pieces", "barcode": "8901058814786"},

    # Beverages
    {"name": "Brooke Bond Red Label Tea", "cost_price": 220, "selling_price": 240, "stock": 160, "unit": "grams", "barcode": "8901030018592"},
    {"name": "Brooke Bond Taj Mahal Tea", "cost_price": 300, "selling_price": 340, "stock": 100, "unit": "grams", "barcode": "8901030018596"},
    {"name": "Tata Tea Gold", "cost_price": 280, "selling_price": 310, "stock": 120, "unit": "grams", "barcode": "8901030303259"},
    {"name": "Tata Tea Premium", "cost_price": 240, "selling_price": 270, "stock": 150, "unit": "grams", "barcode": "8901030303260"},
    {"name": "Wagh Bakri Premium Tea", "cost_price": 260, "selling_price": 290, "stock": 110, "unit": "grams", "barcode": "8901030303261"},
    {"name": "Tetley Green Tea Lemon", "cost_price": 140, "selling_price": 160, "stock": 90, "unit": "pieces", "barcode": "8901030303262"},
    {"name": "Nescafe Classic Coffee", "cost_price": 135, "selling_price": 155, "stock": 140, "unit": "grams", "barcode": "8901058814787"},
    {"name": "Bru Gold Coffee", "cost_price": 120, "selling_price": 140, "stock": 130, "unit": "grams", "barcode": "8901058814788"},
    {"name": "Horlicks Original", "cost_price": 240, "selling_price": 275, "stock": 80, "unit": "grams", "barcode": "8901058814789"},
    {"name": "Bournvita Chocolate", "cost_price": 210, "selling_price": 240, "stock": 100, "unit": "grams", "barcode": "8901058814790"},
    {"name": "Complan Royale Chocolate", "cost_price": 230, "selling_price": 260, "stock": 70, "unit": "grams", "barcode": "8901058814791"},
    {"name": "Frooti Mango Drink", "cost_price": 30, "selling_price": 35, "stock": 250, "unit": "pieces", "barcode": "8901058814792"},
    {"name": "Maaza Mango Drink", "cost_price": 35, "selling_price": 40, "stock": 240, "unit": "pieces", "barcode": "8901058814793"},
    {"name": "Coca-Cola Original 2L", "cost_price": 80, "selling_price": 95, "stock": 120, "unit": "pieces", "barcode": "8901058814794"},
    {"name": "Pepsi Cola 2L", "cost_price": 75, "selling_price": 90, "stock": 130, "unit": "pieces", "barcode": "8901058814795"},
    {"name": "Sprite Lemon-Lime 2L", "cost_price": 80, "selling_price": 95, "stock": 140, "unit": "pieces", "barcode": "8901058814796"},
    {"name": "Thums Up 2L", "cost_price": 85, "selling_price": 100, "stock": 150, "unit": "pieces", "barcode": "8901058814797"},

    # Personal Care
    {"name": "Dove Cream Beauty Bathing Bar", "cost_price": 45, "selling_price": 55, "stock": 200, "unit": "pieces", "barcode": "8901030303263"},
    {"name": "Pears Pure & Gentle Soap", "cost_price": 40, "selling_price": 50, "stock": 220, "unit": "pieces", "barcode": "8901030303264"},
    {"name": "Lifebuoy Total 10 Soap", "cost_price": 25, "selling_price": 32, "stock": 300, "unit": "pieces", "barcode": "8901030303265"},
    {"name": "Dettol Original Soap", "cost_price": 35, "selling_price": 42, "stock": 280, "unit": "pieces", "barcode": "8901030303266"},
    {"name": "Cinthol Lime Soap", "cost_price": 30, "selling_price": 38, "stock": 250, "unit": "pieces", "barcode": "8901030303267"},
    {"name": "Patanjali Dant Kanti Toothpaste", "cost_price": 85, "selling_price": 95, "stock": 150, "unit": "pieces", "barcode": "8904109400225"},
    {"name": "Colgate MaxFresh Toothpaste", "cost_price": 90, "selling_price": 105, "stock": 160, "unit": "pieces", "barcode": "8904109400227"},
    {"name": "Colgate Strong Teeth", "cost_price": 80, "selling_price": 95, "stock": 180, "unit": "pieces", "barcode": "8904109400228"},
    {"name": "Pepsodent GermiCheck", "cost_price": 75, "selling_price": 88, "stock": 140, "unit": "pieces", "barcode": "8904109400229"},
    {"name": "Sensodyne Fresh Mint", "cost_price": 140, "selling_price": 160, "stock": 100, "unit": "pieces", "barcode": "8904109400230"},
    {"name": "Head & Shoulders Anti-Dandruff", "cost_price": 150, "selling_price": 175, "stock": 120, "unit": "pieces", "barcode": "8904109400231"},
    {"name": "Sunsilk Stunning Black Shine", "cost_price": 130, "selling_price": 150, "stock": 130, "unit": "pieces", "barcode": "8904109400232"},
    {"name": "Clinic Plus Strong & Long", "cost_price": 110, "selling_price": 130, "stock": 150, "unit": "pieces", "barcode": "8904109400233"},
    {"name": "Dove Hair Fall Rescue Shampoo", "cost_price": 160, "selling_price": 190, "stock": 110, "unit": "pieces", "barcode": "8904109400234"},
    {"name": "Pantene Advanced Hair Fall", "cost_price": 155, "selling_price": 180, "stock": 120, "unit": "pieces", "barcode": "8904109400235"},
    {"name": "Parachute Advanced Jasmine", "cost_price": 90, "selling_price": 110, "stock": 140, "unit": "pieces", "barcode": "8904109400236"},
    {"name": "Parachute 100% Pure Coconut", "cost_price": 110, "selling_price": 130, "stock": 160, "unit": "pieces", "barcode": "8904109400237"},
    {"name": "Navratna Ayurvedic Cool Oil", "cost_price": 80, "selling_price": 95, "stock": 130, "unit": "pieces", "barcode": "8904109400238"},
    {"name": "Bajaj Almond Drops Hair Oil", "cost_price": 95, "selling_price": 115, "stock": 150, "unit": "pieces", "barcode": "8904109400239"},
    {"name": "Fair & Lovely Advanced Cream", "cost_price": 75, "selling_price": 90, "stock": 100, "unit": "pieces", "barcode": "8904109400240"},
    {"name": "Pond's White Beauty Cream", "cost_price": 110, "selling_price": 130, "stock": 90, "unit": "pieces", "barcode": "8904109400241"},
    {"name": "Nivea Soft Light Moisturiser", "cost_price": 130, "selling_price": 155, "stock": 110, "unit": "pieces", "barcode": "8904109400242"},
    {"name": "Vaseline Intensive Care Lotion", "cost_price": 140, "selling_price": 170, "stock": 120, "unit": "pieces", "barcode": "8904109400243"},
    {"name": "Gillette Mach 3 Razor", "cost_price": 200, "selling_price": 250, "stock": 80, "unit": "pieces", "barcode": "8904109400244"},

    # Household
    {"name": "Surf Excel Easy Wash", "cost_price": 120, "selling_price": 145, "stock": 200, "unit": "kg", "barcode": "8904109400245"},
    {"name": "Ariel Matic Top Load", "cost_price": 150, "selling_price": 180, "stock": 180, "unit": "kg", "barcode": "8904109400246"},
    {"name": "Tide Plus Double Power", "cost_price": 100, "selling_price": 120, "stock": 220, "unit": "kg", "barcode": "8904109400247"},
    {"name": "Rin Detergent Bar", "cost_price": 15, "selling_price": 20, "stock": 350, "unit": "pieces", "barcode": "8904109400248"},
    {"name": "Vim Dishwash Bar", "cost_price": 20, "selling_price": 25, "stock": 300, "unit": "pieces", "barcode": "8904109400249"},
    {"name": "Vim Dishwash Liquid", "cost_price": 95, "selling_price": 115, "stock": 150, "unit": "pieces", "barcode": "8904109400250"},
    {"name": "Pril Dishwash Liquid", "cost_price": 90, "selling_price": 110, "stock": 140, "unit": "pieces", "barcode": "8904109400251"},
    {"name": "Lizol Floral Floor Cleaner", "cost_price": 85, "selling_price": 105, "stock": 160, "unit": "pieces", "barcode": "8904109400252"},
    {"name": "Harpic Power Plus Toilet", "cost_price": 75, "selling_price": 90, "stock": 180, "unit": "pieces", "barcode": "8904109400253"},
    {"name": "Colin Glass Cleaner", "cost_price": 60, "selling_price": 75, "stock": 120, "unit": "pieces", "barcode": "8904109400254"},
    {"name": "Odonil Room Freshener", "cost_price": 40, "selling_price": 50, "stock": 200, "unit": "pieces", "barcode": "8904109400255"},
    {"name": "Good Knight Gold Flash", "cost_price": 70, "selling_price": 85, "stock": 150, "unit": "pieces", "barcode": "8904109400256"},
    {"name": "All Out Ultra Liquid", "cost_price": 65, "selling_price": 80, "stock": 160, "unit": "pieces", "barcode": "8904109400257"},
    {"name": "Mortein Insta Repellent", "cost_price": 68, "selling_price": 82, "stock": 140, "unit": "pieces", "barcode": "8904109400258"},
    {"name": "Comfort Fabric Conditioner", "cost_price": 180, "selling_price": 220, "stock": 90, "unit": "pieces", "barcode": "8904109400259"},
]



# from django.contrib.auth import get_user_model
# User = get_user_model()
# target_user = User.objects.get(username = "randomusername")

# for item in items:
#     defaults = item.copy()
#     defaults.pop("barcode", None)
#     defaults["user"] = target_user
#     Product_Inventory.objects.get_or_create(
#         user = target_user, 
#         barcode=item["barcode"],
#         defaults = defaults
#     )





# for item in items:
#     defaults = item.copy()
#     defaults.pop("barcode", None)
#     Product_Inventory.objects.get_or_create(
#         barcode=item["barcode"],
#         defaults=defaults
#     )
# print(f"Successfully added {len(items)} Indian grocery items to the database!")



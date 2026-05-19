import re
with open('seed.py', 'r') as f:
    content = f.read()
# evaluate items
import ast
start = content.find('items = [')
end = content.find(']', start) + 1
items_str = content[start:end]
items = ast.literal_eval(items_str.split('=', 1)[1].strip())
barcodes = [i['barcode'] for i in items]
print(f"Total: {len(barcodes)}, Unique: {len(set(barcodes))}")

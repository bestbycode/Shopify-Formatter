required_fields = ["Handle","Title","Vendor","Option1 Value","Image Src","Variant Price","Variant Inventory Qty","Variant Weight Unit","CO2e","Price / kg"]

def is_product_form_valid(form):
    for field in required_fields:
        if field not in form or field[form] in [None, 'null']:
            return False
    return True
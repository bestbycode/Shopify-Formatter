from flask import Flask, render_template, request, redirect, send_file
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
from datetime import date, datetime
from file_parser import convert_format
import simplejson
import shopify

# import json
from helper import is_product_form_valid
from dotenv import load_dotenv
import os

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

SHOP_NAME = 'bestbyuae.myshopify.com'
API_KEY = os.getenv("API_KEY")
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")

shopify.ShopifyResource.set_site(
    f"https://{API_KEY}:{ACCESS_TOKEN}@{SHOP_NAME}/admin")


@app.route("/")
def Home():
    current_year = date.today().year
    return render_template('index.html', year=current_year)


@app.post("/upload")
def upload():
    json_file = request.files['jsonFile']
    excel_file = request.files['excelFile']
    json_ext = os.path.splitext(json_file.filename)[1]
    sheet_ext = os.path.splitext(excel_file.filename)[1]

    if (json_ext == '.json') and (sheet_ext in [".csv", ".xlsx"]):
        json_name = datetime.now().strftime('%Y-%m-%d_%H_%M_%S') + "_json" + json_ext
        sheet_name = datetime.now().strftime('%Y-%m-%d_%H_%M_%S') + "_sheet" + sheet_ext

        json_file_path = f'./static/uploads/jsons/{secure_filename(json_name)}'
        sheet_file_path = f'./static/uploads/spreadsheets/{secure_filename(sheet_name)}'
        json_file.save(json_file_path)
        excel_file.save(sheet_file_path)

        products_data = convert_format(
            sheet_file=sheet_file_path, json_file=json_file_path)
        # return redirect("/send_file")
        print(products_data.to_dict('records'))
        # string_output = json.dumps(products_data.to_dict('records'), ignore_nan=True)
        string_output = simplejson.dumps(
            products_data.to_dict('records'), ignore_nan=True)
        return string_output
    else:
        return 'wrong file types !!', 415


@app.post("/upload-product")
def upload_product():
    print(request.form)

    # Check if necessary fields are present
    # Need to make it more robust (e.g. checking of Option1 Value is a valid date)
    if not is_product_form_valid(request.form):
        return "Invalid Request Form", 422

    # find existing product based on handle
    product = shopify.Product.find(handle="test_" + request.form["Handle"])

    # if product handle does not already exist, create a new one
    if not product:
        product = shopify.Product()

    product.handle = "test_" + request.form["Handle"]
    product.title = request.form["Title"]
    product.vendor = request.form["Vendor"]

    # update the metafield
    metafield = shopify.Metafield({
        'namespace': 'custom',
        'key': 'CO2Eq',
        'value': round(float(request.form["CO2e"]),2),
        'value_type': 'float'
    })
    product.metafields = [metafield]

    # update the image
    image = {
        'src': request.form["Image Src"]
    }
    product.images = [image]

    # update the variant
    found_existing_variant = False
    for variant in product.variants:
        if variant.option1 == request.form["Option1 Value"]:
            found_existing_variant = True
            # variant.option1 = request.form["Option1 Value"]
            variant.price = request.form["Variant Price"]
            variant.inventory_quantity = request.form["Variant Inventory Qty"]
            variant.weight_unit = request.form["Variant Weight Unit"]
            break

    # if variant does not already exist, create a new variant
    if not found_existing_variant:
        new_variant = shopify.Variant({
            'option1': request.form["Option1 Value"],
            'price': request.form["Variant Price"],
            'inventory_quantity': request.form["Variant Inventory Qty"],
            'weight_unit': request.form["Variant Weight Unit"],
        })
        product.variants.append(new_variant)

    # save product
    response = product.save()

    # check if product was succesfully created
    success = "Success"
    if response.status_code not in [200, 201]:
        print(response.data)
        success = "Failed"
    return success, response.status_code


@app.route('/download')
def downloadFile():
    # For windows you need to use drive name [ex: F:/Example.pdf]
    path = "./static/files/json_template.json"
    return send_file(path, as_attachment=True)


@app.route('/send_file')
def sendFile():
    # For windows you need to use drive name [ex: F:/Example.pdf]
    path = "./result.xlsx"
    return send_file(path, as_attachment=True)


if __name__ == "__main__":
    app.run(debug=False, host='0.0.0.0')

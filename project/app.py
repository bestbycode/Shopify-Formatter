from flask import Flask, render_template, request, redirect, send_file
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
from datetime import date, datetime
from file_parser import convert_format
import simplejson

# import json
import os

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


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

        products_data = convert_format(sheet_file=sheet_file_path, json_file=json_file_path)
        # return redirect("/send_file")
        print(products_data.to_dict('records'))
        # string_output = json.dumps(products_data.to_dict('records'), ignore_nan=True)
        string_output = simplejson.dumps(products_data.to_dict('records'), ignore_nan=True)
        return string_output
    else:
        return 'wrong file types !!'


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

from flask import Flask, render_template, request, redirect, send_file
from werkzeug.utils import secure_filename
from datetime import date, datetime
from file_parser import convert_format, get_cols

import os
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/")
def Home():
    current_year = date.today().year
    return render_template('index.html', year=current_year)

# @app.route("/upload2")
# def upload2():
#     print("Trying")
#     return 'wrong file types !!'

@app.post("/getColumns")
def getColumns():
    print("Trying")
    # json_file = request.files['jsonFile']
    excel_file = request.files['excelFile']
    # json_ext = os.path.splitext(json_file.filename)[1]
    sheet_ext = os.path.splitext(excel_file.filename)[1]

    if (sheet_ext in [".csv", ".xlsx"]):
        # json_name = datetime.now().strftime('%Y-%m-%d_%H_%M_%S') + "_json" + json_ext
        sheet_name = datetime.now().strftime('%Y-%m-%d_%H_%M_%S') + "_sheet" + sheet_ext

        # json_file_path = f'./static/uploads/jsons/{secure_filename(json_name)}'
        sheet_file_path = f'./static/uploads/spreadsheets/{secure_filename(sheet_name)}'
        # json_file.save(json_file_path)
        excel_file.save(sheet_file_path)

        cols = get_cols(sheet_file=sheet_file_path).tolist()
        return cols
        # return redirect("/send_file")

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

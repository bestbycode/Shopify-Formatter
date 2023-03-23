// import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [cols, setCols] = useState([]);
  async function uploadFile() {
    const fileInput = document.getElementById("excelFile");
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("excelFile", file);
    let res = await axios.post("http://localhost:5000/getColumns", formData);

    if (res.data?.length && res.data.length > 0) {
      // console.log(res.data);
      setCols([...res.data]);
      console.log(cols);
    }

    // fetch("/getColumns", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((response) => response.json())
    //   .then((data) => {

    //     console.log(data);
    //     // Now add the appropriate divs and stuff
    //   })
    //   .catch((error) => console.error(error));
  }

  return (
    <div className="App">
      <div className="container main-content">
        <div className="row">
          <div className="col-6 uploader">
            <label for="excelFile" className="form-label upload-label">
              <h4>Upload spreadsheet file</h4>
            </label>
            <input
              name="excelFile"
              className="form-control form-control-sm upload-input"
              id="excelFile"
              type="file"
              required
            />
            <p>file format (.csv or .xlsx)</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 text-center submit-button">
            <button
              className="btn btn-success btn-lg btn-block"
              onClick={uploadFile}
            >
              Assign Columns
            </button>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-sm-12 text-center submit-button">
            <h4>Assign appropriate values</h4>
          </div>
          <select name="name" id="name">
            {cols.forEach((col) => (
              <option value={col}>{col}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;

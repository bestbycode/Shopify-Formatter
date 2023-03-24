// import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import axios from "axios";
import ProductRow from "./sub-components/ProductRow";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [productsData, setProductsData] = useState([]);
  console.log("App building...");

  async function getProductData() {
    const fileInput = document.getElementById("excelFile");
    const file = fileInput.files[0];

    const jsonInput = document.getElementById("jsonFile");
    const json = jsonInput.files[0];

    const formData = new FormData();
    formData.append("excelFile", file);
    formData.append("jsonFile", json);
    let res = await axios.post("http://localhost:5000/upload", formData);

    if (res.data?.length && res.data.length > 0) {
      // console.log(res.data);
      console.log(res.data);
      // let d = JSON.parse(res.data);
      setProductsData([...res.data]);
    }
  }

  async function uploadProducts(e) {
    e.preventDefault();
  }

  return (
    <div className="App">
      <div className="container main-content">
        <div className="row">
          <div className="col tool-header">
            <h2>Convert products spreadsheets to Shopify's Products format </h2>
            <p>
              Get the JSON template file from{" "}
              <a
                href="http://localhost:5000/download"
                style={{ text_decoration: "underline" }}
              >
                here
              </a>
              .
            </p>
          </div>
        </div>
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

          <div className="col-6 uploader">
            <label for="jsonFile" className="form-label upload-label">
              <h4>Upload JSON file of the spreadsheet format</h4>
            </label>
            <input
              name="jsonFile"
              className="form-control form-control-sm upload-input"
              id="jsonFile"
              type="file"
              required
            />
            <p>file format (.json)</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 text-center submit-button">
            {/* <!-- <button type="button" className="btn btn-primary">Convert Format</button> -->
                        <!-- <button type="submit" className="btn btn-success btn-lg btn-block">Convert Format</button> --> */}
            <button
              type="submit"
              className="btn btn-success btn-lg btn-block"
              onClick={getProductData}
            >
              Convert Format
            </button>
            {/* <input
              type="submit"
              className="btn btn-success btn-lg btn-block"
              value="Convert Format"
            /> */}
          </div>
        </div>
        <hr />
      </div>
      <div className="container">
        <form action="">
          <h3>Products Below</h3>
          {productsData.length}
          {productsData.map((product, i) => (
            // <div></div>
            <ProductRow productData={product} />
          ))}

          <button
            className="btn btn-success btn-lg btn-block"
            onClick={uploadProducts}
          >
            Upload all products
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;

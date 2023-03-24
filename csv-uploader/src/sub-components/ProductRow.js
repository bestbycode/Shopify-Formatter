// import logo from "./logo.svg";

// import { importantColumns, additionalCo/lumns } from "./ColumnHandler";
import { columns } from "./ColumnHandler";
import { useState } from "react";
import axios from "axios";

function ProductRow({ productData }) {
  const [sent, setSent] = useState(0); // 0 for not sent, 1 for sent, 2 for error
  const sentDict = {
    0: "",
    1: "green-bg",
    2: "red-bg"
  }

  async function uploadProduct(e) {
    e.preventDefault();
    // setSent(sent => (sent+1) % 3 );

    const formData = new FormData();
    columns.forEach(col=>{
      formData.append(col.name, col.value)
    })
    let res = await axios.post("http://localhost:5000/upload-product", formData);

    if (res.status === 200) {
      setSent(1);
    } else {
      setSent(2);
    }

    return
  }

  return (
    <div className={`card row ${sentDict[sent]}`}>
      <h4>{productData.Handle}</h4>
      <img
        className="img-preview"
        src={productData["Image Src"]}
        alt="product img not found"
      />
      {columns.map((column, i) => {
        return (
          <>
            <h4>{column.name}</h4>
            <input
              type="text"
              id={i.toString() + column.name}
              name={column.name}
              value={column.getInitialValue(productData)}
              onChange={(val)=>{
                column.value = val;
              }}
            />
          </>
        );
      })}
      <button
        className="btn btn-success btn-lg btn-block"
        onClick={uploadProduct}
      >
        Upload product
      </button>
    </div>
  );
}

export default ProductRow;

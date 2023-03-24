// import logo from "./logo.svg";

// import { importantColumns, additionalCo/lumns } from "./ColumnHandler";
import {columns} from "./ColumnHandler";


function ProductRow({ productData }) {
  return (
    <div className="card row">
      <h4>{productData.Handle}</h4>
      <img className="img-preview" src={productData["Image Src"]} alt="product img not found"/>
      {columns.map((column, i) => {
        return (
          <>
            <h4>{column.name}</h4>
            <input
              type="text"
              id={i.toString() + column.name}
              name={column.name}
              value={column.getInitialValue(productData)}
            />
          </>
        );
      })}
    </div>
  );
}
// function ProductRow({ productData }) {
//   return (
//     <div className="card row">
//       <h4>{productData.Handle}</h4>
//       <img className="img-preview" src={productData["Image Src"]} />
//       {importantColumns.concat(additionalColumns).map((column, i) => {
//         return (
//           <>
//             <h4>{column}</h4>
//             <input
//               type="text"
//               id={i.toString() + column}
//               name={column}
//               value={productData?.[column] ?? ""}
//             />
//           </>
//         );
//       })}
//     </div>
//   );
// }

export default ProductRow;

// const importantColumns = [
//   "Handle",
//   "Title",
//   "Vendor",
//   "Option1 Value",
//   "Variant Inventory Qty",
//   "Variant Weight Unit",
//   "Variant Price",
//   "Image Src",
// ];

// const additionalColumns = ["CO2e", "Price / kg"];

// export { importantColumns, additionalColumns };

import {createHandler, defaultGetter, co2Calc, pricePerKgCalc} from "../helper-functions/ColumnFunctions";

class columnHandler {
  constructor(name, handlerFunction){
    this.name = name;
    this.initializer = handlerFunction;
    this.value = "";
  }
  getName = () => this.name;

  getInitialValue = (productData) => {
    this.value = this.initializer(this.name, productData);
    return this.value;
  }
}

const columns = [
  new columnHandler("Handle", createHandler),
  new columnHandler("Title", defaultGetter),
  new columnHandler("Vendor", defaultGetter),
  new columnHandler("Option1 Value", defaultGetter),
  new columnHandler("Variant Inventory Qty", defaultGetter),
  new columnHandler("Variant Weight Unit", defaultGetter),
  new columnHandler("Variant Price", defaultGetter),
  new columnHandler("Image Src", defaultGetter),
  new columnHandler("CO2e", co2Calc),
  new columnHandler("Price / kg", pricePerKgCalc),
];


export {columns};
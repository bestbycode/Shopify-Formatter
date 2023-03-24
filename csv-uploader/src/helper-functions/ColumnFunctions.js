// All functions must be of the form function(columnName, productData)

const GOLDEN_RATIO = 0.52;

const createHandler = (columnName, productData) => {
  // Don't actually need the columnName here
  try {
    let title = productData["Title"].toLowerCase().replaceAll(" ", "_").replace(/&nbsp;/g, "_");
    let vendor = productData["Vendor"].toLowerCase().replaceAll(" ", "_").replace(/&nbsp;/g, "_");
    return title.concat(vendor);
  } catch (error) {
    console.error(error);
    console.log("ERROR");
    console.log(productData["Title"]);
    console.log(productData["Vendor"]);
    return "";
  }

//   return title.concat(vendor);
};

const defaultGetter = (columnName, productData) => {
  return productData?.[columnName] ?? "";
};

class RegexMatchedFunction {
  constructor(regex, handlerFunction) {
    this.regex = regex;
    this.handler = handlerFunction;
  }
}

// handles ml or gm
const mlgmHandler = (weight) => {
  return weight / 1000.0; // convert to kg or litre
};

// handles kg or l
const kglHandler = (weight) => {
  return weight;
};

const co2Calc = (columnName, productData) => {
  // Array of regexes
  // Keep going through them and using them until a match is found!
  const regexes = [
    // Regexp(".?([0-9]+) *[xX] *([0-9]+)(?:(?:[gG][mM]?)|(?:[mM][lL])).", "i"),
    // Regexp(".?([0-9]+) *[xX] *([0-9]+)(?:(?:[kK][gG])|(?:[lL])).", "i")
    new RegexMatchedFunction(
      RegExp(".?([0-9]+) *[xX] *([0-9]+)(?:(?:gm?)|(?:ml)).", "i"),
      mlgmHandler
    ),
    new RegexMatchedFunction(
      RegExp(".?([0-9]+)s? *[xX] *([0-9]+)(?:(?:gm?)|(?:ml)).", "i"),
      mlgmHandler
    ),
    new RegexMatchedFunction(
      RegExp(".?([0-9]+) *[xX] *([0-9]+)(?:(?:kg)|(?:l)).", "i"),
      kglHandler
    ),
  ];
  const title = productData["Title"];
  let match = null;
  let currRegex = null;
  for (let i = 0; i < regexes.length; i++) {
    currRegex = regexes[i];
    match = title.match(currRegex.regex);
    if (match != null) break;
  }

  if (match == null) return ""; // Exceptional Case: No matches for expiry date were found

  let weight = parseInt(match[0], match[1]);
  weight = currRegex.handler(weight);

  return GOLDEN_RATIO * weight;
};

const pricePerKgCalc = (columnName, productData) => {
  if (productData?.["Variant Weight Unit"]?.toLowerCase()?.trim() === "kg") {
    return productData["Variant Price"];
  }
  return -1;
};

export { defaultGetter, createHandler, co2Calc, pricePerKgCalc };

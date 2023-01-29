const fs = require("fs");
const path = require("path");

// function Product(title) {
//   this.title = title;
//   this.save = () => {
//     products.push(this);
//   };
// }
// Product.fetchAll = function () {
//   return products;
// };
// module.exports = Product;

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);
const getAllProductsHelper = (cb) => {
  fs.readFile(p, (err, content) => {
    if (err) {
      cb([]);
    }
    cb(JSON.parse(content));
  });
};

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }
  save() {
    getAllProductsHelper((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log("error to write", err);
      });
    });
  }
  static fetchAll(cb) {
    getAllProductsHelper(cb);
  }
};

const fs = require("fs");
const path = require("path");
const Product = require("./product");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");
const pProducts = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const existingProductIndex = cart.products.findIndex((p) => p.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty++;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += Number(productPrice);
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
  static deleteProductFromCart(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) return;
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((p) => p.id === id);
      if (!product) return;
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter((p) => p.id !== id);
      updatedCart.totalPrice -= productQty * Number(productPrice);
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }
  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
  static updateTotalPriceInCaseOfEdit(products, productId, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      const cartProducts = [...cart.products];
      const updatedTotalPrice = products
        .filter((p) => cartProducts.find((data) => data.id === p.id))
        .reduce((acc, p) => {
          const cartData = cartProducts.find((data) => data.id === p.id);
          const { qty } = cartData;
          let certainProductsPrice;
          if (p.id === productId) {
            certainProductsPrice = parseFloat(productPrice) * qty;
          } else certainProductsPrice = parseFloat(p.price) * qty;
          return acc + certainProductsPrice;
        }, 0);
      cart.totalPrice = updatedTotalPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => console.log(err));
    });
  }
};

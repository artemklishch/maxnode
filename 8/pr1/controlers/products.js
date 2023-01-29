const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      pageTitle: "Shop",
      path: "/",
      prods: products,
      hasProducts: products.length > 0,
      activeShop: true,
      activeAddProd: false,
      productCss: true,
      formCss: false,
    });
  });
};

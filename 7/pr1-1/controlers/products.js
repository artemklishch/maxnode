const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    activeShop: false,
    activeAddProd: true,
    productCss: true,
    formCss: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

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

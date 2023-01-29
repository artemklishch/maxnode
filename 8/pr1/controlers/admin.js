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
  res.render("admin/products", {
    pageTitle: "Admin Product",
    path: "/admin/products",
    activeShop: false,
    activeAddProd: true,
    productCss: true,
    formCss: true,
  });
};

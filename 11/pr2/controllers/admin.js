const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  try {
    await req.user.createProduct({
      // the name of the above method is made of "create"/"Product" words concatenation "create" + "Product" = "createProduct"
      title,
      imageUrl,
      description,
      price,
    });
    res.redirect("/");
  } catch (err) {
    console.log("Failed to save data", err);
  }
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  try {
    const products = await req.user.getProducts({ where: { id: prodId } });
    const product = products[0];
    if (!product) {
      throw new Error("Failed to fetch data!");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  } catch (err) {
    console.log("Failed to fetch data!", err);
    return res.redirect("/");
  }
};

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  try {
    const product = await Product.findByPk(prodId);
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDesc;
    await product.save();
    res.redirect("/admin/products");
  } catch (err) {
    console.log("Failed to save data!");
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await req.user.getProducts();
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (err) {
    console.log("Failed to fetch data: ", err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const product = await Product.findByPk(prodId);
    await product.destroy();
    res.redirect("/admin/products");
  } catch (err) {
    console.log("Failed to delete product");
  }
};

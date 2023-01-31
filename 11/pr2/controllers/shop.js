const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (err) {
    console.log("Failed to fetch data: ", err);
  }
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    // const product = await Product.findAll({
    //   where: {
    //     id: prodId,
    //   },
    // })[0];
    const product = await Product.findByPk(prodId);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (err) {
    console.log("Failed to fetch data: ", err);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    // const products = await Product.findAll({attributes: ['title']}); // here we get objects with only titles
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (err) {
    console.log("Failed to fetch data: ", err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const carts = await req.user.getCart();
    const cartProducts = await carts.getProducts();
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: cartProducts,
    });
  } catch (err) {
    console.log("Failed to get Carts");
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const carts = await req.user.getCart();
    const cartProducts = await carts.getProducts({ where: { id: prodId } });
    let cartProduct = cartProducts.length > 0 ? cartProducts[0] : null;
    const newQuantity = !cartProduct ? 1 : cartProduct.cartitem.quantity + 1;
    if (!cartProduct) {
      cartProduct = await Product.findByPk(prodId);
    }
    await carts.addProduct(cartProduct, { through: { quantity: newQuantity } });
    res.redirect("/cart");
  } catch (err) {
    console.log("Failed to get Carts");
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const carts = await req.user.getCart();
    const cartProducts = await carts.getProducts({ where: { id: prodId } });
    let cartProduct = cartProducts.length > 0 ? cartProducts[0] : null;
    if (!cartProduct) {
      cartProduct = await Product.findByPk(prodId);
    }
    cartProduct.cartitem.destroy();
    res.redirect("/cart");
  } catch (err) {
    console.log("Failed to get Carts");
  }
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

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

exports.getCart = (req, res, next) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: [],
      });
  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render("shop/cart", {
  //       path: "/cart",
  //       pageTitle: "Your Cart",
  //       products: cartProducts,
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
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

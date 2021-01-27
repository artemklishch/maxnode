const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then((products) => {
  //     res.render("shop/product-detail", {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => console.log(err));

  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart() // не понятно почему это здесь
    .then((cart) => {
      return (
        cart
          .getProducts() // это срабатывает, т.к у нас здесь есть соединительный мост,
          //модель, объединяющая внешние ключи cartId, productId
          .then((products) => {
            res.render("shop/cart", {
              path: "/cart",
              pageTitle: "Your Cart",
              products: products,
            });
          })
          .catch((err) => console.log(err))
      );
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    // здесь достаем из таблицы конкретную корзину пользователя
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
      // это означает, что мы в конкретной корзине ищем продукт по соответствующему id
      // т.к. здесь есть содеинительный мост, содержащий внешний ключ productId,
      // проверяем в таблице cartItems, а не в таблице products, наличие соответствующего продукта
      // под капотом происходит посик с сопоставлением cartId, к-й уже есть благодаря тому, что выше мы
      // методом getCart получили конкретную корзину
      // и с сопоставлением productId, к-й мы передаем в метод getProducts
    })
    .then((products) => {
      let product;
      if (products.length > 0) product = products[0];
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        // не понятно как, но это доступ к данным дургой таблицы,
        //т.к. сделаны настройки взаимосвязей таблиц с помощью секвалайз
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((pr) => {
      return fetchedCart.addProduct(pr, { through: { quantity: newQuantity } });
      // добавляем в корзину продукт с помощью метода из сквалайза
      // в корзине появляется продукт, в таблице cartItems благодаря
      // { through: { quantity: newQuantity } } маняется число (quantity)
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy(); // не понимаю как это работает
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      req.user
        .createOrder()
        .then((order) => {
          order.addProducts(
            products.map((pr) => {
              pr.orderItem = { quantity: pr.cartItem.quantity }; // устанавливаетс число продуктов, не понятно почему
              return pr;
            })
          );
        })
        .then(() => fetchedCart.setProducts(null)) // что за метод?
        .then(() => res.redirect("/orders"))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] }) // т.к. в массив не попадает orderItem
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders,
      });
    })
    .catch((err) => console.log(err));
};

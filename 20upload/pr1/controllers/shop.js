const fs = require("fs");
const path = require("path");
const Product = require("../models/product");
const Order = require("../models/order");
const PDFDocument = require("pdfkit");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        // isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        // isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        // isAuthenticated: req.session.isLoggedIn,
        // csrfToken: req.csrfToken() // вместо этого, мы создали мидлвеар, что срабатывает на любой запрос
        // и присваивает res.locals = эти значения, чтоб не повторяться
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        // isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        // isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found"));
      } // Проверяем соответствие order пользователю, к-й его создал
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      } // проверяем авторизован польователь или нет
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      // здесь создаем ПДФ файл на ходу, помещаем в файловую систему
      // (или меняем, если файл существует)
      const pdfDoc = new PDFDocument(); // создаем кон6структор
      pdfDoc.pipe(fs.createWriteStream(invoicePath)); // запускаем запись
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=" + invoiceName);
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      }); // устанавливаем размер шрифта и записываем данные
      pdfDoc.text("---------------------------");
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.product.price * prod.quantity;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              " - " +
              prod.quantity +
              " x " +
              "$" +
              prod.product.price
          );
      });
      // pdfDoc.text("Hello world!"); // записываем данные
      pdfDoc.text("---");
      pdfDoc.fontSize(20).text("Total price: $" + totalPrice); // fontSize меняется сверху вниз
      pdfDoc.end(); // создаем файл в файловой системе и скачиваем

      // это 1-й способ для чтения и скачивания ПДФ файла, к-й есть в файловой системе
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) return next(err);
      //   res.setHeader("Content-Type", "application/pdf"); // это для того, чтоб открывать пдф файл в браузере
      //   // res.setHeader("Content-Disposition", "inline; filename=" + invoiceName); // ничем не отличается, с обычным открытием в браузере
      //   res.setHeader(
      //     "Content-Disposition",
      //     "attachment; filename=" + invoiceName
      //   ); // сразу скачивает с присваиванием расширения
      //   res.send(data); // это скачивает файл
      // });

      // это 2-й способ для чтения и скачивания ПДФ файла, к-й есть в файловой системе
      // это рекомендуется исползовать для чтения файла особенно в случае большого файла
      // в этому случае программа считывает файл в потоке, постепенно, а не целиком,
      // и таким образом снижается нагрузка на память
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   "attachment; filename=" + invoiceName
      // );
      // file.pipe(res);
    })
    .catch((err) => next(err));
};

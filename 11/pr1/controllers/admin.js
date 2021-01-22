const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user
    .createProduct({
      title,
      price,
      imageUrl,
      description,
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err)); // это возможно, т.к. настроены зависимости моделей в app.js,
  //к слову create добавлено название модели "Product" - отсюда и название метода

  // Product.create({
  //   title,
  //   price,
  //   imageUrl,
  //   description,
  //   userId: req.user.id, // вместо такого прямого присваивания id можно сделать так, как показано выше
  // })
  //   .then(() => res.redirect("/admin/products"))
  //   .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  req.user.getProducts({ where: { id: prodId } }).then((products) => {
    if (!products[0]) {
      return res.redirect("/");
    }
    res
      .render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: products[0],
      })
      .catch((err) => console.log(err));
  });
  // а здесь мы благодаря настроенным зависимостям между моделями
  // вызываем метод/раут getProducts, что определен здесь в файле внизу

  // Product.findByPk(prodId)
  // .then((product) => {
  //   if (!product) {
  //     return res.redirect("/");
  //   }
  //   res
  //     .render("admin/edit-product", {
  //       pageTitle: "Edit Product",
  //       path: "/admin/edit-product",
  //       editing: editMode,
  //       product: product,
  //     })
  //     .catch((err) => console.log(err));
  // });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price - updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      return product.save(); // перезаписываем данные в базу данных, перед этим изменения вносились локально
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
  // здесь мы тоже заменяем с использованием возможностей взаимосвязей моделей

  // Product.findAll()
  //   .then((products) => {
  //     res.render("admin/products", {
  //       prods: products,
  //       pageTitle: "Admin Products",
  //       path: "/admin/products",
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.destroy({ where: { id: prodId } });
  Product.findByPk(prodId)
    .then((product) => product.destroy())
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

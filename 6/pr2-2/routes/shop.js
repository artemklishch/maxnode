const express = require("express");

const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("adminData", adminData.products);
  console.log("req.url", req.url === "/");
  res.render("shop", {
    pageTitle: "Shop",
    path: "/",
    prods: adminData.products,
    hasProducts: adminData.products.length > 0,
    activeShop: true,
    activeAddProd: false,
    productCss: true,
    formCss: false,
  });
});

module.exports = router;

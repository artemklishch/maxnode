const express = require("express");

const adminData = require("./admin");
const productsData = require("../routes/admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("adminData", adminData.products);
  res.render("shop", {
    pageTitle: "Shop",
    path: "/",
    prods: productsData.products,
  });
});

module.exports = router;

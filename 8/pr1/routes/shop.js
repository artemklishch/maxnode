const express = require("express");

const productsController = require("../controlers/products");

const router = express.Router();

router.get("/", productsController.getProducts);

module.exports = router;

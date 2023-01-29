const express = require("express");

const router = express.Router();
const adminControllers = require("../controlers/admin");

// /admin/add-product => GET
router.get("/add-product", adminControllers.getAddProduct);
// /admin/add-product => POST
router.post("/add-product", adminControllers.postAddProduct);
// /admin/add-product => POST
router.get("/products", adminControllers.postAddProduct);

module.exports = router;

const express = require("express");
const path = require("path");
const rootPath = require("../util/path");

const router = express.Router();

router.get("/add-product", (req, res) => {
  res.sendFile(path.join(rootPath, "views", "add-product.html"));
  // res.sendFile(path.join(__dirname, "..", "views", "add-product.html"));
});

router.post("/add-product", (req, res) => {
  console.log("first", req.body);
  res.redirect("/");
});

module.exports = router;

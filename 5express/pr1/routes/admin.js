const express = require("express");

const router = express.Router();

router.get("/add-product", (req, res) => {
  res.send(`<form action='/admin/add-product' method='POST'>
      <input type='text' name='title' />
      <button type='submit'>Send</button>
    </form>`);
});

router.post("/add-product", (req, res) => {
  console.log("first", req.body);
  res.redirect("/");
});

module.exports = router;

const { Router } = require("express");
const router = Router();
const path = require("path");

router.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "views", "shop.html"));
});

module.exports = router;

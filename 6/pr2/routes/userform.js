const { Router } = require("express");
const router = Router();

const users = [];

router.get("/", (req, res, next) => {
  res.render("userform", {
    pageTitle: "User Form Page",
    isUserFormPage: true,
  });
});
router.post("/add", (req, res, next) => {
  users.push({ username: req.body.username });
  res.redirect("/");
});

exports.routes = router;
exports.users = users;

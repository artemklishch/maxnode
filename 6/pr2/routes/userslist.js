const { Router } = require("express");
const router = Router();

const { users } = require("./userform");

router.get("/", (req, res, next) => {
  res.render("userslist", {
    pageTitle: "Users List",
    isUsersListPage: true,
    users: users,
  });
});

module.exports = router;

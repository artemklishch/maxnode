const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1] === 'true';
  //   res.render("auth/login", {
  //     path: "/login",
  //     pageTitle: "Login",
  //     isAuthenticated: isLoggedIn,
  //   });
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  //   res.setHeader("Set-Cookie", "loggedIn=true; Expires"); // Expires делает так, что куки живут до закрытия браузера
  //   res.setHeader("Set-Cookie", "loggedIn=true; Domain="); // Domain= означает - куда куки буду отправлдены
  //   res.setHeader("Set-Cookie", "loggedIn=true; Secure"); // Secure означает, что куки буду установлены, если запрос отправлен чере https
  //   res.setHeader("Set-Cookie", "loggedIn=true; Max-Age=10"); // Max-Age=10 устанавливает время жизни куков
  //   res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly"); // HttpOnly означает, что куки можно считывать только запрос отправлен чере http
  //   req.isLoggedIn = true;
  User.findById("5bab316ce0a7c75f783cb8a8")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect("/");
    })
    .catch((err) => console.log(err));
  // req.session.isLoggedIn = true;
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
require("dotenv").config();

// const transporter = nodemailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "ea8c3367b2cbdb",
//     pass: "4ff811e697dfeb",
//   },
// });
// здесь на сайт м приходит сообщение, что сообщение отпралено, но на почту реально ничего не приходит, хоть и нет ошибок в консоли

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // работает и без этого
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// const mailOptions = {
//   from: '"Example Team" <from@example.com>',
//   to: "user1@example.com, user2@example.com",
//   subject: "Nice Nodemailer test",
//   text: "Hey there, it’s our first message sent with Nodemailer ;) ",
//   html: "<b>Hey there! </b><br> This is our first message sent with Nodemailer",
// };

exports.getLogin = (req, res, next) => {
  let message = req.flash("error"); //возвращает массив строк или пустой массив, если ошибок нет
  if (message.length > 0) {
    message = message[0];
  } else message = null;
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    // errorMessage: req.flash("error"), // сообщение от также вытскивается в шаблоне
    errorMessage: message,
    // isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error"); //возвращает массив строк или пустой массив, если ошибок нет
  if (message.length > 0) {
    message = message[0];
  } else message = null;
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    // isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password!");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid password!");
          res.redirect("/login");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash(
          "error",
          "E-mail exests already. Please choice anbother one!"
        );
        return res.redirect("/signup");
      }
      return bcrypt.hash(password, 12).then((hashPassword) => {
        const user = new User({
          email,
          password: hashPassword,
          cart: { items: [] },
        });
        return user.save();
      });
    })
    .then(() => {
      res.redirect("/login");
      transporter
        .sendMail({
          to: email,
          from: "shop@node-complete.com",
          subject: "Signup succseded",
          html: "<h1>You are successfully signed up!</h1>",
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else message = null;
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex"); // 'hex' трансформирует в нужныф формат
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter
          .sendMail({
            to: req.body.email,
            from: "shop@node-complete.com",
            subject: "Password reset",
            html: `
            <p>You requested for password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
          `,
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else message = null;
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "Get New Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    _id: userId,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};

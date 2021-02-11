const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const { check, body } = require("express-validator");
const User = require("../models/user");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with a length at least of 6 symbols and only numbers and text"
    )
      .isLength({ min: 6 })
      .trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email address is forbidden");
        // }
        // return true; // если валидатор не обнаруживает ошибок, то в этом месте необходимо возвращать true
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-mail exists already. Please choice another one!"
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with a length at least of 6 symbols and only numbers and text"
    )
      .isLength({ min: 6 })
      .isAlphanumeric().trim(), // вариант с body более специальный, т.к. это значит, что проверяется значение именно в теле запроса, а не везде, где встретися свойство password
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;

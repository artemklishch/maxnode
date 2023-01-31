const path = require("path");
const express = require("express");
const sequelize = require("./util/database");

const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const Product = require("./models/product");
const User = require("./models/user");

const app = express();

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log("Failed to get user", err);
    });
});
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" }); // association: User that created the Product
User.hasMany(Product); // association: User has many products

sequelize
  // .sync({ force: true }) // force: true recreates tables, ovrwrites them to new empty ones
  .sync()
  .then(() => User.findByPk(1))
  .then((user) => {
    if (!user) {
      return User.create({ name: "Bob", email: "test@gmail.com" });
    }
    return user;
  })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

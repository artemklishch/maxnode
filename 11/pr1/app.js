const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => { 
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
}); // этот мидлвеар тут делается, чтоб создать аутентификацию
// путем прикрепления пользователя к объекту запроса, через присваивание встроенному
// благодаря sequelize свойству в объекте запроса user со значениея user

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// создаем ассоциации, взаимосвязь между моделями продукtа и пользователя, чтоб при работе
// с одной моделью можно было однговременно работать с данными из структуры другой модели
Product.belongsTo(User, { constrains: true, onDelete: "CASCADE" }); // пользовавтель может использовать данные по структуре модели продукта
User.hasMany(Product); // ползователь может иметь разные продукты
// one-to-many используется парами

User.hasOne(Cart); // пользователь имеет только одну корзину
Cart.belongsTo(User); // корзина принадлежит пользователю
// one-to-one используется парами

Cart.belongsToMany(Product, { through: CartItem }); // в корзине может быть много продуктов
Product.belongsToMany(Cart, { through: CartItem }); // продукт может быть в разных корзинах
// many-to-many; можно использовать одно выраждение, но лучше использовать парами

Order.belongsTo(User);
User.hasMany(Order);
// one-to-many используется парами

Order.belongsToMany(Product, { through: OrderItem }); // в таблице OrderItem добавляется поле productId, orderId
// достаточно написать один раз Order.belongsToMany(Product, { through: OrderItem }) и в таблице OrderItem
// появятся два внешних ключа, однако часто используется пара выражений, т.е. к тому, что есть,
// можно также дополнительно написать с обратным расположением моделей
// Product.belongsToMany(Order, { through: OrderItem }) , чтоб лучше это использовать
// many-to-many; можно использовать одно выраждение, но лучше использовать парами

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => User.findByPk(1))
  .then((user) => {           
    if (!user) {
      return User.create({ name: "Bob", email: "devartemklishch@gmail.com" });
    }
    return user;
  })
  .then((user) => {
    // console.log(user);
    return user.createCart(); // создает корзину пользователя, спец метод благодаря настройкам взаимосвязей
  })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));

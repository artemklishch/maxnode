const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const db = require("./util/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// db.execute("SELECT*FROM products")
//   .then((result) => {
//     console.log(result[0]);
//     console.log(result[1]);
//   })
//   .catch((err) => console.log(err)); 
//   // делает запрос на получение данных из базы данных их таблицы products
//   // возвращает массив с двумя элементами: 1-й данные таблицы в виде массива с объектом, 2-й забуферизированные данные (распарсить не вышло)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);

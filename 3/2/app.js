const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false })); // это и то, чт в строке выше, предназначено для распарсивания данных в кодировке
app.use(bodyParser.urlencoded({ extended: true })); // это и то, чт в строке выше, предназначено для распарсивания данных в кодировке
// но то, что в строке выше - более современно
app.use(express.static(path.join(__dirname, "public")));
// app.use((req, res, next) => {
//   console.log("In the middleware!");
//   next();
// }); любой мидлвеар принимает запрос, ответ и некст; некст нужно вызвать, чтоб перейти к следующему мидлвеар
// экспресс добавляет функции мидлвеар и при запросе эти мидлвеар выполняются

app.use("/", shopRoutes); // порядок имеет значнеие при использовании метода .use в райтах;
// здесь путь - "/", а слеш есть во всех путях, поэтому программа считывает его первым
// и на выходе этот пусть сразу же возвращает не проверяя дальнейшее содержание строки
app.use("/admin", adminRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "error.html"));
});

app.listen(3000);

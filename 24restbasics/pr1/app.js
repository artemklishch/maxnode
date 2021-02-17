const express = require("express");
const feedRoutes = require("./routes/feed");
const bodyParser = require("body-parser");

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form> // это здесь не нужно
app.use(bodyParser.json()); // это нужно, чтоб парсить входящие json данные

app.use((req, res, next) => {
  // добавляем хедеры для того, чтоб данные, к-е отправляются сервером, принимались везде
  // и не было проблем с CORS policy
  // res.setHeader('Access-Control-Allow-Origin', 'codepen.io') // 'codepen.io' - конкретный домен, к-му раскрываются данные
  res.setHeader("Access-Control-Allow-Origin", "*"); // * все домены
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  ); // разрешаем методы запросов
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // разрешаем заголовки
  // таким образом мы натсраиваем, чтоб не было проблем с CORS policy
  next();
});

app.use("/feed", feedRoutes);

app.listen(8080);

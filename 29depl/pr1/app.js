const path = require("path");
const fs = require("fs");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.mmwrn.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;
const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); // название папки, куда будут попадать загружаемые файлы
    // папку нужно создать предварительно в корне проекта
  },
  filename: (req, file, cb) => {
    cb(null, new Date().valueOf() + "-" + file.originalname); // создает название загружаемого файла
  },
}); // это для настройки конфигурации загружаемых файлов, для конфигурации их сохранения
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true); // true если хотим сохранять загружаемый файл
  } else {
    cb(null, false); // false если не хотим сохранять загружаемый файл
  }
};
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
); // для настроойки логирования, передается в morgan
// flags: "a" - значит, что лог добавляется в конец списка
// создает файл по заданному пути и после передачи в morganтуда записываются логи
const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");

const app = express();
app.use(helmet()); // для защиты, нужно ставить перед мидлвеарами раутами
app.use(compression()); // для сжатия
app.use(morgan("combined", { stream: accessLogStream })); // для логирования данных
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
); // этот мидлевеар для раскодировки загружаемых файлов
// single мы используем, т.к. в нашем случае мы будем загружать в форму только один файл
// 'image' внутри single, т.к. наше поле в атрибуте name формы так называется;
app.use(csrfProtection); // это после сессии
app.use(flash()); // это после сессии, чтоб передавать данные при редиректе, например, сообщения об ошибках

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error("Sync Dummy");
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      // throw new Error("Dummy");
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      // throw new Error(err);
      next(new Error(err)); // это позволяет избежать безконечного цикла и недостатков в обработке ошибок
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);
app.use((error, req, res, next) => {
  // этот мидлвеар специальный, срабатывает, если к коде вызывается next(error)
  // res.status(error.httpStatusCode).render(...)
  // res.redirect("/500"); это работает, но моеж вызывать иногда безконечный цикл
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    //   .listen(process.env.PORT || 3000)
    // код выше - для деплоя с помощью ключа
    app.listen(process.env.PORT || 3000)
  )
  .catch((err) => {
    console.log(err);
  });

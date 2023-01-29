const path = require("path");
const express = require("express");

const errorControllers = require("./controlers/error");
const productsRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", productsRoutes);
app.use(shopRoutes);
app.use(errorControllers.getError);

app.listen(3000);

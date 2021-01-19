const express = require("express");
const viewsHbs = require("express-handlebars");
const path = require("path");

const PORT = process.env.PORT || 3000;
const userformData = require("./routes/userform");
const routesUserslist = require("./routes/userslist");

const app = express();

app.engine(
  "hbs",
  viewsHbs({
    layoutsDir: "views/layouts",
    defaultLayout: "main",
    extname: "hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routesUserslist);
app.use("/userform", userformData.routes);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

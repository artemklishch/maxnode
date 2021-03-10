// const fs = require("fs");
// const fs = require("fs").promises;
// import fs from "fs";
import fs from "fs/promises";
// для настройки папки __dirname используем:
// const __filename = fileURLToPath(import.meta.url); const __dirname = dirname(__filename);
// т.к. по дефолту, эти переменные не работают
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const resHandler = (req, res, next) => {
  // fs.readFile("my-page.html", "utf8", (err, data) => {
  //   res.send(data);
  // });
  // res.sendFile(path.join(__dirname, "my-page.html"));
  fs.readFile("my-page.html", "utf8")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => console.log(err));
};
// module.exports = resHandler;
// export default resHandler;

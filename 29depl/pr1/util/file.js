const fs = require("fs");

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) throw err;
  }); // удаляет файл по указанному пути
};
exports.deleteFile = deleteFile;

const path = require("path");
const fs = require("fs");

const clearImage = (filePath) => {
  const newPath = path.join(__dirname, "..", filePath);
  fs.unlink(newPath, (err) => console.log(err));
};
exports.clearImage = clearImage;

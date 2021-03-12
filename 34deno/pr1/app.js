// const fs = require("fs").promises;
// const text = "This is a text and it should be stored in a file!";
// fs.writeFile("node-message.txt", text).then(() =>
//   console.log("Wrote file11111!")
// );

const http = require("http");
const server = http.createServer((req, res) => {
  res.end("Hello world (from Node)");
});
server.listen(3000);

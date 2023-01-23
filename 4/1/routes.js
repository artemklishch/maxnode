const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Hello from Node JS</title></head>");
    res.write(
      `<body>
            <form action='/message' method='POST' >
                <input type='text' name='message'/>
                <button>Submit</button>
            </form>
          </body>`
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    // let text = ""
    req.on("data", (chunk) => {
      //   console.log("chunk", chunk);
      body.push(chunk);
      //   console.log("body", body);
      //   text = chunk.toString() // this also works
    });
    return req.on("end", () => {
      // console.log('text', text)
      const parsedBody = Buffer.concat(body).toString();
      //   console.log("parsedBody", parsedBody);
      const message = parsedBody.split("=")[1];
      //   fs.writeFileSync("message.txt", message);
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>Hello from Node JS</title></head>");
  res.write("<body><p>Hello world</p></body>");
  res.write("</html>");
  res.end();
};

module.exports.handler = requestHandler;

// module.exports = {
//   handler: requestHandler,
//   someText: "some text",
// };
// module.exports = requestHandler;

const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const sinon = require("sinon");
const authMiddleware = require("../middleware/is-auth");

describe("Auth middleware", function () {
  it("should throw an error if there is not header in request", function () {
    const req = {
      get: function () {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated."
    );
  });
  it("should throw an error if there is no header", function () {
    const req = {
      get: function () {
        return "Bear";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
  it("should yield a userId after decoding token", function () {
    const req = {
      get: function () {
        return "Bear hjkh";
      },
    };
    // jwt.verify = function () {
    //   return { userId: "dfdsfgsdfgsd" };
    // }; // если использовать так, то это переопределяет метод встроенной библиотеки глобально
    // и не сработает тест, к-й также обращается к этому методу, т.к. будет ожидать, что
    // метод будет работать, как предусмотрено библиотекой
    // поэтому исползуется sinon
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore(); // восстанавливает оригинальную функцию
  });
  it("should throw an error if token is not verified", function () {
    const req = {
      get: function () {
        return "Bear hjkh";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});

const expect = require("chai").expect;
const mongoose = require("mongoose");
const sinon = require("sinon");
const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth controller", function () {
  before(function (done) {
    // хук, срабатывает один раз перед началом тестирования
    mongoose
      .connect(
        "mongodb+srv://Artem:LjFTMaaDvBKci4uf@cluster0.mmwrn.mongodb.net/test-messages?retryWrites=true&w=majority"
      )
      .then(() => {
        const user = new User({
          email: "test@test.com",
          password: "12345",
          name: "Bob",
          posts: [],
          _id: "60366d7081c47d7fa0c95652",
        });
        return user.save();
      })
      .then(() => done());
  });
  beforeEach(function () {}); // хук срабатывает перед каждым тестом
  afterEach(function () {}); // хук срабатывает после каждого теста

  it("should throw error 500 if fetching database fails", function (done) {
    // done для асинхронного кода
    sinon.stub(User, "findOne");
    User.findOne.throws();
    const req = {
      body: {
        email: "test@gmail.com",
        password: "111111",
      },
    };
    AuthController.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });
    User.findOne.restore();
  });

  it("should send a response with a valid user status for existing user", function (done) {
    // mongoose
    //   .connect(
    //     "mongodb+srv://Artem:LjFTMaaDvBKci4uf@cluster0.mmwrn.mongodb.net/test-messages?retryWrites=true&w=majority"
    //   )
    //   .then(() => {
    //     const user = new User({
    //       email: "test@test.com",
    //       password: "12345",
    //       name: "Bob",
    //       posts: [],
    //       _id: "60366d7081c47d7fa0c95652",
    //     });
    //     return user.save();
    //   })
    //   .then(() => {
    //     const req = { userId: "60366d7081c47d7fa0c95652" };
    //     const res = {
    //       statusCode: 500,
    //       userStatus: null,
    //       status: function (code) {
    //         this.statusCode = code;
    //         return this;
    //       },
    //       json: function (data) {
    //         this.userStatus = data.status;
    //       },
    //     };
    //     AuthController.getUserStatus(req, res, () => {}).then(() => {
    //       expect(res.statusCode).to.be.equal(200);
    //       expect(res.userStatus).to.be.equal("I am new!");
    //       User.deleteMany({})
    //         .then(() => {
    //           return mongoose.disconnect();
    //         })
    //         .then(() => done());
    //     });
    //   })
    //   .catch((err) => console.log(err));

    const req = { userId: "60366d7081c47d7fa0c95652" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    AuthController.getUserStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("I am new!");
      done();
    });
  });
  after(function (done) {
    // хук срабатваает после окончания тестирования
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => done());
  });
});

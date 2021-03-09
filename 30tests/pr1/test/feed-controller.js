const expect = require("chai").expect;
const mongoose = require("mongoose");
const sinon = require("sinon");
const User = require("../models/user");
const Post = require("../models/post");
const FeedController = require("../controllers/feed");

describe("Feed controller", function () {
  before(function (done) {
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

  it("should add a post to posts of the creator", function (done) {
    const req = {
      body: {
        title: "Test post",
        content: "Some test content",
      },
      file: {
        path: "somepath",
      },
      userId: "60366d7081c47d7fa0c95652",
    };
    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };
    FeedController.createPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser).to.have.property("posts");
      expect(savedUser.posts).to.have.length(1);
      done();
    });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => done());
  });
});

const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  async save() {
    try {
      const db = getDb();
      const res = await db.collection("users").insertOne(this);
      return res;
    } catch (err) {
      console.log("Failed to save data!");
    }
  }
  static async getUser(userId) {
    try {
      const db = getDb();
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(userId) });
      return user;
    } catch (err) {
      console.log("Failed to save data!");
    }
  }
}

module.exports = User;

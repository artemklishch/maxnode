const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }
  async save() {
    try {
      const db = getDb();
      const collection = await db.collection("products");
      const result = await collection.insertOne(this);
      return result;
    } catch (err) {
      console.log("Failed to save data!");
    }
  }

  static async fetchAll() {
    try {
      const db = getDb();
      const data = await db.collection("products").find().toArray();
      return data;
    } catch (err) {
      console.log("Failed to fetch data!");
    }
  }

  static async getProduct(id) {
    try {
      const db = getDb();
      // const data = await db
      //   .collection("products")
      //   .find({ _id: new ObjectId(id) })
      //   .toArray();
      // return data[0];
      const data = await db
        .collection("products")
        .find({ _id: new ObjectId(id) })
        .next();
      return data;
    } catch (err) {
      console.log("Failed to fetch data!");
    }
  }

  static async updateProduct(id, updatedProduct) {
    try {
      const db = getDb();
      await db
        .collection("products")
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedProduct });
    } catch (err) {
      console.log("Failed to save data!", err);
    }
  }

  static async deleteProduct(id) {
    try {
      const db = getDb();
      await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    } catch (err) {
      console.log("Failed to delete data!", err);
    }
  }
}

module.exports = Product;

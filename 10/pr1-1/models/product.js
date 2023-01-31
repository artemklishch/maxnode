const Cart = require("./cart");
const db = require("../util/database");

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  async save() {
    try {
      // const sql = `INSERT INTO products(title,description,price,imageUrl) VALUES('${this.title}','${this.description}','${this.price}','${this.imageUrl}')`;
      // await db.execute(sql);
      await db.execute(
        "INSERT INTO products(title,description,price,imageUrl) VALUES(?,?,?,?)",
        [this.title, this.description, this.price, this.imageUrl]
      );
    } catch (err) {
      console.log("Failed to save data!", err);
    }
  }

  static async deleteById(id) {
    try {
      const sql = `DELETE FROM todos WHERE id = ${id}`;
      await db.execute(sql);
    } catch (err) {
      console.log("Failed to save data!", err);
    }
  }

  static async fetchAll() {
    try {
      const data = await db.execute("SELECT * FROM products");
      return data[0];
    } catch (err) {
      console.log("Failed to fetch data: ", err);
    }
  }

  static async findById(id) {
    try {
      const data = await db.execute(`SELECT * FROM products WHERE id=${id}`);
      return data[0][0];
    } catch (err) {
      console.log("Failed to fetch data: ", err);
    }
  }
};

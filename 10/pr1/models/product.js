const db = require("../util/database");
const Cart = require("./cart");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, price, imageUrl, description) VALUES (?,?,?,?)",
      [this.title, this.price, this.imageUrl, this.description]
    );
    // INSERT INTO означает, что мы записываем данные в базу
    // products означает, что в таблицу под названием products
    // (title, price, imageUrl, description) означет поля, к-е мы хотим заполнить/добавить
    // VALUES (?,?,?,?) означает вставку значений, к-е добавляются в таблицу, должны быть совпадения в названиях
    // возвращается промис
  }

  static deleteById(id) {}

  static fetchAll() {
    return db.execute("SELECT*FROM products");
    // SELECT*FROM означает, что мы бере данные из таблицы products
    // знак * значит, что мы берем все данные
    // можно уточнять, например db.execute("SELECT id, title FROM products")
    // возвращается промис
  }

  static findById(id) {
    return db.execute("SELECT*FROM products WHERE products.id = ?", [id]);
    // WHERE products.id = ? - означает, что мы во всех products ищем только тот,
    // который соответствует полю таблицы id, к-й передан во второй аргумент
    // возвращается промис
  }
};

const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }
  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection("products")
        // .updateMany({});
        .updateOne({ _id: this._id }, { $set: this }); // обовляем существующие данные
      // для этого в аргументы конструктора в конец была добавлена переменная _id
      // .updateOne({ _id: this._id }, {$set: { title: this.title } }); - можно обновлять частично, если нужно
    } else {
      dbOp = db
        // db.collection("products").insertMany([]); // это если мы добавдяем в базу несколько создаваемых данных
        .collection("products")
        .insertOne(this);
    }
    return dbOp.then((result) => result).catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    // return db.collection("products").find({title: 'A book'})
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => products)
      .catch((err) => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    return (
      db
        .collection("products")
        .find({ _id: new mongodb.ObjectID(prodId) })
        // .find({ _id: mongodb.ObjectID(prodId) }) // здесь происходит преобразования свойства prodId
        // т.к. соответствующее свойство в базе данных существует в виде особого типа данных
        .next()
        .then((product) => product)
        .catch((err) => console.log(err))
    );
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then((product) => product)
      .catch((err) => console.log(err));
  }
}

module.exports = Product;

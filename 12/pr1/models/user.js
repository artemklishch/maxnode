const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;
const ObjectId = mongodb.ObjectId;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this).then().catch();
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      (cp) => cp.productId.toString() === product._id.toString()
    );
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = { items: updatedCartItems };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    // db.collection("products")
    //   .find()
    //   .toArray()
    //   .then((products) => {
    //     return this.cart.items.map((item) => {
    //       const cartProduct = products.find(
    //         (product) => product._id.toString() === item.productId.toString()
    //       );
    //       cartProduct.quantity = item.quantity;
    //       return cartProduct;
    //     });
    //   })
    //   .catch((err) => console.log(err));
    const productIds = this.cart.items.map((i) => i.productId);
    return db
      .collection("products")
      .find({ _id: { $in: productIds } }) // это ищет все продукты по совпадению с идентифкаторами
      .toArray()
      .then((products) => {
        return products.map((p, index) => {
          // return { ...p, quantity: this.cart.items[index].quantity };
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
  }

  deleteCartById(prodId) {
    const updatedCartItems = this.cart.items.filter(
      (i) => i.productId.toString() !== prodId
    );
    const updatedCart = { items: updatedCartItems };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = [];
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      })
      .catch((err) => console.log(err));
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new ObjectId(this._id) })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    // return db
    //   .collection("users")
    //   .find({ _id: new mongodb.ObjectId(userId) })
    //   .next();

    // .next() здесь указывается,
    //чтоб прекратился поиск после того, как найдено совпадение
    return db.collection("users").findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  items: {
    type: [
      {
        _id: Schema.Types.ObjectId,
        title: String,
        price: String,
        description: String,
        imageUrl: String,
        userId: Schema.Types.ObjectId,
        quantity: Number,
      },
    ],
  },
  user: {
    _id: Schema.Types.ObjectId,
    name: String,
  },
});

module.exports = mongoose.model("Order", orderSchema);

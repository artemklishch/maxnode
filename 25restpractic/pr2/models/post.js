const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true } // этот объект делает так, что монгуз добавляет
  // времменые свойства о моменте создания, обнолвления данных
);

module.exports = mongoose.model("Post", postSchema);

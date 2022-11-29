const mongoose = require("mongoose");

const { Schema } = mongoose;

const bookModel = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    publisher: { type: String, required: true },
    price: { type: Number, required: true },
    cover: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Books", bookModel);

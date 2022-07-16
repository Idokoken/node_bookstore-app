const mongoose = require("mongoose");

const { Schema } = mongoose;

const bookModel = new Schema({
  title: String,
  description: String,
  category: String,
  author: String,
  publisher: String,
  price: Number,
  cover: String,
});

module.exports = mongoose.model("Book", bookModel);

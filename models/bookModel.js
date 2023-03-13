const mongoose = require("mongoose");

const { Schema } = mongoose;

const bookModel = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    publisher: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    cover: { type: String },
    images: { type: String },
    countInStock: { type: String },
    rating: { type: Number, default: 0 },
    numOfReviews: { type: Number },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Books", bookModel);

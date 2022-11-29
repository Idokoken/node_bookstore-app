const mongoose = require("mongoose");

const { Schema } = mongoose;

var categoryModel = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categoryModel);

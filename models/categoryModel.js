const mongoose = require("mongoose");

const { Schema } = mongoose;

var categoryModel = new Schema({
  name: String,
});

module.exports = mongoose.model("Category", categoryModel);

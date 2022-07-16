const mongoose = require("mongoose");

const { Schema } = mongoose;

const IndexModel = new Schema({
  name: "index",
});

module.exports = mongoose.model("Index", IndexModel);

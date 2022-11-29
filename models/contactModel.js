const mongoose = require("mongoose");

const { Schema } = mongoose;
const contactModel = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactModel);

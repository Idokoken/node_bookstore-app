const mongoose = require("mongoose");

const { Schema } = mongoose;

const userModel = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    street: { type: String, default: "" },
    apartment: { type: String, default: "" },
    city: { type: String, default: "" },
    zip: { type: String, default: "" },
    country: { type: String, default: "" },
    phone: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userModel);

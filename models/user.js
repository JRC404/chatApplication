const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: false },
    password: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
  },
  {
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("users", User);

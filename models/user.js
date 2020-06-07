const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    birthday: {type: Date, required: true, unique: false}
  },
  {
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("users", User);

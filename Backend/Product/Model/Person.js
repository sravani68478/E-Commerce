//here

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const perschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
});
perschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});
module.exports = mongoose.model("Person", perschema);

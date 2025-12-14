//here

const mongoose = require("mongoose");
const productschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  discription: {
    type: String,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("Product", productschema);

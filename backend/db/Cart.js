const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: String,
  company: String,
  quantity: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model("cart", cartSchema);

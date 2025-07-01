const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  name: String,
  price: String,
  category: String,
  company: String,
  quantity: { type: Number, default: 1 } 
});
module.exports = mongoose.model("cart", cartSchema);

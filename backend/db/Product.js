const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number, 
    required: true
  },
  category: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: '' 
  },
  inStock: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 4.5
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);

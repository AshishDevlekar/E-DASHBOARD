const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    default: 'Unnamed'
  },
  price: Number,
  quantity: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['in progress', 'success', 'failed'],
    default: 'in progress'
  },
  statusUpdatedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model("Purchase", purchaseSchema);

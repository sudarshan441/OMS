const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }],
  paymentCollected: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'FULFILLED', 'CANCELLED'],
    default: 'PENDING'
  }
}, { timestamps: true });

orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);

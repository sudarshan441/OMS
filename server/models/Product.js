const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number
}, { timestamps: true });

productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);

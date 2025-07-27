const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: false }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);

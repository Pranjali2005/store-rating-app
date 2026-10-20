const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    address: { type: String, required: true, trim: true, maxlength: 400 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    image: { type: String, default: '' }, // compressed image stored as a data URL
  },
  { timestamps: true }
);

module.exports = mongoose.model('Store', storeSchema);
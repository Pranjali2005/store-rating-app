const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 20, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    address: { type: String, required: true, trim: true, maxlength: 400 },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['USER', 'STORE_OWNER'], default: 'USER' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: { validator: Number.isInteger, message: 'Rating must be a whole number' },
    },
  },
  { timestamps: true }
);

// One rating per user per store
ratingSchema.index({ user: 1, store: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
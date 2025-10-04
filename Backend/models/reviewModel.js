const mongoose = require('mongoose');
const { reviewConn } = require('../db');

const reviewSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    reviewText: { type: String, default: '' },
  },
  { timestamps: true }
);

// Optional index to prevent duplicate reviews per user per book
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: false });

module.exports = reviewConn.model('Review', reviewSchema);


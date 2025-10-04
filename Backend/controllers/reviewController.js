const Review = require('../models/reviewModel');
const Book = require('../models/bookModel');

// Create review
exports.createReview = async (req, res) => {
  try {
    const { bookId, rating, reviewText } = req.body;
    if (!bookId || !rating) return res.status(400).json({ message: 'bookId and rating are required' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const review = await Review.create({ bookId, userId: req.user.id, rating, reviewText });
    return res.status(201).json(review);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create review', error: err.message });
  }
};

// Update own review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const { rating, reviewText } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (reviewText !== undefined) review.reviewText = reviewText;
    await review.save();
    return res.json(review);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update review', error: err.message });
  }
};

// Delete own review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    await review.deleteOne();
    return res.json({ message: 'Review deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
};

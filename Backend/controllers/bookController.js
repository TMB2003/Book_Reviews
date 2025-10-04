const Book = require('../models/bookModel');
const Review = require('../models/reviewModel');
const User = require('../models/userModel');

// Add book (creator becomes owner)
exports.createBook = async (req, res) => {
  try {
    const { title, author, description, genre, year } = req.body;
    if (!title || !author || !genre || !year) {
      return res.status(400).json({ message: 'title, author, genre, year are required' });
    }
    const book = await Book.create({ title, author, description, genre, year, addedBy: req.user.id });
    return res.status(201).json(book);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create book', error: err.message });
  }
};

// List books with pagination (5 per page)
exports.listBooks = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = 5;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select('-__v'),
      Book.countDocuments(),
    ]);

    return res.json({ page, pageSize: items.length, total, totalPages: Math.ceil(total / limit), items });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list books', error: err.message });
  }
};

// Book details with reviews and average rating (manual cross-db population)
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Fetch owner from User DB
    const owner = await User.findById(book.addedBy).select('name email');

    // Fetch reviews from Review DB and attach user info manually
    const rawReviews = await Review.find({ bookId: book._id }).sort({ createdAt: -1 });
    const userIds = [...new Set(rawReviews.map(r => String(r.userId)))];
    const users = await User.find({ _id: { $in: userIds } }).select('name email');
    const userMap = users.reduce((acc, u) => { acc[String(u._id)] = u; return acc; }, {});

    const reviews = rawReviews.map(r => ({
      _id: r._id,
      bookId: r.bookId,
      userId: r.userId,
      rating: r.rating,
      reviewText: r.reviewText,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      user: userMap[String(r.userId)] ? { id: userMap[String(r.userId)]._id, name: userMap[String(r.userId)].name, email: userMap[String(r.userId)].email } : null,
    }));

    const avg = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    return res.json({
      book: {
        _id: book._id,
        title: book.title,
        author: book.author,
        description: book.description,
        genre: book.genre,
        year: book.year,
        addedBy: book.addedBy,
        owner: owner ? { id: owner._id, name: owner.name, email: owner.email } : null,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      },
      reviews,
      averageRating: Number(avg.toFixed(2)),
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch book', error: err.message });
  }
};

// Update book (only owner)
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.addedBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const updatable = ['title', 'author', 'description', 'genre', 'year'];
    updatable.forEach((f) => {
      if (req.body[f] !== undefined) book[f] = req.body[f];
    });
    await book.save();
    return res.json(book);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update book', error: err.message });
  }
};

// Delete book (only owner) and cascade delete reviews
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.addedBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await Review.deleteMany({ bookId: book._id });
    await book.deleteOne();
    return res.json({ message: 'Book deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete book', error: err.message });
  }
};

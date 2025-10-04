const express = require('express');
const auth = require('../middleware/auth');
const { createBook, listBooks, getBook, updateBook, deleteBook } = require('../controllers/bookController');

const router = express.Router();

// Public
router.get('/', listBooks);
router.get('/:id', getBook);

// Protected
router.post('/', auth, createBook);
router.patch('/:id', auth, updateBook);
router.delete('/:id', auth, deleteBook);

module.exports = router;


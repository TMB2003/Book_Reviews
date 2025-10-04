const express = require('express');
const auth = require('../middleware/auth');
const { createReview, updateReview, deleteReview } = require('../controllers/reviewController');

const router = express.Router();

// Protected review actions
router.post('/', auth, createReview);
router.patch('/:id', auth, updateReview);
router.delete('/:id', auth, deleteReview);

module.exports = router;


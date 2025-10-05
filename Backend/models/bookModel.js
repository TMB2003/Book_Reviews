const mongoose = require('mongoose');
const { dbConn } = require('../db');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    genre: { type: [String], required: true, trim: true },
    year: { type: Number, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = dbConn.model('Book', bookSchema);


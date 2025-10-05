const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/userRoute');
const bookRoutes = require('./routes/bookRoute');
const reviewRoutes = require('./routes/reviewRoute');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS: allow frontend dev origins and REST clients
app.use(cors());

// Home route (for quick check)
app.get('/', (req, res) => {
  console.log('Home route hit at', new Date().toISOString());
  res.send('Backend is running');
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;

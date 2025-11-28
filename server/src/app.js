const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bugRoutes = require('./routes/bugRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (only in development)
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, { 
      body: req.body, 
      query: req.query, 
      params: req.params 
    });
    next();
  });
}

// Routes
app.use('/api/bugs', bugRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Bug Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection - only connect if not in test mode
const connectDB = async () => {
  try {
    // If we're in test mode and there's already a connection, use it
    if (process.env.NODE_ENV === 'test' && mongoose.connection.readyState !== 0) {
      return;
    }

    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/bugtracker', 
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    if (process.env.NODE_ENV !== 'test') {
      console.log(`MongoDB Connected: ${conn.connection.host} - ${conn.connection.name}`);
    }
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  };

  startServer();
}

module.exports = app;
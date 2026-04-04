const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const projectRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blogs');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Backend Server`);
      console.log(`   Running at: http://localhost:${PORT}`);
      console.log(`   API: http://localhost:${PORT}/api`);
      console.log(`   Health: http://localhost:${PORT}/api/health\n`);
    });
  }).catch((err) => {
    // Still start server even if DB connection fails
    app.listen(PORT, () => {
      console.log(`\n🚀 Backend Server`);
      console.log(`   Running at: http://localhost:${PORT}`);
      console.log(`   API: http://localhost:${PORT}/api`);
      console.log(`   Health: http://localhost:${PORT}/api/health`);
      console.log(`   ⚠ Using mock data (MongoDB not connected)\n`);
    });
  });
}

module.exports = app;

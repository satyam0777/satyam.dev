const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/satyam-portfolio';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    return true;
  } catch (error) {
    console.warn('⚠ MongoDB connection failed:', error.message);
    console.warn('  Running in demo mode with in-memory data');
    return false;
  }
};

module.exports = connectDB;

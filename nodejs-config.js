// config/index.js - Configuration Settings
require('dotenv').config();

module.exports = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  database: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/cricanalyzer',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'cricanalyzer-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  adminEmail: process.env.ADMIN_EMAIL || 'admin@cricanalyzer.com'
};

// config/database.js - Database Connection
const mongoose = require('mongoose');
const config = require('./index');

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.database.url, config.database.options);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = { connectToDatabase };

// routes/index.js
const express = require('express');
const router = express.Router();

// Import route files
const newsRoutes = require('./news');
const matchRoutes = require('./matches');
const playerRoutes = require('./players');
const teamRoutes = require('./teams');
const tournamentRoutes = require('./tournaments');
const venueRoutes = require('./venues');
const userRoutes = require('./users');
const authRoutes = require('./auth');
const searchRoutes = require('./search');

// Mount routes
router.use('/news', newsRoutes);
router.use('/matches', matchRoutes);
router.use('/players', playerRoutes);
router.use('/teams', teamRoutes);
router.use('/tournaments', tournamentRoutes);
router.use('/venues', venueRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/search', searchRoutes);

module.exports = router;
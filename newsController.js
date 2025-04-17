// controllers/newsController.js
const News = require('../models/News');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all news
// @route   GET /api/news
// @access  Public
exports.getAllNews = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  
  // Finding resource
  let query = News.find(JSON.parse(queryStr))
    .populate('author', 'name profileImage')
    .populate('teams', 'name shortName logo')
    .populate('players', 'name slug profileImage')
    .populate('matches', 'title matchDate status')
    .populate('tournaments', 'name logo')
    .populate('tags', 'name');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-publishedAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await News.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const news = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: news.length,
    pagination,
    data: news
  });
});

// @desc    Get featured news
// @route   GET /api/news/featured
// @access  Public
exports.getFeaturedNews = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  
  const news = await News.find({ featured: true, publishedAt: { $lte: new Date() } })
    .sort('-publishedAt')
    .limit(limit)
    .populate('author', 'name profileImage')
    .populate('teams', 'name shortName logo')
    .populate('players', 'name slug profileImage');

  res.status(200).json({
    success: true,
    count: news.length,
    data: news
  });
});

// @desc    Get latest news
// @route   GET /api/news/latest
// @access  Public
exports.getLatestNews = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 12;
  
  const news = await News.find({ featured: false, publishedAt: { $lte: new Date() } })
    .sort('-publishedAt')
    .limit(limit)
    .populate('author', 'name profileImage');

  res.status(200).json({
    success: true,
    count: news.length,
    data: news
  });
});

// @desc    Get news by ID
// @route   GET /api/news/:id
// @access  Public
exports.getNewsById = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id)
    .populate('author', 'name profileImage bio')
    .populate('teams', 'name shortName logo slug')
    .populate('players', 'name slug profileImage')
    .populate('matches', 'title matchDate status team1 team2')
    .populate('tournaments', 'name logo slug')
    .populate('tags', 'name slug');

  if (!news) {
    return next(new ErrorResponse(`News not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: news
  });
});

// @desc    Get news by slug
// @route   GET /api/news/slug/:slug
// @access  Public
exports.getNewsBySlug = asyncHandler(async (req, res, next) => {
  const news = await News.findOne({ slug: req.params.slug })
    .populate('author', 'name profileImage bio')
    .populate('teams', 'name shortName logo slug')
    .populate('players', 'name slug profileImage')
    .populate('matches', 'title matchDate status team1 team2')
    .populate({
      path: 'matches',
      populate: [
        { path: 'team1', select: 'name shortName logo' },
        { path: 'team2', select: 'name shortName logo' }
      ]
    })
    .populate('tournaments', 'name logo slug')
    .populate('tags', 'name slug');

  if (!news) {
    return next(new ErrorResponse(`News not found with slug of ${req.params.slug}`, 404));
  }

  res.status(200).json({
    success: true,
    data: news
  });
});

// More controller methods...
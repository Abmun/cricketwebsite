// routes/news.js
const express = require('express');
const router = express.Router();
const { 
  getAllNews, 
  getNewsById, 
  getNewsBySlug,
  createNews, 
  updateNews, 
  deleteNews,
  getFeaturedNews,
  getLatestNews,
  getNewsByCategory,
  getRelatedNews
} = require('../controllers/newsController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getAllNews)
  .post(protect, authorize('editor', 'admin'), createNews);

router.route('/featured').get(getFeaturedNews);
router.route('/latest').get(getLatestNews);
router.route('/category/:category').get(getNewsByCategory);

router.route('/:id')
  .get(getNewsById)
  .put(protect, authorize('editor', 'admin'), updateNews)
  .delete(protect, authorize('admin'), deleteNews);

router.route('/slug/:slug').get(getNewsBySlug);
router.route('/:id/related').get(getRelatedNews);

module.exports = router;
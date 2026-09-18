const express = require('express');
const router = express.Router();
const {
  getArticles,
  createArticle,
  updateArticle,
} = require('../controllers/articleController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Obtenir la liste des articles
router.get('/', getArticles);

// Ajouter un article (Admin uniquement)
router.post('/', protect, authorize('admin'), createArticle);

// Modifier un article (Admin uniquement)
router.put('/:id', protect, authorize('admin'), updateArticle);

module.exports = router;
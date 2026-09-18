const asyncHandler = require('express-async-handler');
const Article = require('../models/Article');

/**
 * @desc    Obtenir la liste de tous les articles du catalogue
 * @route   GET /api/articles
 * @access  Public
 */
const getArticles = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  let query = { isActive: true };

  if (category && category !== 'Tous') {
    query.category = category;
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const articles = await Article.find(query).sort({ category: 1, name: 1 });

  res.json({
    success: true,
    count: articles.length,
    data: articles,
  });
});

/**
 * @desc    Créer un nouvel article (Admin uniquement)
 * @route   POST /api/articles
 * @access  Private/Admin
 */
const createArticle = asyncHandler(async (req, res) => {
  const { code, name, category, icon, prices } = req.body;

  const articleExists = await Article.findOne({ code });
  if (articleExists) {
    res.status(400);
    throw new Error('Un article existe déjà avec ce code.');
  }

  const article = await Article.create({
    code,
    name,
    category,
    icon,
    prices,
  });

  res.status(201).json({
    success: true,
    data: article,
  });
});

/**
 * @desc    Mettre à jour un article (Admin uniquement)
 * @route   PUT /api/articles/:id
 * @access  Private/Admin
 */
const updateArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    res.status(404);
    throw new Error('Article non trouvé.');
  }

  const updatedArticle = await Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: updatedArticle,
  });
});

module.exports = {
  getArticles,
  createArticle,
  updateArticle,
};
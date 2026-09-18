const express = require('express');
const router = express.Router();
const {
  getPackages,
  createPackage,
} = require('../controllers/packageController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Obtenir tous les packs d'abonnement
router.get('/', getPackages);

// Créer ou mettre à jour un pack (Admin uniquement)
router.post('/', protect, authorize('admin'), createPackage);

module.exports = router;
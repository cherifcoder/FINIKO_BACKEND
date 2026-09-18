const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAllAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Obtenir les notifications de l'utilisateur
router.get('/', protect, getNotifications);

// Marquer toutes les notifications comme lues
router.put('/read-all', protect, markAllAsRead);

module.exports = router;
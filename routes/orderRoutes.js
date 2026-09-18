const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Créer une commande (Client connecté)
router.post('/', protect, createOrder);

// Obtenir l'historique des commandes de l'utilisateur connecté
router.get('/my-orders', protect, getMyOrders);

// Obtenir les détails d'une commande spécifique
router.get('/:id', protect, getOrderById);

// Mettre à jour le statut d'une commande (Livreur / Admin)
router.put('/:id/status', protect, authorize('livreur', 'admin'), updateOrderStatus);

module.exports = router;
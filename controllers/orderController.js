const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Article = require('../models/Article');
const Notification = require('../models/Notification');

/**
 * Génère un numéro de commande unique (ex: #FK-902)
 */
const generateOrderNumber = () => {
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `#FK-${randomNum}`;
};

/**
 * @desc    Créer une nouvelle commande (5 étapes)
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    pickupAddress,
    pickupCoordinates,
    pickupTimeSlot,
    deliveryAddress,
    sameAsPickupAddress,
    preferences,
    paymentMethod,
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('Votre panier de linge est vide.');
  }

  if (!pickupAddress || !pickupTimeSlot || !deliveryAddress || !paymentMethod) {
    res.status(400);
    throw new Error('Veuillez fournir toutes les informations nécessaires à la commande.');
  }

  let calculatedTotalPrice = 0;
  let calculatedTotalArticles = 0;
  const processedItems = [];

  // Traitement sécurisé du panier et vérification des prix côté serveur
  for (const item of items) {
    const dbArticle = await Article.findById(item.articleId);
    if (!dbArticle) {
      res.status(404);
      throw new Error(`Article non trouvé : ${item.articleId}`);
    }

    const unitPrice = dbArticle.prices[item.treatment];
    if (unitPrice === undefined) {
      res.status(400);
      throw new Error(`Traitement invalide [${item.treatment}] pour l'article ${dbArticle.name}`);
    }

    const subtotal = unitPrice * item.quantity;
    calculatedTotalPrice += subtotal;
    calculatedTotalArticles += item.quantity;

    processedItems.push({
      article: dbArticle._id,
      articleName: dbArticle.name,
      treatment: item.treatment,
      quantity: item.quantity,
      unitPrice,
      subtotal,
    });
  }

  const orderNumber = generateOrderNumber();

  // Date estimée de livraison par défaut : Lendemain 18h
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 1);
  estimatedDelivery.setHours(18, 0, 0, 0);

  const order = await Order.create({
    orderNumber,
    user: req.user._id,
    items: processedItems,
    totalArticles: calculatedTotalArticles,
    totalPrice: calculatedTotalPrice,
    pickupAddress,
    pickupCoordinates: pickupCoordinates || {},
    pickupTimeSlot,
    deliveryAddress: sameAsPickupAddress ? pickupAddress : deliveryAddress,
    sameAsPickupAddress: !!sameAsPickupAddress,
    preferences: preferences || {},
    paymentMethod,
    estimatedDeliveryDate: estimatedDelivery,
  });

  // Création d'une notification initiale
  await Notification.create({
    user: req.user._id,
    order: order._id,
    title: 'Commande enregistrée !',
    message: `Votre commande ${orderNumber} de ${calculatedTotalArticles} article(s) a bien été validée.`,
    type: 'success',
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

/**
 * @desc    Obtenir les commandes de l'utilisateur connecté
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/**
 * @desc    Obtenir le détail d'une commande par ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('deliveryDriver', 'name phone');

  if (!order) {
    res.status(404);
    throw new Error('Commande non trouvée.');
  }

  // Seul le propriétaire, un livreur ou un admin peut voir la commande
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role === 'client'
  ) {
    res.status(403);
    throw new Error('Accès non autorisé à cette commande.');
  }

  res.json({
    success: true,
    data: order,
  });
});

/**
 * @desc    Mettre à jour le statut d'une commande (Admin / Livreur)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Driver/Admin
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Commande non trouvée.');
  }

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  const updatedOrder = await order.save();

  // Notification automatique pour le client selon le statut
  let alertTitle = 'Mise à jour de votre commande';
  let alertMessage = `Le statut de votre commande ${order.orderNumber} est maintenant : ${order.status}.`;

  if (status === 'ramassage_effectue') {
    alertTitle = 'Ramassage effectué !';
    alertMessage = `Notre livreur a récupéré votre linge pour la commande ${order.orderNumber}.`;
  } else if (status === 'traitement_en_cours') {
    alertTitle = 'Nettoyage en cours';
    alertMessage = `Vos vêtements sont actuellement en cours de lavage/repassage.`;
  } else if (status === 'livraison_programmee') {
    alertTitle = 'Livreur en route !';
    alertMessage = `Votre linge propre est en cours de livraison.`;
  }

  await Notification.create({
    user: order.user,
    order: order._id,
    title: alertTitle,
    message: alertMessage,
    type: status === 'livraison_programmee' ? 'alert' : 'info',
  });

  res.json({
    success: true,
    data: updatedOrder,
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
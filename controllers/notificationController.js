const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

/**
 * @desc    Obtenir les notifications de l'utilisateur connecté
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  const unreadCount = await Notification.countDocuments({
    user: req.user._id,
    isRead: false,
  });

  res.json({
    success: true,
    count: notifications.length,
    unreadCount,
    data: notifications,
  });
});

/**
 * @desc    Marquer toutes les notifications comme lues
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  res.json({
    success: true,
    message: 'Toutes les notifications ont été marquées comme lues.',
  });
});

module.exports = {
  getNotifications,
  markAllAsRead,
};
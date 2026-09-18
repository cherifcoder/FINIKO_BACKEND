const asyncHandler = require('express-async-handler');
const Package = require('../models/Package');

/**
 * @desc    Obtenir la liste des packs et abonnements
 * @route   GET /api/packages
 * @access  Public
 */
const getPackages = asyncHandler(async (req, res) => {
  const packages = await Package.find({ isActive: true }).sort({ price: 1 });

  res.json({
    success: true,
    count: packages.length,
    data: packages,
  });
});

/**
 * @desc    Créer ou mettre à jour un pack (Admin)
 * @route   POST /api/packages
 * @access  Private/Admin
 */
const createPackage = asyncHandler(async (req, res) => {
  const { packageId, title, price, period, itemLimit, deliveryDelay, features, color, textColor, icon } = req.body;

  let pkg = await Package.findOne({ packageId });

  if (pkg) {
    pkg = await Package.findOneAndUpdate({ packageId }, req.body, { new: true });
  } else {
    pkg = await Package.create({
      packageId,
      title,
      price,
      period,
      itemLimit,
      deliveryDelay,
      features,
      color,
      textColor,
      icon,
    });
  }

  res.status(201).json({
    success: true,
    data: pkg,
  });
});

module.exports = {
  getPackages,
  createPackage,
};
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    packageId: {
      type: String,
      required: true,
      unique: true,
      enum: ['normal', 'express', 'vip'],
    },
    title: {
      type: String,
      required: [true, 'Le titre du pack est obligatoire.'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Le prix mensuel est obligatoire.'],
    },
    period: {
      type: String,
      default: '/ mois',
    },
    itemLimit: {
      type: Number,
      default: 0, // 0 = illimité pour VIP
    },
    deliveryDelay: {
      type: String,
      required: true,
    },
    features: [
      {
        type: String,
        required: true,
      },
    ],
    color: {
      type: String,
      default: 'bg-blue-600',
    },
    textColor: {
      type: String,
      default: 'text-blue-600',
    },
    icon: {
      type: String,
      default: 'package',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Package', packageSchema);
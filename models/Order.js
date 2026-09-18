const mongoose = require('mongoose');

// Sous-schéma pour un article du panier
const orderItemSchema = new mongoose.Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  articleName: {
    type: String,
    required: true,
  },
  treatment: {
    type: String,
    enum: ['lavage', 'lavage_repassage', 'repassage'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true, // ex: #FK-902
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    
    totalArticles: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    
    // Étape 2 : Ramassage
    pickupAddress: {
      type: String,
      required: [true, 'L\'adresse de ramassage est obligatoire.'],
    },
    pickupCoordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    pickupTimeSlot: {
      type: String,
      required: [true, 'Le créneau de ramassage est obligatoire.'],
    },

    // Étape 3 : Livraison
    deliveryAddress: {
      type: String,
      required: [true, 'L\'adresse de livraison est obligatoire.'],
    },
    sameAsPickupAddress: {
      type: Boolean,
      default: false,
    },

    // Étape 4 : Préférences
    preferences: {
      perfume: {
        type: String,
        default: 'neutre',
      },
      notes: {
        type: String,
        default: '',
      },
    },

    // Étape 5 : Paiement & Statuts
    paymentMethod: {
      type: String,
      enum: ['cash', 'wave', 'mobile_money'],
      required: [true, 'Le mode de paiement est obligatoire.'],
    },
    paymentStatus: {
      type: String,
      enum: ['en_attente', 'paye', 'echoue'],
      default: 'en_attente',
    },
    status: {
      type: String,
      enum: [
        'validee',
        'ramassage_effectue',
        'traitement_en_cours',
        'livraison_programmee',
        'terminee',
        'annulee',
      ],
      default: 'validee',
    },
    deliveryDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    estimatedDeliveryDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
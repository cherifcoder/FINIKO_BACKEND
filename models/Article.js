const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Le nom du vêtement est obligatoire.'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'La catégorie est obligatoire.'],
      enum: ['Homme', 'Femme', 'Enfant', 'Blanchiment'],
    },
    icon: {
      type: String,
      default: 'tshirt-crew-outline',
    },
    // Grille tarifaire conforme aux 3 prestations du pressing FINIKO
    prices: {
      lavage: {
        type: Number,
        required: true,
        default: 0,
      },
      lavage_repassage: {
        type: Number,
        required: true,
        default: 0,
      },
      repassage: {
        type: Number,
        required: true,
        default: 0,
      },
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

module.exports = mongoose.model('Article', articleSchema);
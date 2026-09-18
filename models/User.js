const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom complet est obligatoire.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'L\'adresse email ou téléphone est obligatoire.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Le numéro de téléphone est obligatoire.'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire.'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères.'],
    },
    role: {
      type: String,
      enum: ['client', 'livreur', 'admin'],
      default: 'client',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: 'Nouakchott' },
      details: { type: String, default: '' },
      coordinates: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null },
      },
    },
    activePackage: {
      packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', default: null },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
      remainingItems: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Hachage du mot de passe avant la sauvegarde si modifié
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode de comparaison du mot de passe pour la connexion
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
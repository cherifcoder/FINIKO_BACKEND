const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Article = require('../models/Article');
const Package = require('../models/Package');
const User = require('../models/User');

dotenv.config();

const packagesData = [
  {
    packageId: 'normal',
    title: 'Pack Normal',
    price: 15000,
    period: '/ mois',
    itemLimit: 15,
    deliveryDelay: '48h-72h',
    features: [
      "Jusqu'à 15 vêtements",
      'Lavage + Repassage inclus',
      'Livraison sous 48h-72h',
    ],
    color: 'bg-blue-600',
    textColor: 'text-blue-600',
    icon: 'package',
  },
  {
    packageId: 'express',
    title: 'Pack Express',
    price: 25000,
    period: '/ mois',
    itemLimit: 20,
    deliveryDelay: '24h',
    features: [
      "Jusqu'à 20 vêtements",
      'Traitement prioritaire',
      'Livraison Express en 24h',
    ],
    color: 'bg-amber-500',
    textColor: 'text-amber-500',
    icon: 'zap',
  },
  {
    packageId: 'vip',
    title: 'Pack VIP',
    price: 45000,
    period: '/ mois',
    itemLimit: 0, // Illimité
    deliveryDelay: 'Sur mesure',
    features: [
      'Vêtements illimités *',
      'Bazin, Robes & Costumes inclus',
      'Lavage délicat & Repassage main',
    ],
    color: 'bg-purple-600',
    textColor: 'text-purple-600',
    icon: 'crown',
  },
];

const articlesData = [
  // --- HOMME ---
  { code: 'h1', name: 'Bazin 1 Pièce', category: 'Homme', icon: 'tshirt-crew-outline', prices: { lavage: 900, lavage_repassage: 1800, repassage: 900 } },
  { code: 'h2', name: 'Bazin 2 Pièces', category: 'Homme', icon: 'tshirt-crew-outline', prices: { lavage: 1500, lavage_repassage: 3000, repassage: 1500 } },
  { code: 'h3', name: 'Bazin 3 Pièces', category: 'Homme', icon: 'tshirt-crew-outline', prices: { lavage: 1800, lavage_repassage: 3600, repassage: 1800 } },
  { code: 'h4', name: 'Boubou 1 Pièce', category: 'Homme', icon: 'tshirt-crew-outline', prices: { lavage: 900, lavage_repassage: 1800, repassage: 900 } },
  { code: 'h5', name: 'Boubou 2 Pièces', category: 'Homme', icon: 'tshirt-crew-outline', prices: { lavage: 1200, lavage_repassage: 2400, repassage: 1200 } },
  { code: 'h6', name: 'Boubou 3 Pièces', category: 'Homme', icon: 'tshirt-crew-outline', prices: { lavage: 1500, lavage_repassage: 3000, repassage: 1500 } },
  { code: 'h7', name: 'Chemise pliée', category: 'Homme', icon: 'tie', prices: { lavage: 600, lavage_repassage: 1200, repassage: 600 } },
  { code: 'h8', name: 'Chemise S/cintre', category: 'Homme', icon: 'tie', prices: { lavage: 480, lavage_repassage: 960, repassage: 480 } },
  { code: 'h9', name: 'Pantalon Pli Droit', category: 'Homme', icon: 'trousers', prices: { lavage: 600, lavage_repassage: 1200, repassage: 600 } },
  { code: 'h10', name: 'Pantalon pli côté', category: 'Homme', icon: 'trousers', prices: { lavage: 600, lavage_repassage: 1200, repassage: 600 } },
  { code: 'h11', name: 'Demi-Pantalon', category: 'Homme', icon: 'trousers', prices: { lavage: 450, lavage_repassage: 900, repassage: 450 } },
  { code: 'h12', name: 'Costume 2 Pièces', category: 'Homme', icon: 'black-mesa', prices: { lavage: 1500, lavage_repassage: 3000, repassage: 1500 } },
  { code: 'h13', name: 'Costume 3 Pièces', category: 'Homme', icon: 'black-mesa', prices: { lavage: 1800, lavage_repassage: 3600, repassage: 1800 } },
  { code: 'h14', name: 'Veste', category: 'Homme', icon: 'black-mesa', prices: { lavage: 900, lavage_repassage: 1800, repassage: 900 } },
  { code: 'h15', name: 'Cravate', category: 'Homme', icon: 'tie', prices: { lavage: 150, lavage_repassage: 300, repassage: 150 } },
  { code: 'h16', name: 'Tee-Shirt', category: 'Homme', icon: 'tshirt-crew-outline', prices: { lavage: 420, lavage_repassage: 900, repassage: 480 } },
  { code: 'h17', name: 'Survêtement 2 Pièces', category: 'Homme', icon: 'tshirt-crew-outline', prices: { lavage: 1200, lavage_repassage: 2400, repassage: 1200 } },
  { code: 'h18', name: 'Pyjama 2 Pièces', category: 'Homme', icon: 'tshirt-crew-outline', prices: { lavage: 600, lavage_repassage: 1200, repassage: 600 } },
  { code: 'h19', name: 'Pull', category: 'Homme', icon: 'tshirt-crew-outline', prices: { lavage: 600, lavage_repassage: 1200, repassage: 600 } },
  { code: 'h20', name: 'Slip / Caleçon / Culotte', category: 'Homme', icon: 'tshirt-crew-outline', prices: { lavage: 300, lavage_repassage: 600, repassage: 300 } },

  // --- FEMME ---
  { code: 'f1', name: 'Bazin Femme 1 Pièce', category: 'Femme', icon: 'dress-outline', prices: { lavage: 900, lavage_repassage: 1800, repassage: 900 } },
  { code: 'f2', name: 'Bazin Femme 2 Pièces', category: 'Femme', icon: 'dress-outline', prices: { lavage: 1500, lavage_repassage: 3000, repassage: 1500 } },
  { code: 'f3', name: 'Bazin Femme 3 Pièces', category: 'Femme', icon: 'dress-outline', prices: { lavage: 1800, lavage_repassage: 3600, repassage: 1800 } },
  { code: 'f4', name: 'Boubou 1 Pièce Femme', category: 'Femme', icon: 'dress-outline', prices: { lavage: 1200, lavage_repassage: 2400, repassage: 1200 } },
  { code: 'f5', name: 'Boubou 2 Pièces Femme', category: 'Femme', icon: 'dress-outline', prices: { lavage: 1500, lavage_repassage: 3000, repassage: 1500 } },
  { code: 'f6', name: 'Boubou 3 Pièces Femme', category: 'Femme', icon: 'dress-outline', prices: { lavage: 2100, lavage_repassage: 4200, repassage: 2100 } },
  { code: 'f7', name: 'Ensemble Pagne 1 Pièce', category: 'Femme', icon: 'dress-outline', prices: { lavage: 900, lavage_repassage: 1800, repassage: 900 } },
  { code: 'f8', name: 'Ensemble Pagne 2 Pièces', category: 'Femme', icon: 'dress-outline', prices: { lavage: 1200, lavage_repassage: 2400, repassage: 1200 } },
  { code: 'f9', name: 'Ensemble Pagne 3 Pièces', category: 'Femme', icon: 'dress-outline', prices: { lavage: 1500, lavage_repassage: 3000, repassage: 1500 } },
  { code: 'f10', name: 'Chemisier Plié', category: 'Femme', icon: 'dress-outline', prices: { lavage: 600, lavage_repassage: 1200, repassage: 600 } },
  { code: 'f11', name: 'Chemisier S/Cintre', category: 'Femme', icon: 'dress-outline', prices: { lavage: 560, lavage_repassage: 960, repassage: 400 } },
  { code: 'f12', name: 'Body / Tshirt Femme', category: 'Femme', icon: 'dress-outline', prices: { lavage: 480, lavage_repassage: 960, repassage: 480 } },
  { code: 'f13', name: 'Jupe simple', category: 'Femme', icon: 'dress-outline', prices: { lavage: 900, lavage_repassage: 1800, repassage: 900 } },
  { code: 'f14', name: 'Jupe 2 Pièces', category: 'Femme', icon: 'dress-outline', prices: { lavage: 1200, lavage_repassage: 2400, repassage: 1200 } },
  { code: 'f15', name: 'Robe Mariée 1 Pièce', category: 'Femme', icon: 'dress-outline', prices: { lavage: 3000, lavage_repassage: 6000, repassage: 3000 } },
  { code: 'f16', name: 'Robe Mariée 2 Pièces', category: 'Femme', icon: 'dress-outline', prices: { lavage: 3000, lavage_repassage: 6000, repassage: 3000 } },
  { code: 'f17', name: 'Robe Mariée 3 Pièces', category: 'Femme', icon: 'dress-outline', prices: { lavage: 3000, lavage_repassage: 6000, repassage: 3000 } },
  { code: 'f18', name: 'Robe Mariée Gonflant', category: 'Femme', icon: 'dress-outline', prices: { lavage: 5000, lavage_repassage: 10000, repassage: 5000 } },
  { code: 'f19', name: 'Robe Mariée Gonflant 2 Pièces', category: 'Femme', icon: 'dress-outline', prices: { lavage: 5000, lavage_repassage: 10000, repassage: 5000 } },
  { code: 'f20', name: 'Robe Mariée Gonflant 3 Pièces', category: 'Femme', icon: 'dress-outline', prices: { lavage: 5000, lavage_repassage: 10000, repassage: 5000 } },
  { code: 'f21', name: 'Robe Soirée / Simple', category: 'Femme', icon: 'dress-outline', prices: { lavage: 1200, lavage_repassage: 2400, repassage: 1200 } },
  { code: 'f22', name: 'Foulard', category: 'Femme', icon: 'dress-outline', prices: { lavage: 300, lavage_repassage: 600, repassage: 300 } },
  { code: 'f23', name: 'Echarpe', category: 'Femme', icon: 'dress-outline', prices: { lavage: 600, lavage_repassage: 1200, repassage: 600 } },

  // --- ENFANT ---
  { code: 'e1', name: 'Boubou 1 Pièce Enfant', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 450, lavage_repassage: 900, repassage: 450 } },
  { code: 'e2', name: 'Boubou 2 Pièces Enfant', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 600, lavage_repassage: 1200, repassage: 600 } },
  { code: 'e3', name: 'Boubou 3 Pièces Enfant', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 900, lavage_repassage: 1800, repassage: 900 } },
  { code: 'e4', name: 'Costume 2 Pièces Enfant', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 600, lavage_repassage: 1200, repassage: 600 } },
  { code: 'e5', name: 'Costume 3 Pièces Enfant', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 900, lavage_repassage: 1800, repassage: 900 } },
  { code: 'e6', name: 'Body / Tee-Shirt Enfant', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 1650, lavage_repassage: 1800, repassage: 150 } },
  { code: 'e7', name: 'Pantalon Enfant', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 150, lavage_repassage: 300, repassage: 150 } },
  { code: 'e8', name: 'Veste Enfant', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 300, lavage_repassage: 900, repassage: 600 } },
  { code: 'e9', name: 'Jupe 2 Pièces Enfant', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 750, lavage_repassage: 1200, repassage: 450 } },
  { code: 'e10', name: 'Jupe Simple Enfant', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 600, lavage_repassage: 900, repassage: 300 } },
  { code: 'e11', name: 'Pull Enfant', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 300, lavage_repassage: 600, repassage: 300 } },
  { code: 'e12', name: 'Chemise Enfant', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 240, lavage_repassage: 480, repassage: 240 } },
  { code: 'e13', name: 'Slip / Caleçon Enfant', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 150, lavage_repassage: 300, repassage: 150 } },
  { code: 'e14', name: 'Robe Mariée Enfant', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 1500, lavage_repassage: 3000, repassage: 1500 } },
  { code: 'e15', name: 'Chaussures Enfant', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 450, lavage_repassage: 900, repassage: 450 } },
  { code: 'e16', name: 'Poupée Grand Format', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 2400, lavage_repassage: 4800, repassage: 2400 } },
  { code: 'e17', name: 'Poupée Moyen Format', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 900, lavage_repassage: 1800, repassage: 900 } },
  { code: 'e18', name: 'Poupée Petit Format', category: 'Enfant', icon: 'baby-carriage', prices: { lavage: 600, lavage_repassage: 1200, repassage: 600 } },

  // --- BLANCHIMENT / AMEUBLEMENT ---
  { code: 'b1', name: 'Couverture', category: 'Blanchiment', icon: 'floor-plan', prices: { lavage: 900, lavage_repassage: 1800, repassage: 900 } },
  { code: 'b2', name: 'Couvre-lit Grand Format', category: 'Blanchiment', icon: 'floor-plan', prices: { lavage: 2400, lavage_repassage: 4800, repassage: 2400 } },
  { code: 'b3', name: 'Couvre-lit Moyen Format', category: 'Blanchiment', icon: 'floor-plan', prices: { lavage: 1800, lavage_repassage: 3600, repassage: 1800 } },
  { code: 'b4', name: 'Couvre-lit Petit Format', category: 'Blanchiment', icon: 'floor-plan', prices: { lavage: 1200, lavage_repassage: 2400, repassage: 1200 } },
  { code: 'b5', name: 'Drap 2 Places + 2 Taies', category: 'Blanchiment', icon: 'floor-plan', prices: { lavage: 900, lavage_repassage: 1800, repassage: 900 } },
  { code: 'b6', name: 'Drap Ordinaire', category: 'Blanchiment', icon: 'floor-plan', prices: { lavage: 600, lavage_repassage: 1200, repassage: 600 } },
  { code: 'b7', name: 'Oreiller', category: 'Blanchiment', icon: 'floor-plan', prices: { lavage: 1200, lavage_repassage: 2400, repassage: 1200 } },
  { code: 'b8', name: 'Double Rideau', category: 'Blanchiment', icon: 'warehouse', prices: { lavage: 1800, lavage_repassage: 3600, repassage: 1800 } },
  { code: 'b9', name: 'Rideau grand format', category: 'Blanchiment', icon: 'warehouse', prices: { lavage: 1200, lavage_repassage: 2400, repassage: 1200 } },
  { code: 'b10', name: 'Rideau petit format', category: 'Blanchiment', icon: 'warehouse', prices: { lavage: 900, lavage_repassage: 1800, repassage: 900 } },
  { code: 'b11', name: 'Serviette Grand format', category: 'Blanchiment', icon: 'floor-plan', prices: { lavage: 1200, lavage_repassage: 2400, repassage: 1200 } },
  { code: 'b12', name: 'Serviette Moyen format', category: 'Blanchiment', icon: 'floor-plan', prices: { lavage: 900, lavage_repassage: 1800, repassage: 900 } },
  { code: 'b13', name: 'Serviette Petit Format', category: 'Blanchiment', icon: 'floor-plan', prices: { lavage: 300, lavage_repassage: 600, repassage: 300 } },
  { code: 'b14', name: 'Tapis Grand format', category: 'Blanchiment', icon: 'floor-plan', prices: { lavage: 9000, lavage_repassage: 18000, repassage: 9000 } },
  { code: 'b15', name: 'Tapis Moyen format', category: 'Blanchiment', icon: 'floor-plan', prices: { lavage: 4500, lavage_repassage: 9000, repassage: 4500 } },
  { code: 'b16', name: 'Voilage', category: 'Blanchiment', icon: 'warehouse', prices: { lavage: 900, lavage_repassage: 1800, repassage: 900 } },
  { code: 'b17', name: 'Taie d\'oreiller', category: 'Blanchiment', icon: 'floor-plan', prices: { lavage: 120, lavage_repassage: 240, repassage: 120 } },
  { code: 'b18', name: 'Housse (Canapé - Voiture)', category: 'Blanchiment', icon: 'floor-plan', prices: { lavage: 5400, lavage_repassage: 10800, repassage: 5400 } },
  { code: 'b19', name: 'Chaussure', category: 'Blanchiment', icon: 'floor-plan', prices: { lavage: 2400, lavage_repassage: 2400, repassage: 0 } },
];

/**
 * Inscription automatique des données de test et du catalogue
 */
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('[Seed] Nettoyage de la base de données...');
    await Article.deleteMany();
    await Package.deleteMany();
    await User.deleteMany({ role: 'admin' });

    console.log('[Seed] Insertion des packs d\'abonnement...');
    await Package.insertMany(packagesData);

    console.log('[Seed] Insertion de tous les articles du catalogue FINIKO...');
    await Article.insertMany(articlesData);

    console.log('[Seed] Création d\'un compte administrateur par défaut...');
    await User.create({
      name: 'Admin FINIKO',
      email: 'admin@finiko.com',
      phone: '+22200000000',
      password: 'adminpassword123',
      role: 'admin',
    });

    console.log('✅ Base de données initialisée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Erreur lors de l'initialisation : ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
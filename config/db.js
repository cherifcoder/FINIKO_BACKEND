const mongoose = require('mongoose');

/**
 * Connexion asynchrone à la base de données MongoDB via Mongoose
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[MongoDB] Connecté avec succès : ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error] Erreur de connexion : ${error.message}`);
    process.exit(1); // Arrêt de l'application en cas d'échec de connexion
  }
};

module.exports = connectDB;
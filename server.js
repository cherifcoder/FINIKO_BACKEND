const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Chargement des variables d'environnement
dotenv.config();

// Connexion à la base de données MongoDB
connectDB();

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Route d'accueil pour la vérification d'état (Healthcheck)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API FINIKO Backend en ligne 🚀',
    version: '1.0.0',
    documentation: '/api/docs',
  });
});

// Déclaration des routes de l'API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/articles', require('./routes/articleRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Middlewares de gestion d'erreurs
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `[FINIKO Server] Serveur démarré en mode ${process.env.NODE_ENV || 'development'} sur le port ${PORT}`
  );
});
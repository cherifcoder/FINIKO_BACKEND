const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * Middleware de protection des routes nécessitant une authentification JWT
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extraction du token d'en-tête "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Vérification et décodage du token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupération de l'utilisateur associé sans son mot de passe
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Utilisateur non trouvé avec ce jeton d\'accès.');
      }

      next();
    } catch (error) {
      console.error(`[Auth Middleware Error] ${error.message}`);
      res.status(401);
      throw new Error('Accès non autorisé, le jeton est invalide ou expiré.');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Accès non autorisé, aucun jeton fourni.');
  }
});

/**
 * Middleware de restriction d'accès selon les rôles (ex: client, livreur, admin)
 * @param  {...string} roles - Liste des rôles autorisés
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Le rôle [${req.user ? req.user.role : 'anonyme'}] n'est pas autorisé à accéder à cette ressource.`
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
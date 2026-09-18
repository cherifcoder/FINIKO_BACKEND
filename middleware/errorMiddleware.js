/**
 * Middleware pour capturer les routes inexistantes (404 Not Found)
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée - [${req.method}] ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware centralisé pour la gestion globale des erreurs d'Express
 */
const errorHandler = (err, req, res, next) => {
  // Conserver un code de statut 500 si la requête renvoie 200 par erreur
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Gestion des IDs Mongoose invalides (ex: CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Ressource introuvable (ID invalide).';
  }

  // Gestion des erreurs de duplication de clé Mongoose (ex: email/téléphone déjà existant)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Une entrée existe déjà avec la même valeur pour le champ : ${field}.`;
  }

  // Gestion des erreurs de validation Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
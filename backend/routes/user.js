// Création du routeur Express
const express = require('express');

// On crée un routeur avec la méthode d'EXPRESS
const router = express.Router();

// On associe les fonctions aux différentes routes, on importe le controller
const userCtrl = require('../controllers/user');

// Routes inscription et connexion fournies par le frontend
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Exportation du routeur vers app.js
module.exports = router;
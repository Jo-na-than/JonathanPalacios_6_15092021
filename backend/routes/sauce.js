// Création du routeur Express
const express = require('express');

// Appel du routeur Express
const router = express.Router();

//importation du controlleur
const sauceCtrl = require('../controllers/sauce');

// Importation du middleware AUTH pour sécuriser les routes
const auth = require('../middleware/auth');

// Importation du middleware MULTER pour la gestion des images
const multer = require('../middleware/multer-config');

// Creation des routes de l'API et de leurs middlewares et controllers
// Route qui d'afficher toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauces);

// Route qui permet de selectionner une sauce 
router.get('/:id', auth, sauceCtrl.getOneSauce);

// Route pour creer une sauce ainsi que l'imageUrl de la sauce
router.post('/', auth, multer, sauceCtrl.createSauce);

// Route qui permet de modifier une sauce ainsi que l'imageUrl de la sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// Route qui permet de supprimer une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Route qui permet de gerer les likes des sauces
router.post('/:id/like', auth, sauceCtrl.likeOrDislike); 
 
// Exportation du ROUTER vers app.js
module.exports = router;
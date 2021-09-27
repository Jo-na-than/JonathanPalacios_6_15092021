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

// Routes
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeOrDislike); 
 

module.exports = router;
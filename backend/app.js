// Importation d'EXPRESS Famework de NODE.JS
const express = require('express');

// Fonction effectuant la demande POST de l'app frontend
const bodyParser = require('body-parser');

// Import de MONGOOSE pour connexion à la base de donnée MONGODB
const mongoose = require('mongoose');

// Import de la route dédiée aux sauces
const saucesRoutes = require('./routes/sauce');

// Import route dédiée aux users
const userRoutes = require('./routes/user');

// Donne accès au chemin de notre système de fichier "images"
const path = require('path');

// Connexion à la base de donnée avec Mongoose
mongoose.connect('mongodb+srv://Jonathan:03Juin2018@cluster0.vxk3v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Application Express
const app = express();

// Middleware HEADER évite les erreurs de sécurité CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permet d'accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Ajoute les headers mentionnés aux requêtes envoyées vers notre API 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Permet les méthodes autorisées pour les requêtes HTTP
    next();
});

// Transforme les données POST en objet JSON
app.use(bodyParser.json());

// Midleware qui permet de charger les fichiers qui sont dans le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Va servir les routes dédiées aux sauces
app.use('/api/sauces', saucesRoutes);

// Va servir les routes dédiées pour l'authentification des utilisateurs
app.use('/api/auth', userRoutes);

// Exporte EXPRESS dans server.js
module.exports = app;
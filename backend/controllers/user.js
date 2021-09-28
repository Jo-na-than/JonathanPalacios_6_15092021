// Utilisation de BCRYPT pour hasher le mot de passe des utilisateurs
const bcrypt = require('bcrypt')

// Récupération de notre model/user.js, créer avec le schéma Mongoose
const user = requires('../models/user');

// Utilisation du JSONWEBTOKEN pour attribuer un token au moment de la connexion
const jwt = require('jsonwebtoken');

// Création de nouveaux utilisateurs (Post signup)
exports.signup = (req, res, next) => {
    // Hash du mot de passe avec bcrypt
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        // Création du nouvel utilisateur
        const user = new User({
            email: req.body.email,
            password: hash
        });
        // Sauvegarde de l'utilisateur dans la BD
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Création de la connexion d'utilisateur enregistré (Post login)
exports.login = (req, res, next) => {
    // Recherche d'un utilisateur dans la BD
     User.findOne({ email: req.body.email })
     .then(user => {
         // Si on ne trouve pas l'utilisateur
         if(!user) {
             return res.status(401).json({ error: 'Utilisateur non trouvé !'})
         }
         // On compare le mot de passe de la requete avec celui de la base de données
         bcrypt.compare(req.body.password, user.password)
         .then(valid => {
             if(!valid) {
                 return res.status(401).json({ error: 'Mot de passe incorrect !'})
             }
             res.status(200).json({
                 userId: user._id,
                 // Création d'un token pour sécuriser le compte de l'utilisateur
                 token: jwt.sign(
                     { userId: user._id },
                     'RANDOM_TOKEN_SECRET',
                     { expiresIn: '24h' }
                 )
             });
         })
         .catch(error => res.status(500).json({ error }));
     })
     .catch(error => res.status(500).json({ error }));
 };
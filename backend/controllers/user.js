// On utilise BCRYPT pour hasher le mot de passe des utilisateurs
const bcrypt = require('bcrypt')

// On recupere notre models/User.js, créer avec le schéma MONGOOSE
const User = require('../models/user');

// On utilise jsonwebtoken pour attribuer un token au moment de la connexion
const jwt = require('jsonwebtoken');


// Création de nouveaux utilisateurs dans la BD (Post signup)
exports.signup = (req, res, next) => {
    // Hash du mot de passe avec bcrypt et 10 tours pour creer mot de passe securise
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        // Création du nouvel utilisateur avec mot de passe crypté (HASH)
        const user = new User({
            email: req.body.email,
            password: hash
        });
        // Sauvegarde de l'utilisateur USER.SAVE dans la BD
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
        // Si on ne trouve pas l'utilisateur on renvoi une erreur
        if(!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'})
        }
        // On compare le mot de passe de la requete avec le HASH enregistrer dans le user grace a BCRYPT
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
            // Si la comparaison n'est pas bonne cela envoie une erreur
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
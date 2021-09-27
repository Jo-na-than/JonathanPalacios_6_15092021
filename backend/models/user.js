// Importation de MONGOOSE
const mongoose = require('mongoose');

// Permet de valider un seul email
const uniqueValidator = require('mongoose-unique-validator');

// Création du model User pour un stockage dans la base de données
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
});

// uniqueValidator = évite que plusieurs utilisateurs s'inscrivent avec le même mail
userSchema.plugin(uniqueValidator);

// On exporte ce schéma sous forme de modele: le modele s'appellera USER et on lui passe le shéma de données
module.exports = mongoose.model('User', userSchema);
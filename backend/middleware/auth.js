// On recupere le package qui permet la verification des TOKEN "jsonwebtoken"
const jwt = require('jsonwebtoken');

// Validation userId en comparaison avec le token
module.exports = (req, res, next) => {
    try {
        // Recuperation du TOKEN dans le header de la requete  autorisation
        const token = req.headers.authorization.split(' ')[1];
        // Décode le TOKEN qui utilise le package JWT et la fonction VERIFY pour controler que les cles correspondent
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // On vérifie que le userId envoyé avec la requête correspond au userId encodé dans le token
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            // Si le token ne correspond pas au userId : erreur
            throw 'User ID non valable !';
        } else {
            // Si tout est valide on passe au prochain middleware
            next();
        }
        // Probleme d'autentification si erreur dans les inscrutions
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
    }
};
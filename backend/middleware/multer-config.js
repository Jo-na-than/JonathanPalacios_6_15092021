// Importation de MULTER qui permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require('multer');

// Dictionnaires des types MIME et des extension des fichiers
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// On crée un objet de configuration pour préciser à MULTER ou enregistrer les fichiers images et les renommer
const storage = multer.diskStorage({
    // On mets la destination d'enregistrement des images
    destination: (req, file, callback) => {
        // On appelle le callback, on passe null pour dire qu'il n'y a pas d'erreur
        callback(null, 'images')
    },
    // On dit à MULTER quel nom de fichier a utiliser pour éviter les doublons
    filename: (req, file, callback) => {
        // Ceation du nouveau nom du fichier : nom d'origine + numero unique + . + extension, on supprime les espaces (white space avec split) et on insere des underscores à la place
        const name = file.originalname.split('.')[0].split(' ').join('_');
        // Creation de l'extension du fichier (voir dictionnaire)
        const extension = MIME_TYPES[file.mimetype];
        // On crée le filename, on ajoute un timestamp, un point et l'extension du fichier
        callback(null, name + '_' + Date.now() + '.' + extension);
    }
});

// Exportation du middleware MULTER, on lui passe l'objet storage, la méthode single pour dire que c'est un fichier unique et on précise que c'est une image
module.exports = multer({ storage }).single('image');
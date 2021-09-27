// Importation de multer qui permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require('multer');

// Dictionnaires des extension des fichiers
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    // Enregistrement dans le dossier "images"
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // Génération du nom du fichier : nom d'origine + numero unique + . + extension
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Exportation du middleware multer
module.exports = multer({ storage }).single('image');
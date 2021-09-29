// Récupération du "models/Sauce.js"
const Sauce = require('../models/Sauce');

// Récupération du module 'file system' de Node permettant de gérer les téléchargements,la modifications d'images et la suppression de tout le fichier
const fs = require('fs');

// Lecture de toutes les sauces de la BD
exports.getAllSauces = (req, res, next) => {
  // On utilise la méthode find pour obtenir la liste complète des sauces trouvées dans la base
    Sauce.find()
      // Si OK on retourne un tableau de toutes les données
      .then(sauces => res.status(200).json(sauces))
      // Si erreur on retourne un message d'erreur
      .catch(error => res.status(400).json({ error }));
};

// Lecture d'une sauce avec son ID (Get/:id)
exports.getOneSauce = (req, res, next) => {
   // On utilise la méthode findOne et on lui passe l'objet de comparaison
    Sauce.findOne({ _id: req.params.id })
      // Si ok on retourne une réponse et l'objet
      .then(sauce => res.status(200).json(sauce))
       // Si erreur on génère une erreur 404 pour dire qu'on ne trouve pas l'objet
      .catch(error => res.status(404).json({ error }));
};

// Création d'une nouvelle sauce (Post)
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    // Création d'un nouvel objet Sauce
    const sauce = new Sauce({
      ...sauceObject,
    // Création de l'URL de l'image: http://localhost:3000/image/nomdufichier 
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // Enregistrement de l'objet sauce dans la base de données
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
};

// Modification d'une sauce et suppression image (Update)
exports.modifySauce = (req, res, next) => {
  if(req.file){
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      // On supprime l'ancienne image du serveur
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () =>{
        const sauceObject = {
          // On modifie les données et on ajoute la nouvelle image
           ...JSON.parse(req.body.sauce),  
           imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
      })
    })
    .catch(error => res.status(500).json({ error }));

  }else{
    const sauceObject = { ...req.body };
    // On applique les paramètre de sauceObject
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
  }
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then(sauce => {
        // Pour extraire ce fichier, on recupere l'url de la sauce, et on le split autour de la chaine de caractères, donc le nom du fichier
        const filename = sauce.imageUrl.split('/images/')[1];
        // On efface le fichier (unlink)
        fs.unlink(`images/${filename}`, () => {
          // On supprime le document correspondant de la base de donnees
          Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};

// Création like ou dislike (Post/:id/like)
exports.likeOrDislike = (req, res, next) => {
    // Si l'utilisateur aime la sauce
    if (req.body.like === 1) { 
      // On ajoute 1 like et on l'envoie dans le tableau "usersLiked"
      Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
        .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
        .catch(error => res.status(400).json({ error }));
    } else if (req.body.like === -1) { 
      // Si l'utilisateur n'aime pas la sauce
      // On ajoute 1 dislike et on l'envoie dans le tableau "usersDisliked"
      Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } }) 
        .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
        .catch(error => res.status(400).json({ error }));
    } else { 
      // Si like === 0 l'utilisateur supprime son vote
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          // Si le tableau "userLiked" contient l'ID de l'utilisateur
          if (sauce.usersLiked.includes(req.body.userId)) { 
            // On enlève un like du tableau "userLiked" 
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                .catch(error => res.status(400).json({ error }))
          } else if (sauce.usersDisliked.includes(req.body.userId)) {
              // Si le tableau "userDisliked" contient l'ID de l'utilisateur
              // On enlève un dislike du tableau "userDisliked" 
              Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                .catch(error => res.status(400).json({ error }))
          }
        })
        .catch(error => res.status(400).json({ error }));
    }
};
const Sauce = require('../models/Sauce')
const fs = require('fs')

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        likes : 0,
        dislikes : 0,
        imageUrl : `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauces) => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }))
}

exports.modifySauce = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié ! ' }))
        .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/image/')[1];
        fs.unlink(`image/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

exports.likeSauce = (req, res, next) =>{
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id

    if( like === 1){
        Sauce.findOne({ usersLiked : userId, _id : sauceId})
        .then( sauce =>{
            if(!sauce){
                Sauce.updateOne({ _id : sauceId}, { $push :{ usersLiked : userId}, $inc : {likes : +1 }})
                .then(() => res.status(200).json({ message : 'Sauce aimée'}))
                .catch((error) => res.status(400).json({erro}))
            }
        })
        .catch((error) => res.status(400).json({erro}))
    }

    if(like === -1){
        Sauce.findOne({ usersLiked : userId, _id : sauceId})
        .then( sauce =>{
            
            if(!sauce){
                Sauce.updateOne({_id : sauceId}, {$push : { usersDisliked : userId}, $inc : {dislikes : +1}})
                .then(()=> res.status(200).json({message:'Sauce non aimée'}))
                .catch((error)=> res.status(400).json({error}))
            }
        })
    }

   if(like === 0){
       Sauce.findOne({ _id : sauceId})
       .then(sauce => {

           if(sauce.usersLiked.includes(userId)){
               Sauce.updateOne({_id : sauceId}, {$pull : { usersLiked : userId}, $inc : { likes : -1}})
               .then(()=> res.status(200).json({message : ' like annulée'}))
               .catch((error) => res.status(400).json({error}))
           }

           if(sauce.usersDisliked.includes(userId)){
              Sauce.updateOne({ _id : sauceId}, {$pull : { usersDisliked : userId }, $inc : { dislikes : -1 }})
              .then(()=> res.status(200).json({ message: 'dislike annulée'}))
              .catch((error)=> res.status(400).json({error}))
           }
       })
   }
    
}


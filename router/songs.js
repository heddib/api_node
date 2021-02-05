/**
 * Router 'songs' pour gérer toutes les routes qui commencent par /songs
 * 
 * @author Heddi Brahiti <heddi932@gmail.com>
 */
const router = require('express').Router()
const fs = require('fs');
const { body, validationResult } = require('express-validator');


// Fichier json qui nous sert de base de données
const songs = require('../data/songs.json')

// Méthode GET pour lister toutes les chansons
router.get('/', (req,res) => {
  res.status(200).json(songs)
})

// Méthode GET pour récupérer les informations d'une chanson
router.get('/:id', (req,res) => {
  const id = parseInt(req.params.id)
  const song = songs.find(song => song.id === id)
  res.status(200).json(song)
})

// Méthode POST pour ajouter une chanson
router.post('/',
  body('name').isString(),
  body('singer').isString(),
  body('album').isString(),
  body('type').isString(),
  (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let id, name, singer, album, type = "";

    name = req.body.name
    singer = req.body.singer
    album = req.body.album
    type = req.body.type
  
    // Incrémentation de l'id automatique en se basant sur le dernier id
    if(songs.length == 0) {
      id = 1
    } else {
      id = (songs[songs.length - 1].id + 1)
    }
      // On push un objet dans le tableau json songs
      songs.push({ id: id, name: name, singer: singer, album: album, type: type})
  
      // On réécrit le fichier songs.json avec la nouvelle donnée qui a été ajoutée
      fs.writeFile("./data/songs.json", JSON.stringify(songs), err => {
        // Si jamais il y a une erreur, on la log
        if (err) console.log("Erreur lors de l'écriture du fichier: ", err);
      });
  
    // Tout est ok, on retourne le tableau songs mis à jour
    res.status(200).json(songs)
})

// Méthode PUT pour mettre à jour une chanson
router.put('/:id', 
  body('name').isString(),
  body('singer').isString(),
  body('album').isString(),
  body('type').isString(),
  (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const id = parseInt(req.params.id)
    let song = songs.find(song => song.id === id)

    // Erreur si l'ID n'existe pas
    if(song == null) {
        res.status(400).json({ error: 'ID introuvable' })
        return;
    }

    // On met à jour les données de la chanson sélectionnée
    song.name = req.body.name,
    song.singer = req.body.singer,
    song.album = req.body.album,
    song.type = req.body.type

    // On réécrit le fichier songs.json avec la nouvelle donnée qui a été ajoutée
    fs.writeFile("./data/songs.json", JSON.stringify(songs), err => {
        // Si jamais il y a une erreur, on la log
        if (err) console.log("Erreur lors de l'écriture du fichier: ", err);
    });

    // Tout est ok, on retourne le tableau songs mis à jour
    res.status(200).json(song)
  }) 

  // Méthode DELETE pour supprimer une chanson
router.delete('/:id', (req,res) => {
  const id = parseInt(req.params.id)
  let song = songs.find(song => song.id === id)

  // Erreur si l'ID n'existe pas
  if(song == null) {
    res.status(400).json({ error: 'ID introuvable' })
    return;
  }
  // On utiliser la function splice pour supprimer le bon index
  songs.splice(songs.indexOf(song),1)

  // On réécrit le fichier songs.json avec la nouvelle donnée qui a été ajoutée
  fs.writeFile("./data/songs.json", JSON.stringify(songs), err => {
    // Si jamais il y a une erreur, on la log
    if (err) console.log("Erreur lors de l'écriture du fichier: ", err);
  });

  // Tout est ok, on retourne le tableau songs mis à jour
  res.status(200).json(songs)
})


module.exports = router
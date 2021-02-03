/**
 * Projet d'API en NodeJS réalisé par :
 * - Élise Knowles
 * - Heddi Brahiti
 * - Mathieu Gauchet
 */

// Déclaration des constantes à utiliser dans le code
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs');
// Fichier json qui nous sert de base de données
const songs = require('./songs.json')

// On utilise le middleware json et bodyParser
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

// Méthode GET pour lister toutes les chansons
app.get('/songs', (req,res) => {
    res.status(200).json(songs)
})

// Méthode GET pour récupérer les informations d'une chanson
app.get('/songs/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const song = songs.find(song => song.id === id)
    res.status(200).json(song)
})

// Méthode POST pour ajouter une chanson
app.post('/songs', (req,res) => {
    let id, name, singer, album, type = "";
    let errors = []
    // On vérifie que les champs sont correctes, sinon on montre une erreur
    if(req.body != null) {
        // Si le nom est vide on ajoute dans l'array
        if(req.body.name == null) {
            errors.push({ 'error': 'Champ \'name\' invalide.' })
        }
        // Si le chanteur est vide on ajoute dans l'array
        if(req.body.singer == null) {
            errors.push({ 'error': 'Champ \'singer\' invalide.' })
        }
        // Si l'album est vide on ajoute dans l'array
        if(req.body.album == null) {
            errors.push({ error: 'Champ \'album\' invalide.' })
        }
        // Si le type est vide on ajoute dans l'array
        if(req.body.type == null) {
            errors.push({ error: 'Champ \'type\' invalide.' })
        }
    } else {
        // Pas de body
        errors.push({ 'error': 'Champs invalides.' })
    }
    
    // Si le tableau des erreurs n'est pas vide, on montre les erreurs avec un code HTTP 400 et on return
    if(errors.length > 0) {
        res.status(400).json(errors)
        return;
    // Ici tout est censé être bon dans le else, donc on rempli les variables définies plus haut
    } else {
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
        fs.writeFile("./songs.json", JSON.stringify(songs), err => {
            // Si jamais il y a une erreur, on la log
            if (err) console.log("Erreur lors de l'écriture du fichier: ", err);
        });
    }

    // Tout est ok, on retourne le tableau songs mis à jour
    res.status(200).json(songs)
})

// Méthode PUT pour mettre à jour une chanson
app.put('/songs/:id', (req,res) => {
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
    fs.writeFile("./songs.json", JSON.stringify(songs), err => {
        // Si jamais il y a une erreur, on la log
        if (err) console.log("Erreur lors de l'écriture du fichier: ", err);
    });

    // Tout est ok, on retourne le tableau songs mis à jour
    res.status(200).json(song)
}) 

// Méthode DELETE pour supprimer une chanson
app.delete('/songs/:id', (req,res) => {
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
    fs.writeFile("./songs.json", JSON.stringify(songs), err => {
        // Si jamais il y a une erreur, on la log
        if (err) console.log("Erreur lors de l'écriture du fichier: ", err);
    });

    // Tout est ok, on retourne le tableau songs mis à jour
    res.status(200).json(songs)
})

// On démarre le serveur express sur le port 8080
app.listen(8080, () => {
    console.log("Serveur à l'écoute du port 8080 !")
})

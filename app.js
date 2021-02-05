/**
 * Projet d'API en NodeJS réalisé par :
 * - Heddi Brahiti
 * - Élise Knowles
 * - Mathieu Gauchet
 */

// Déclaration des constantes à utiliser dans le code
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const router = require('./router/router')

// On utilise le middleware json et bodyParser
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

// On utilise notre router principal
app.use('/', router);

// On démarre le serveur express sur le port 8080
app.listen(8080, () => {
    console.log("Serveur à l'écoute du port 8080 !")
})

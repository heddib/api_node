/**
 * Router principal
 * 
 * @author Heddi Brahiti <heddi932@gmail.com>
 */
const router = require('express').Router()
// Définition des différents routers
const songsRouter = require('./songs')

// On dit à notre router principal d'utiliser le router songs sur l'url de base /songs
router.use('/songs', songsRouter)

module.exports = router
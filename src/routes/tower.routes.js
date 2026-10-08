'use strict'

const express = require('express')
const towerController = require('../controllers/tower.controller')

const router = express.Router()

// router.get('/stats', towerController.towerStats)

router
    .route('/')
        .get(towerController.getAllTowers)
        .post(towerController.createTower)
        // later on we will be adding additional functions like POST to this route
        // this router is stating that any GET request on the /api/v1/ path will execute the controller function we built
router
    .route('/:id')
        .get(towerController.getTowerById)
        .put(towerController.updateTower)
        .patch(towerController.updateTower) 
        .delete(towerController.removeTower) // this will later be authorized delete
        
        
// here there will be more routes each with their own combination of GET, PUT, PATCH, DELETE

module.exports = router
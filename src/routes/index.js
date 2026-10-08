'use strict'

const express = require('express')
const towerRoutes = require('./tower.routes')

const router = express.Router()

router.use('/towers', towerRoutes)

module.exports = router
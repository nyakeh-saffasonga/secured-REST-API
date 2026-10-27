'use strict'

const express = require('express')
const towerRoutes = require('./tower.routes')
const authRoutes = require('./auth.routes')

const router = express.Router()
router.use('/auth', authRoutes)

router.use('/towers', towerRoutes)

module.exports = router
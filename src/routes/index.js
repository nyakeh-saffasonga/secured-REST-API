'use strict'

const express = require('express')

const towerRoutes = require('./tower.routes')
const authRoutes = require('./auth.routes')
const healthRoutes = require('./health.routes')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/health', healthRoutes)
router.use('/towers', towerRoutes)

module.exports = router
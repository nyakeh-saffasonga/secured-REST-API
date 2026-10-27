'use strict'

const express = require('express')
const healthController = require('../controller/health.controller')

const router = express.Router()

router.get('/', healthController.health)
// remember that we just use the backslash where the route will mount from app.js using the /health

module.exports = router
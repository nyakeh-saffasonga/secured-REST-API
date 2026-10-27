'use strict'

const express = require('express')
const authController = require('../controller/auth.controller')
const {requireAuth} = require('../middleware/auth')

const router = express.Router()

// public routes: you cannot be logged in yet when you are asking to log in
router.post('/register', authController.register)
router.post('/login', authController.login)

/** protected routes: requireAuth runs first and either sets req.user or ends with a 401
 * listing middleware before the handler is how a route says this step has to pass before
 * the handler is allowed to run
 */

router.get('/me', requireAuth, authController.me)

module.exports = router

const express = require('express')
const routes = require('./routes')
// const healthRoutes = require('./')
const requestLogger = require('./middleware/requestLogger')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')
const {API_PREFIX} = require('./config/constants')


/**
 * this will build the express application and start the base database connection and application
 * 
 * the order for the middleware packet proessing is:
 * logger -> bodyparser -> health -> API routes -> 404 -> Error Handler
 */

const app = express()
// REMEMBER THAT THE ORDER MATTERS

app.use(requestLogger)
app.use(express.json({limit: '10kb'}))
app.use(express.urlencoded({extended: true, limit: '10kb'}))

// routing for pathways 
// app.use('/health', healthRoutes)
app.use(API_PREFIX, routes)
app.get('/',(req,res)=>{
    res.status(200).json({success:true, status:"Healthy"})
})

app.use(notFound)
app.use(errorHandler)

module.exports = app
'use strict'

const {isTest} = require('../config/env')

/**
 * logs one line per completed request: method, path, status, and duration
 */

module.exports = function requestLogger(req, res, next){
    if(isTest) return next()
    // is this is a test return nothing and move on
    const start = process.hrtime.bigint()

    res.on('finish', ()=>{
        const ms = Number(process.hrtime.bigint() - start) / 1e6
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(2)}`)
    })
    next()
}
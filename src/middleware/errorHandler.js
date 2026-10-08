'use strict'

const { isProduction } = require('../config/env')

/***
 * Then this will become the global error handler. each error will have 4 parameters
 * Express ids error middleware by prority and then the 3 parameter function is treated as a regular middleware and never invoked with an error
 * 
 * make sure: eslint-disable-net-line no-unused-vars
 * 
 */

module.exports = function errorHandler(err, req, res, next) {

    let statusCode = err.statusCode || 500
    let message = err.message || "Internal Server Error"
    let details = err.details || null
    
    // This in case the ObjectJS is wrong in the path parameter - client error, not a server error
    if (err.name === 'CastError') {
        statusCode = 400
        message = `Invalid ${err.path}: ${err.value}`
    }

    // This is the case where the schema validation fails
    if (err.name === 'ValidationError') {
        statusCode = 400
        message = "Validation Failed"
        details = Object.values(err.errors).map((error) => ({
            field: error.path,
            message: error.message
        }))
    }

    // This is the case where the unique ID they're trying to use is NOT UNIQUE and reating an index violation. This shows up as a driver error and not a validation error because 'unique' is an index rather than a validator
    if (err.name === 11000) {
        statusCode = 409
        message = `Duplicate value for: ${Object.keys(err.keyValue || {}).join(', ')}`
    }

    // This is the case where the JSON structure is wrong
    if (err.type === 'entity.parse.failed') {
        statusCode = 400
        message = 'Malformed JSON in request body'
    }

    // This is in case the body is larger than the configured size limit
    if (err.type === 'entity.too.large') {
        statusCode = 413
        message = 'Request body too large'
    }

    // If the error code is 500 or above, it is the fault of the server
    if (statusCode >= 500) console.error('[error]', {message: err.message, stack: err.stack})

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(details && {details}),
            // the err.stack shows/traces/exposes the file paths and dependency versions:
            // this is for development only and once production is true they will no longer show protecting your code secrets
            ...(isProduction && statusCode >= 500 && {stack: err.stack})
        }
    })

}
'use strict'

const ApiError = require('../utils/ApiError')

/** 404 handler for unmatched routes
 * this will forward to the error handler we built rather than corresponding directly so that unknown routes return the same packet response as every other failure as if the record existed but no access, etc.
 */

module.exports = function notFound(req, res, next){
    next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

/** next function: remember that the next function is used in the middleware as a callback allowing the request-response cycle to continue. in middleware, if you do not have next and use it at the end of the middleware function the entire project will syall after a request because of this. BE SURE TO REMEMBER THIS 
 * next also allows us
*/
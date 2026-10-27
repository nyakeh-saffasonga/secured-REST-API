class ApiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message)
        this.statusCode = statusCode
        this.details = details
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }

    /** STAGE 2: fix all static shortcuts and create proper error functions
     * 
     * we will be making static requests that will expand the type if errors and response this middleware can be used for
     * 
     * these stack routes will be set as a basis for stage 3 as well. ApiError as it is with status codes alreadt filled in,
     * the controllers read the full sentences of the error and has no way to remember notfound means 404
     * 
     */

    static badRequest(message = 'Bad Request', details = null) {
        return new ApiError(400, message, details)
    }

    // 401 - we don't know who you are, log in and try again
    static unauthorized(message = 'Unauthorized', details = null) {
        return new ApiError(401, message, details)
    }

    // 403 - we know who you are, and you still may not do this
    static forbidden(message = 'Forbidden', details = null) {
        return new ApiError(403, message, details)
    }

    // 404 - not found
    static notFound(message = 'Not Found', details = null) {
        return new ApiError(404, message, details)
    }

    // 409 - the request is valid, but there are conflicts with the current state if the plant. for example, the plant being retired since the last watering
    static conflict(message = 'Conflict', details = null) {
        return new ApiError(409, message, details)
    }
}

module.exports = ApiError
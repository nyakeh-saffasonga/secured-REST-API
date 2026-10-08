'use strict'

/***
 * response envelope
 * 
 * every success response is `{success: true, data, ...meta}` and every error is `{success: false, error: {...}}` so that the clients will only need one parser for all the requests
 */
/** 
*@param {import('express').Response} res
*@param {*} data
*@param {number} [statusCode = 200]
*@param {object} [extra] // the extra is any other top level keys we want to add like {meta}
*/

function sendSuccess(res, data, statusCode = 200, extra = {}) {
    return res.status(statusCode).json({success: true, data, ...extra})
}

// whenever a record is created
function sendCreated(res, data) {
    return sendSuccess(res, data, 201)
}

// if there is an empty body
function sendNoContent(res) {
    return res.status(204).send()
}

module.exports = {sendSuccess, sendCreated, sendNoContent}

/** remember that this is to wrap the request in an "envelope" that we make and control allowing use to make and use one parser to deal with all types of requests instead of the defaults set by express */
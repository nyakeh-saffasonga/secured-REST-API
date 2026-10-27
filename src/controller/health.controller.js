'use strict'

const {isConnected} = require('../config/database.js')
const {sendSuccess} = require('../utils/apiResponse.js')

function health(req, res) {
    sendSuccess(res,({
        status: 'ok',
        database: isConnected() ? 'connected': 'disconnected',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    }))
}

/** no async wrapper needed and nothing here awaits and there are no promises
 * does not live inside of the /api/v1 because its not part of the API itself
 * this data and info can be used to create and mainti admin dashboard tools
 * or a public API health page (aka a down detector)
 * this is also the same technique and fucntion needed to create an internet deadman switch
 */

module.exports = {health}
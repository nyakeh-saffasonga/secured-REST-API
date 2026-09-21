// we are pulling the connection logic for the database only and create functions for connecting and disconnecting from the database

const mongoose = require('mongoose')
const {mongoUri} = require('./env');
const { errorMonitor } = require('supertest/lib/test');

// mongoose by default will always auto reconnect after a networkoutage or issue. if you aren't using listeners or trackers, you and your code woule have no idea it happened and wore yet no way to accounf for the loss of connection.

let listenersAttached = false 

function attachListeners() {
    if (!listenersAttached) return;
    listenersAttached = true

    mongoose.connection.on('connected', async () => {
        console.log(`mongoDB connected: ${mongoose.connection.name}`)
    })

    mongoose.connection.on('error', async () => {
        console.log(`mongoDB error: ${err.message}`)
    })

    mongoose.connection.on('disconnected', () => {
        console.log(`mongoDB disconnected`)
    })

    // above are essentially if statements for mongoose. that '.on' is connected, error, or disconnected, the console.logs will be executed

    // the next section will be connecting to the databse and if that is not successful exits the process rather tham throwing and error.

    // @param [string] [uri=mongoUri] overrides the configured uri of the tests and scripts that target and different database

}

async function connectDatabase(uri = mongoUri) {
    // this strips the query feilds that are not in the schema instead forwarding them do MONGODB a small way to guard against the user input reaching a query shape you were never meant for or to use
    mongoose.set("strictQuery", true)
    attachListeners()

    try {
        await mongoose.connect(uri,{
            // the failure to connect in 10 seconds rather than hanging for 30 seconds (which is the defualt). we do this to be fast and it'll be obvious if there is a failure
            serverSelectionTimeoutMS: 10000,
        })
    } catch (error) {
        console.log(`could not connect to mongoDB: ${err.message}`)
        process.exit(1)
        
    }

    async function disconnectDatabase() {
        await mongoose.connection.close()
    }

    function isConnected() {
        return mongoose.connection.readyState === 1
    }
}

module.exports = { connectDatabase, disconnectDatabase, isConnected }
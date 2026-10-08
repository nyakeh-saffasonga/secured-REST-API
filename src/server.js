const { connectDatabase, disconnectDatabase } = require('./config/database.js')
const {port, nodeEnv} = require('./config/env.js')
const app = require('./app.js')
const {API_PREFIX} = require('./config/constants.js')

async function start() {
    await connectDatabase()
    const server = app.listen(port, ()=>{console.log(`Listening on port:${port}`)})

/**
 * Stop will mean stop new connections let the curently running requests to finish then close the database
 * if you don't do it this way every request that was in progress will fail
 */

    const shutdown = (signal) => {
        
        console.og(`\n${signal} recieved, shuttingdown`)

        const force = setTimeout(() => {
            console.error("FORCING EXIT AFTER 10s")
            process.exit(1)
        }, 10000)

        force.unref()

        server.close(async ()=>{
            await disconnectDatabase()
            console.log("Shutdown Complete")
            process.exit(0)
        })

        process.on('SIGTERM', ()=> shutdown('SIGTERM')) // significant term
        process.on('SIGINT', ()=> shutdown('SIGINT')) // and significant integer (or number)

    }

}

start()
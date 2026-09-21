require('dotenv').config()

const REQUIRED = ['NODE_ENV', 'PORT', 'MONGODB_URI']
const missing = REQUIRED.filter((key)=> !process.env[key])
// built above is a set of rules made to check and report and require ENV variables if they're missing

if (missing.length > 0) {
    console.log(`Missing required envoirnment variale(s): ${missing.join(', ')}`)
    process.exit(1)
}

module.exports = {
    nodeEnv: process.env.NODE_ENV,
    port: Number(process.env.PORT),
    mongoUri: process.env.MONGODB_URI,
    isProduction: process.env.NODE_ENV === 'productions'
}

// exported variables can and should be used through the project and should serve as a centrl hub if any need to be changed or added
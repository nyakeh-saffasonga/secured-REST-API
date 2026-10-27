'use strict'

const ApiError = require('./ApiError')

/** everything JWT and token wil touch this file aka logins, logouts and authorizations
 * 
 * a JWT stands for javascript web token: it is an industry standard for securely sending info
 * 
 * -- WHY WE USE TOKENS INSTEAD OF SESSIONS -- 
 * 
 * JSON web tokens use 3 base64 chunks that with the secret, header(algorithms and type), make is a far more
 * secure option that just sessions which can be interrputed, connection, etc.
 * 
 * think back on how you interact with the google, gmail or facebook, ..etc these major sites also use tokens.
 * this allows the user to now have to deal with all these session reminders to stay active
 * 
 * @params {object} user
 * @returns {string} a signed token
 */

const jwt = require('jsonwebtoken')
const {jwtSecret, jwtExpiresIn} = require('../config/env')

function signToken(user) {
    /**
     * 'sub' or subject is the standard JWE claim from: who is this token about
     * we keep the payload tiny on purpose, the users row can change at any time so the ID
     * is the only thing worth carrying in. we will worry about roles later when we do permission checks
     */
    console.log("sign---"+user.id)
    const payload = {sub: String(user._id), role: user.role}
    return jwt.sign(payload, jwtSecret, {expiresIn: jwtExpiresIn})
}

/** verify token will given and handling back a token
 * the JWT libary throws its own error types, we use ApiError to translate so the rest of the 
 * app will still work. these make sure that a bad token will become a clean 401 and not 
 * 
 * @param {string} token
 * @param {{sub: string, role: string, iat: number, exp: number}}
 */

function verifyToken(token) {
    try {
        return jwt.verify(token, jwtSecret)
    } catch (err) {
        /** this error will cover forged signatures, signed with a different secret but right feilds. also a note
         * that when you are making erorr message for user input is that you must not make the response too detailed
         * otherwise attackers will be able to use your overly detailed error to make a forgery good enough to get
         * into the system
         */
        
        throw ApiError.unauthorized()
    }

}

module.exports = {signToken, verifyToken}



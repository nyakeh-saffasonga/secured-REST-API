'use strict'

const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const {verifyToken} = require('../utils/jwt')
const {AUTH} = require('../config/constants')
const User = require('../models/user.model')

/** this will require a user to already be logged in
 * 
 * this middleware will attach verification and require it for every request given
 * this will run before the controller functions on the protected routes, this is so that by
 * the time the handler runs the req.user is guaranteed to be a user and controller will never
 * have to worry aout ID checks themselves
 * 
 * the users will send an authorized Bearer token (AKA signed JWT)
 * this is wrapped in the asyncHandler because it needs to await the database response
 * with no wrapper immediate 500 error response give
 */


const requireAuth = asyncHandler(async(req, res, next)=>{
    // console.log('require auth hit' ,req.headers.authorization)
   
    const header = req.get('authorization')

    if(!header || !header.startsWith(AUTH.BEARER_PREFIX)){
        throw ApiError.unauthorized('Missing or malformed Authorization header')
    }

    const token = header.slice(AUTH.BEARER_PREFIX.length).trim()
    if (!token) throw ApiError.unauthorized('Missing or malformed Authorization header')
        // throws 401 ApiError on forged, expired or garbage token
    const payload = verifyToken(token)
    
    const user = await User.findById(payload.sub)
    if (!user) throw ApiError.unauthorized('This account no longer exists')
    /** the reason the user is leaded instead of trusting the payload is because a token stays valid until it expires,
     * so the account could have been deleted, or its roles changed since the token was issued. The lookup is the moment we 
     * check that this person still exists right now. it also means controller get a real document to work with not just an ID
     */ 
    console.log('test')
    
    req.user = user
    console.log(req.user)
    // console.log('decoded', decoded)
    
    next()

})

module.exports = {requireAuth}
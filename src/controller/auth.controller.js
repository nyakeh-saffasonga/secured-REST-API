'use strict'

/** STAGE 2: register logins and report who you are  */

const asyncHandler = require('../utils/asyncHandler')
const {sendSuccess, sendCreate} = require('../utils/apiResponse')
const ApiError = require('../utils/ApiError')
const {signToken} = require('../utils/jwt')
const User = require('../models/user.model')

//** Auth HTTP Handlers:
// This will be the same shape as the plant controller, it will read the request,
// then lean on the midel for tules and then answer through the shared response objects/envelope
// (basically not in the body of the response) */

const register = asyncHandler(async(req,res) =>{
    /** req.body leaves undefined hen ther is no readable body that arrives with the request, 
     * we are desctructing the values that should be in request and in case it is not there we used the '??' {} 
     * turns what would be an error to a 400 error the client gets back */
    const {name, email, password} = req.body ?? {}
    /** */
    const user = await User.create({name, email, password})

    sendCreate(res, {user, token: signToken(user)})
})

const login = asyncHandler(async(req,res) =>{
    const {email, password} = req.body ?? {}

    if (!email || !password) throw ApiError.badRequest('Email and password are required.')

    const user = await User.findOne({email: String(email).toLowerCase().trim()}).select('+password')
    /** .select('+password') overrides the schema that delect:false for this one query, because comparing the hash is the goal here */

    if (!user || !(await user.comparePassword(password))){
        throw ApiError.unauthorized('Invalid email or password.')
    }

    /** make sure that the user exists and the passwords match */

    sendSuccess(res, {user, token: signToken(user)})
})

const me = asyncHandler(async(req,res)=>{
    /**requireAuth will have already verified the token and loaded whatever 
     * user settings/info... so this nothing left to do and use this endpoint
     * so the client can confirm a saved token is still good.
     * and refresh the profile it is showing [this will also allow the user to
     * refresh their token as well later] */
    sendSuccess(res, req.user)

})

module.exports = {register, login, me}
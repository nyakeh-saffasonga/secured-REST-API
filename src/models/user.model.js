'use strict'

/** user schema */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const {ROLES_VALUES, ROLES, AUTH} = require('../config/constants')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'name required'],
            trim: true,
            maxLength: [60, 'name cannot exceed 60 characters']
        },

        email: {
            type: String,
            required: [true, 'email required'],
            unique: true, // prevents duplicate emails
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'please provide a valid email']
        },

        password: {
            type: String,
            required: [true, 'password required'],
            minlength:[8, 'password must be at least 8 characters long'],
            select: false, // keeps the hash (encrupted password) out of every 
        },

        role: {
            type: String,
            enum: {values: ROLES_VALUES, message: `{Value} is not a valid role`},
            default: ROLES.USER
        },
    },{
        timestamps: true,
        toJSON:{
            virtuals: true,
            versionKey: false,
            transform(doc, ret){
                ret.id = ret._id
                /** this is the 2nd line of defense that tha password has, since sele */
                delete ret._id
                delete ret.password
                return ret
            }
        },
        toObject: {virtuals: true}
    }
)

/** DO NOT EVER STORE UNENCRYPTED PASSWORDS ON YOUR DATABASE, BECAUSE ONE DATABASE LEAK WOULD MEAN THE ATTACKER HAS ALL USER INFO 
 * YOU CAN BE LIABLE FOR NOT SECURING INFO
 * 
 * bcrypt is how we are going to encrypt user passwords. 
 * you should aso encrypt user, SSN, phone number, userID (if not randomly made by you), bank account info, etc.
 * this will mean that you as the admin will not be able to give the user the password
 * 
 * the isModified check also matters. 
 * this hook runs every save, so without it, changing a username would 
 * re-hash the already hashed password and lock the account out permanently
*/

userSchema.pre('save', async function hashPassword() {
    if(!this.isModified('password')) return // if the password was changed, stop the function

    this.password  = await bcrypt.hash(this.password, AUTH.SALT_ROUNDS)
})

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
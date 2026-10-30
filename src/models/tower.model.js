'use strict'

const mongoose = require('mongoose')
const {TOWER_TYPES, SUB_DIFFICULTIES, DIFFICULTIES} = require('../config/constants.js')

const towerSchema = new mongoose.Schema({

    name: {
        type: String, 
        required: true
    },

    acronym: {
        type: String
    },

    creators: {
        type: [String], 
        required: true
    },

    floorCount: {
        type: Number,
        required: true
    },

    towerType: {
        type: String, 
        enum: {values: TOWER_TYPES, message: `{VALUE} is not a valid towerType.`}
    },

    warnings: {
        type: [String]
    },

    decimalDifficulty: {
        type: Number,
        required: true

    },

    subDifficulty: {
        type: String, 
        enum: {values: SUB_DIFFICULTIES, message: `{VALUE} is not a valid subDifficulty.`} 
        /* default: findDefaultDifficulty(this.decimalDifficulty, "subDifficulty") */
    },

    difficulty:{
        type: String, 
        enum: {values: DIFFICULTIES, message: `{VALUE} is not a valid difficulty.`} 
        /* default: findDefaultDifficulty(this.decimalDifficulty, "difficulty") */

    },

    location: {
        type: [String],
        required: true
    },

    picture: {
        type: String,
        required: true,
        default: "",
    },

    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null,
        index:true,
        // this indexing is to allow for fatser records searching
    },

}, {
        timestamps:true,

        toJSON:{
            virtuals:true,
            versionKey:false,
            transform(doc, ret){
                ret.id = ret._id
                delete ret._id
                return ret
            }
        },

        toObject:{virtuals:true}
        /** Virtuals:
         * are structers and properties that are not stored on mongodb it set but can be used
         * to elimate data redudancy, keeping all data encapsulate and seperate ,this will be 
         * basically the process of creating and using getters and setters
         */
    },
)



module.exports = mongoose.model('Tower', towerSchema)
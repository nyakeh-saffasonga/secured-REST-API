const express = require('express')
const mongoose = require('mongoose')

// remember that the SCHEMA is the blueprint for a record in the database and is used to validate new record data before the record is created

/* ------------------------------------------------------------------- */

// just some functions to take care of missing default values

function findDefaultDifficulty(difficultyNumber, toReturn) {

    // let data = difficultyNumber.
    // "Insane"
    // "Extreme"
    // "Terrifying"
    // "Catastrophic"
    // "Horrific"
    // "Unreal"
    // "nil"

    // "Baseline"
    // "Bottom"
    // "Bottom-Low"
    // "Low"
    // "Low-Mid"
    // "Mid"
    // "Mid-High"
    // "High"
    // "High-Peak"
    // "Peak"
    // "Skyline"
}

function findTowerAcronym(name) {
    return name.match(/\b(\w)/g)?.join('')
}

const towerSchema = new mongoose.Schema({
    name: {type: String, required:true},
    acronym: {type: String, required:true, default:findTowerAcronym(this.name)},
    creators: {type: [String], required:true},
    towerType: {type: String},
    floorCount: {type: Number},
    decimalDifficulty: {type: Number, required:true},
    subDifficulty: {type: String},
    difficulty:{type: String, required:true},
    location: {type: String, required:true},
    picture: {type: String}
}, {timestamps:true})

const Tower = mongoose.model("Tower", towerSchema)

const app  = express()
app.use(express.json()) // what was missing

let plants = [
    {
        id:'1',
        nickname:'Mike',
        location:'living_room',
        wateringIntervals:7,
        status:'healthy'
    }
]

let nextID = 2

app.get('/health', (req, res)=>{
    res.status(200).json({status: 'ok'})
})

// CRUD Responses: CRUD stands for create, read, update, delete
app.get('/plants', async (req, res)=>{
    const plants = await Plant.find({})
    // the above async request uses the mongoose find functions and returns all record that use the Plant model
    res.status(200).json(plants)
    // responds back with all plants in the "database" in the form on a JSON
})

app.get('/plants/:id', async (req, res)=>{
    try {
        // requires a parameter that is in the URL segment, express captures this with :id
        const plant = await Plant.find({id:Number(req.params.id)});
        // uses ID parameter to search database for the object with the same ID
        if(!plant) {
            return res.status(404).json({error: 'Plant not found'})
            // if the plant is not found using the plant variable this conditional will respond
        }
        res.status(200).json(plant)
        // if it does exist the respond back with a good status and specific plant data
    } catch (error) {
        res.status(500).json({error: 'Plant not found'})
    }
})

// WATERED -- 200 OR 500
app.post('/plants/:id/water', async (req,res)=>{
    // run this route when the plant has been watered to update the database
    try {
        const plant = await Plant.findOne({id:Number(req.params.id)})
        if(!plant) return res.status(404).json({error: 'Plant not found'})

        if (plant.status === 'retired') {
            return res.status(409).json({error: 'Cannot water retired plants'})
        }
        plant.lastWateredAt = new Date()
        plant.status = "healthy"
        await plant.save()

        res.status(200).json(plant)
    } catch (error) {
        res.status(500).json({error:error.message})
        
    }
})

// CREATE -- 201
app.post('/plants', async (req, res)=>{
    const plant = await Plant.create({id:String(nextID++), ...req.body})
    res.status(201).json(plant)
    // try {
    //     const plant = await Plant.findById(req.params.id)
    //     if (!plant) return res.status(404).json({error: 'Plant not found'})
    //     if (plant.status === 'retired') {
    //         return res.status(409).json({error: 'Cannot water retired plants'})
    //     }
    //     // if the plant does exist and the plant isnt retired then the code beloe executes
    //     plant.lastWateredAt = new Date()
    //     plant.status = 'healthy'
    //     await plant.save()
    //     // above is the function that uses the mongoose connectiom
    // } catch (error) {
        
    // }
})

// UPDATE - 200 or 404
app.patch('/plants/:id', async (req, res)=>{
    try {
         const plant = await Plant.find({id:Number(req.params.id)});
        // find specific plant method
        if(!plant) return res.status(404).json({error: 'Plant not found'})
        // if plant not found respond with 404
        // Object.assign(plant, req.body)
        // update plant data from req.body
        // this update is with the mindset that all daa from req.body fulfills plant requirements
        plant.save()
        res.status(200).json(plant)
        // respond with new plant data from database
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

// DELETE -- 204
app.delete('/plants/:id', async (req,res)=>{
    const plant = Plant.findOneAndDelete({id:req.params.id}).exec()
    if(!plant) return res.status(404).json({error: 'Plant not found'})
    // if find does not find a record it returns -1 which means record not found, respond with 404
    // plants.splice(index, 1)
    // remove the record form the database 
    res.status(204).send()
    // confirm removal of the record
})

module.exports = app
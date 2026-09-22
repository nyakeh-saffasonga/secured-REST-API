const express = require('express')
const mongoose = require('mongoose')

// remember that the SCHEMA is the blueprint for a record in the database and is used to validate new record data before the record is created





/* ------------------------------------------------------------------- */

// just some functions to take care of missing default values

function findDefaultDifficulty(difficultyNumber, toReturn) {

    let data = difficultyNumber.toFixed(2).split('.').map(Number)

    if (toReturn == "difficulty") {
        if (data[0] == 14) return "nil"
        if (data[0] == 13) return "Unreal"
        if (data[0] == 12) return "Horrific"
        if (data[0] == 11) return "Catastrophic"
        if (data[0] == 10) return "Terrifying"
        if (data[0] == 9) return "Extreme"
        if (data[0] == 8) return "Insane"
        throw new Error("Difficulty needs to be between 8 and 14, inclusive.")
    }
    
    if (toReturn == "subDifficulty") {
        if (data[1] == 99) return "Skyline"
        if (data[1] >= 89) return "Peak"
        if (data[1] >= 78) return "High-Peak"
        if (data[1] >= 67) return "High"
        if (data[1] >= 56) return "Mid-High"
        if (data[1] >= 45) return "Mid"
        if (data[1] >= 34) return "Low-Mid"
        if (data[1] >= 23) return "Low"
        if (data[1] >= 12) return "Bottom-Low"
        if (data[1] >= 1) return "Bottom"
        if (data[1] == 0) return "Baseline"
        throw new Error("Sub-Difficulty needs to be between 0 and 100, inclusive.")
    }

    throw new Error(`toReturn needs to be "difficulty" or "subDifficulty".`)
}

function findTowerAcronym(name) {
    return name.match(/(?<=^|[^a-zA-Z0-9])[a-zA-Z0-9]/g)?.join('')
}

function findTowerType(floorCount, isMiniTower) {
    if(isMiniTower) return "Mini Tower"
    if (floorCount >= 100) return "Great Citadel"
    if (floorCount >= 30) return "Obelisk"
    if (floorCount >= 12) return "Citadel"
    if (floorCount >= 11) return "Tower"
    if (floorCount >= 5) return "Steeple"
    if (floorCount >= 3) return "Edifice"
}

/* ------------------------------------------------------------------- */





const towerSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true},
    acronym: {type: String, required: true /* default: findTowerAcronym(this.name) */},
    creators: {type: [String], required: true},
    towerType: {type: String, required: true},
    floorCount: {type: Number},
    warnings: {type: [String]},
    decimalDifficulty: {type: Number, required: true},
    subDifficulty: {type: String, required: true /* default: findDefaultDifficulty(this.decimalDifficulty, "subDifficulty") */},
    difficulty:{type: String, required: true /* default: findDefaultDifficulty(this.decimalDifficulty, "difficulty") */},
    location: {type: String, required: true},
    picture: {type: [String], default: ""}
}, {timestamps: true})

const Tower = mongoose.model("Tower", towerSchema)

const app = express()
app.use(express.json()) // what was missing

// let towerList = JSON.parse(fs.readFileSync('towerData.json', 'utf8'));
let nextID = 6

app.get('/health', (req, res)=>{
    res.status(200).json({status: 'ok'})
})

// CRUD Responses: CRUD stands for create, read, update, delete
app.get('/towers', async (req, res)=>{
    const towers = await Tower.find({})
    // the above async request uses the mongoose find functions and returns all record that use the Plant model
    res.status(200).json(towers)
    // responds back with all plants in the "database" in the form on a JSON
})

app.get('/towers/:id', async (req, res)=>{
    try {
        // requires a parameter that is in the URL segment, express captures this with :id
        const tower = await Tower.find({id:Number(req.params.id)});
        // uses ID parameter to search database for the object with the same ID
        if(!tower) {
            return res.status(404).json({error: 'Tower not found'})
            // if the plant is not found using the plant variable this conditional will respond
        }
        res.status(200).json(plant)
        // if it does exist the respond back with a good status and specific plant data
    } catch (error) {
        res.status(500).json({error: 'Tower not found'})
    }
})

// WATERED -- 200 OR 500

/*

app.post('/towers/:id/water', async (req,res)=>{
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

*/

// CREATE -- 201
app.post('/towers', async (req, res)=>{
    const tower = await Tower.create({id:String(nextID++), ...req.body})
    res.status(201).json(tower)
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
app.patch('/towers/:id', async (req, res)=>{
    try {
         const tower = await Tower.find({id:Number(req.params.id)});
        // find specific plant method
        if(!tower) return res.status(404).json({error: 'Tower not found'})
        // if plant not found respond with 404
        // Object.assign(plant, req.body)
        // update plant data from req.body
        // this update is with the mindset that all daa from req.body fulfills plant requirements
        tower.save()
        res.status(200).json(tower)
        // respond with new plant data from database
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

// DELETE -- 204
app.delete('/towers/:id', async (req,res)=>{
    const tower = Tower.findOneAndDelete({id:req.params.id}).exec()
    if(!tower) return res.status(404).json({error: 'Tower not found'})
    // if find does not find a record it returns -1 which means record not found, respond with 404
    // plants.splice(index, 1)
    // remove the record form the database 
    res.status(204).send()
    // confirm removal of the record
})

module.exports = app

'use strict'

const asyncHandler = require('../utils/asyncHandler')
const {sendSuccess, sendCreate, sendNoContent} = require('../utils/apiResponse')
const Tower = require('../models/tower.model')
const ApiError = require('../utils/ApiError')
const {parsePagination, parseSort, buildMeta, buildTowerFilter} = require('../utils/queryFeatures')

//const {parsePagination, parseSort, buildMeta}

/**
 * Tower HTTP handlers
 * 
 * each handler will be a method/service, this takes in the request and completes the actions required
 */



// GET /api/v1/

const WRITABLE_FEILDS = ["name", "floorCount", "towerType", "warnings", "decimalDifficulty", "location", "picture"]
// notice that the ownerId was not included and should not allow the user to change or manipulate the field

function pickWritableFeilds(body={}) {
    const payload = {}
    for (const field of WRITABLE_FEILDS) {
        if(body[field] !== undefined) payload[field] = body[field]
    }
    return payload
}

const getAllTowers = asyncHandler(async(req, res) => {
    const filter = buildTowerFilter(req.query)
    const sort = parseSort(req.query.sort)
    const {page, limit, skip} = parsePagination(req.query)

    /** 2 queries run together rather than one after the other.
     * the page of the recrds and the total number of matches the client needs to know how many pages will exist.
     * countDocuments  will use the same filter so the count describes the filtered set, not the whole collection */
    const [tower, total] = await Promise.all([
        await Tower.find(filter).sort(sort).skip(skip).limit(limit),
        Tower.countDocuments(filter)
    ])

    /** the metadata will go along with the sendSuccess argument so the response 
     * will be {succcess, data, meta} and the single record response will keep the old structre without meta  */
    sendSuccess(res, tower, 200, {meta: buildMeta({page, limit, total})})
})

// POST /api/v1/towers/

const createTower = asyncHandler(async(req, res) => {
    console.log(req.body)
    const tower = await Tower.create({
        ...pickWritableFeilds(req.body),
        ownerId: req.user._id // using the mongoDB id --> _id
    })
})

// GET /api/v1/:id

const getTowerById = asyncHandler(async(req, res) => {
    const tower = await Tower.findById(req.params.id)
    if (!tower) throw ApiError.notFound('Tower not found')
    return res.status(200).json({success: true, data: tower})
})

// PUT + PATCH /api/v1/towers/:id

const updateTower = asyncHandler(async(req, res) => {
    const tower = await Tower.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!tower) throw ApiError.notFound('Tower not found')
    sendSuccess(res, tower)
})

// DELETE /api/v1/towers/:id

const removeTower = asyncHandler(async(req, res) => {
    const tower = await Tower.findById(req.params.id)
    if (!tower) throw ApiError.notFound('Tower not found')
    await Tower.findByIdAndDelete(req.params.id)
    sendNoContent(res, tower)
})


module.exports = {getAllTowers, createTower, getTowerById, updateTower, removeTower}










/* ------------------------------------------------------------------- */

/*

// CRUD Responses: CRUD stands for create, read, update, delete
app.get('/api/v1/towers', async (req, res)=>{
    const towers = await Tower.find({})
    res.status(200).json(towers)
})

app.get('/api/v1/towers/:id', async (req, res)=>{
    try {
        // requires a parameter that is in the URL segment, express captures this with :id
        const tower = await Tower.find({id: Number(req.params.id)});
        // uses ID parameter to search database for the object with the same ID
        if(!tower) return res.status(404).json({error: 'Tower not found'})
        res.status(200).json({"success": true, "data": {tower}})
        // if it does exist the respond back with a good status and specific tower data
    } catch (error) {
        res.status(500).json({error: 'Tower not found'})
    }
})

// CREATE -- 201
app.post('/api/v1/towers', async (req, res)=>{
    const tower = await Tower.create({id:String(nextID++), ...req.body})
    res.status(201).json({"success": true, "data": {tower}})
})

app.put('/api/v1/towers/:id', async (req, res) =>{
    try {
        const tower = await Tower.findOne({id:Number(req.params.id)});
        // find specific tower method
        if(!tower) return res.status(404).json({error: 'Tower not found'})
        // if tower not found respond with 404
        Object.assign(tower, req.body)
        // update tower data from req.body
        // this update is with the mindset that all data from req.body fulfills tower requirements
        await tower.save()
        res.status(200).json({"success": true, "data": {tower}})
        // respond with new tower data from database
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// UPDATE - 200 or 404
app.patch('/api/v1/towers/:id', async (req, res)=>{
    try {
        const tower = await Tower.findOne({id:Number(req.params.id)});
        // find specific tower method
        if(!tower) return res.status(404).json({error: 'Tower not found'})
        // if tower not found respond with 404
        // Object.assign(tower, req.body)
        // update tower data from req.body
        // this update is with the mindset that all data from req.body fulfills tower requirements
        tower.save()
        res.status(200).json({"success": true, "data": {tower}})
        // respond with new tower data from database
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// DELETE -- 204
app.delete('/api/v1/towers/:id', async (req,res)=>{
    const tower = Tower.findOneAndDelete({id:req.params.id}).exec()
    if(!tower) return res.status(404).json({error: 'Tower not found'})
    // if find does not find a record it returns -1 which means record not found, respond with 404
    // towers.splice(index, 1)
    // remove the record form the database 
    res.status(204).send()
    // confirm removal of the record
})

app.get('/api/v1/health', (req, res)=>{
    res.status(200).json({status: 'ok'})
})

module.exports = app

/* ------------------------------------------------------------------- */
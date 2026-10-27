'use strict'

/** this will serve as a platform for helper functions need
 *  for pagination featurs like sorting and filtering as well as error handling 
 * 
 * right now Tower.find({}) returns every tower that is fine with 12-50 records but that will be a disaster for scaling 500000000 records. 
 * you could load hundreds of megabytes into 1 response and that could be to a mobile device... that is not the way to go
 * pagination makes the cost of the request a fixed and predictable size no matter how big the collection grows to be, fixing the scaling issue
 * 
 * the other reason is every value has to be parsed that is coming from the database that can lead to high load and data usage time
 * 
 * @param {object} query req.query
 * @param {{page:number, limit:number, skip:number}} 
 */


const {PAGINATION, SORTABLE_FEILDS, DEFAULT_SORT, TOWER_STATUSES, LOCATIONS} = require('../config/constants')
const ApiError = require('./ApiError')

function parsePagination(query={}) {
    const rawPage = Number.parseInt(query.page, 10)
    const rawLimit = Number.parseInt(query.limit, 10)

    // request limitation
    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage: PAGINATION.DEFAULT_PAGE
    
    let limit = Number.isInteger(rawLimit) && rawLimit > 0 ? rawLimit: PAGINATION.DEFAULT_LIMIT
    if (limit > PAGINATION.MAX_LIMIT) limit = PAGINATION.MAX_LIMIT
    // skip is how many documents the database steps over before it starts returning. 
    // page 1 skips 0, page 2 skips one full limit, so on and so forth
    return {page, limit, skip: (page - 1) * limit}
}

/** we are now turning on sort with the following functiom by also creating a whitelist
 * THIS WILL TURN -> ?sort=lastWAteredAt, nickname --> {lastWateredAt: -1, nickname: 1}
 * 
 * the '-' means descending, matching the mongoose syntax the whitelist made by it.
 * this is important because the client could sort any feild without it. thi would include feilds that do not have an index 
 * like true/fase feilds, etc.
 * 
 * in stage 2, we will be adding in users and feilds that leak information is not the goal. the only feilds listed in SORTABLE_FEILDS is allowed through
 * 
 * @param {string} [sortParam] req.query.sort
 * @returns {object} a mongoose object sort
 * @throws {ApiError} 400 when a feild is not sortable
 */

function parseSort(sortParam) {
    if(!sortParam || typeof sortParam !== 'string') return {...DEFAULT_SORT}

    const sort = {}

    for (const rawFeild of sortParam.split(',')){
        const field = rawFeild.trim()
        if(!field) continue // if there is no other field end the loop with continue

        const descending = field.startsWith('-')
        const name = descending ? feild.slice(1) : field // name is the name of the field that it will be sorted by

        if(!SORTABLE_FEILDS.includes(name)) {
            throw ApiError.badRequest(`Cannot sort by '${name}'. Sortable Fields: ${SORTABLE_FEILDS.join(', ')}`)
        } // checks to see if a field name given exists in the allowed list. if not, throws ApiError with a list of acceptable fields

        // ?sort=,,, parses to nothing usable so we fall back on our error handling rather than mongooses, an empty object and get an unpredictable order back
        return Object.keys(sort).length > 0 ? sort : {...DEFAULT_SORT}
    }
}

/**
 * everything in the client ends to draw page 2 of 7 and wire up the next bottom os what meta is for
 * 
 * this will adjust alongside the data rather inside of it. user 'extra' argument, the sendSuccess already accepted in Stage 1, 
 * so a list response now will be {success, data, meta} and the already existing single-recods in the database will not change
 * 
 * @param {{page:number, limit:number, total:number}} args
 */

function buildMeta({page, limit, total}) {
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0

    return {
        page, limit, total, totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    }
}

/** Escape a users search from becoming a liability
 * 
 * without the following function the search for "c++" or "(" would 
 * either crash the regex compiler or be read as regex syntax instead of the letters the user typed.
 * for malicious users like us a carefully built pattern can also be made to slow and even stall the event loop
 * which is a denial of service/router attack
 */

function escapeFunction(text) {
    return String(text).replace(/[.*+?^{}()|[\]\\]/g, '\\$&')
}

/**
 * lastly for stage 2 we are going to build a plany filter function
 * 
 * this will live in the file, next to the query helpers, 
 * so the controller stays on a short list for the number of steps it has to take and the number of 
 * items it has to import
 * 
 *  ?status= ?location= ?q= (you can search for nickname and species)
 * 
 * we are also deliberately not including ?overDue=true as it is a virtual function for the model which
 * will take a little more configuration for
 * 
 * 
 * @param {object} query req.query
 * @returns {object} a filter object for Tower.find()
 * @throws {ApiError} 400 on a value that is not in the allowed set
 * 
 */

function buildTowerFilter(query={}) {
    const filter = {}

    if(query.status) {
        // checks to see if the query is checking the status
        if (!TOWER_STATUSES.includes(query.status)) {
            // checks to see if the given status is in the list of approved statuses
            throw ApiError.badRequest(`'${query.status}' is not a supported status. Valid: ${TOWER_STATUSES.join(', ')}`)
        }
        filter.status = query.status
    }

    if(query.location) {
        // checks to see if the query is checking the status
        if (!LOCATIONS.includes(query.location)) {
            // checks to see if the given status is in the list of approved statuses
            throw ApiError.badRequest(`'${query.location}' is not a supported status. Valid: ${LOCATIONS.join(', ')}`)
        }
        filter.location = query.location
    }

    if(query.q) {
        // 'i' makes the search case insensitive so that widens the search results for the use
        // $or checks both fields and keeps a tower that matchs one as ors do
        const pattern = new RegExp(escapeRegex(String(query.q).trim()), 'i')
        filter.$or = [{nickname:pattern}, {species:pattern}]
    }
    return filter
}

module.exports = {parsePagination, parseSort, buildMeta, escapeFunction, buildTowerFilter}
const SUB_DIFFICULTIES = Object.freeze([
    "Baseline", "Bottom", "Bottom-Low", "Low", "Low-Mid", "Mid", "Mid-High", "High", "High-Peak", "Peak", "Skyline"
])

const DIFFICULTIES = Object.freeze([
    "Insane", "Extreme", "Terrifying", "Catastrophic", "Horrific", "Unreal", "nil"
])

const TOWER_TYPES = Object.freeze([
    "Mini Tower", "Room/Box", "Mini Steeple", "Edifice", "Steeple", "Tower", "Citadel", "Obelisk", "Great Citadel"
])

const SORTABLE_FIELDS = Object.freeze([
    "createdAt", "updatedAt", "acronym", "difficulty", "towerType"
])

const PAGINATION = Object.freeze({
    DEFAULT_PAGE: 1, DEFAULT_LIMIT:20, MAX_LIMIT:100
})

const API_PREFIX = "/api/v1"

/** STAGE 2: ACCOUNT ROLES */

const ROLES = Object.freeze({USER: 'user', CURATOR: 'curator', ADMIN: 'admin'})
const ROLES_VALUES = Object.freeze(Object.values(ROLES))

/**
 *  STAGE 2: AUTHENTICATION
 */

const AUTH = Object.freeze({
    SALT_ROUNDS: 10,
    // when using encryption, the term salting refers to how complex the encryption will be, but it also plays a role
    // in how long it will take for the authorization to complete, meaning that maving too many salt rounds
    // is not the best for application performance
    DEFAULT_JWT_EXPIRES_IN: '30d',
    BEARER_PREFIX: 'Bearer'
})

const DEFAULT_SORT = Object.freeze({createdAt: -1})

module.exports = {SUB_DIFFICULTIES, DIFFICULTIES, TOWER_TYPES, SORTABLE_FIELDS, PAGINATION, API_PREFIX,
    // STAGE 2
    ROLES, ROLES_VALUES, AUTH, DEFAULT_SORT
}

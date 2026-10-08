const SUB_DIFFICULTIES = Object.freeze([
    "Baseline", "Bottom", "Bottom-Low", "Low", "Low-Mid", "Mid", "Mid-High", "High", "High-Peak", "Peak", "Skyline"
])

const DIFFICULTIES = Object.freeze([
    "Insane", "Extreme", "Terrifying", "Catastrophic", "Horrific", "Unreal", "nil"
])

// const PLANT_STATUSES = Object.freeze(Object.values(PLANT_STATUS))

const SORTABLE_FIELDS = Object.freeze([
    "createdAt", "updatedAt", "acronym", "difficulty", "towerType"
])

const PAGINATION = Object.freeze({
    DEFAULT_PAGE: 1, DEFAULT_LIMIT:20, MAX_LIMIT:100
})

const API_PREFIX = "/api/v1"

module.exports = {SUB_DIFFICULTIES, DIFFICULTIES, SORTABLE_FIELDS, PAGINATION, API_PREFIX}

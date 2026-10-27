
function findDefaultDifficulty(toReturn, difficultyNumber) {

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

function findTowerType(floorCount, isMiniTower = false) {
    if(isMiniTower) return "Mini Tower"
    if (floorCount >= 100) return "Great Citadel"
    if (floorCount >= 30) return "Obelisk"
    if (floorCount >= 12) return "Citadel"
    if (floorCount >= 11) return "Tower"
    if (floorCount >= 5) return "Steeple"
    if (floorCount == 3) return "Edifice"
    if (floorCount == 2) return "Mini Steeple"
    if (floorCount == 1) return "Room/Box"
}

function valueFiller(requestBody) {

    
    
}


module.exports = {valueFiller}
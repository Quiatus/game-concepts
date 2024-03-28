import { generateMarkup, printMessage } from "./domhelpers.js"
import { loadGame, saveGame } from "./utilities.js"

// Calculate happines. Min 0, max 100. If reach 0 happines, riots will occur (generally pop will die and attack our army. If no army, gold will disappear)
export const calculateHappiness = () => {
    let gameData = loadGame()
    let calculatedHappiness = gameData.basicResources.baseHappiness // 50

    // Positive gains
    gameData.general.tax === 1 ? calculatedHappiness += 20 : null

    // Negative gains
    gameData.alerts.famine ? calculatedHappiness -= 10 : null
    gameData.alerts.overpopulation ? calculatedHappiness -= 5 : null
    gameData.general.tax === 3 ? calculatedHappiness -= 20 : null

    // Happiness cannot go below 0 or above 100
    calculatedHappiness < 0 ? calculatedHappiness = 0 : null
    calculatedHappiness > 100 ? calculatedHappiness = 100 : null

    gameData.tempData.happiness = calculatedHappiness

    // checks if happiness is too low and prints / triggers adequate response
    calculatedHappiness > 0 && calculatedHappiness < 20 ? printMessage('Our population is unhappy! Increase happiness of our population, otherwise our people will riot!', 'warning') : null
    calculatedHappiness === 0 ? (
        printMessage('Our population is rioting!', 'critical'),
        gameData.alerts.riot = true
    ) : null

    saveGame(gameData)
}

// change tax index 
export const changeTax = (id) => {
    let gameData = loadGame()

    gameData.general.tax = id

    saveGame(gameData)
    generateMarkup('management')
}

// checks the current capital level and applies modifiers
export const applyCapitalBonuses = () => {
    let gameData = loadGame()
    const capitalLevel = gameData.general.capitalLevel
    const values = gameData.capitalLevels[capitalLevel - 1]

    gameData.basicResources.basicSpace = values.space
    gameData.tempData.commerce = values.commerce
    gameData.buildingHouse.maxSpace = values.houses

    if (capitalLevel < 2) {
        const nextValues = gameData.capitalLevels[capitalLevel]

        gameData.buildingCapital.costTime = nextValues.costTime
        gameData.buildingCapital.costGold = nextValues.costGold
        gameData.buildingCapital.costWood = nextValues.costWood
        gameData.buildingCapital.costStone = nextValues.costStone
        gameData.buildingCapital.specialUnlock = nextValues.specialUnlock
    }

    saveGame(gameData)
}

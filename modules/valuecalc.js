'use strict';
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
    const capital = gameData.buildingCapital

    gameData.basicResources.basicSpace = capital.levels[capital.currentLevel - 1].space
    gameData.tempData.commerce = capital.levels[capital.currentLevel - 1].commerce
    gameData.buildingHouse.maxSpace = capital.levels[capital.currentLevel - 1].houses 

    if (capital.currentLevel < capital.maxLevel) {
        gameData.buildingCapital.costTime = capital.levels[capital.currentLevel].costTime
        gameData.buildingCapital.costGold = capital.levels[capital.currentLevel].costGold
        gameData.buildingCapital.costWood = capital.levels[capital.currentLevel].costWood
        gameData.buildingCapital.costStone = capital.levels[capital.currentLevel].costStone
        gameData.buildingCapital.specialUnlock = capital.levels[capital.currentLevel].specialUnlock
    }
    
    saveGame(gameData)
}

// Updates the current building cost for any upgradeable building
export const updateBuildCost = () => {
    let gameData = loadGame()

    for (let i = 0; i < gameData.buildingList.length; i++) {
        const building = gameData.buildingList[i]
        const cl = gameData[building].currentLevel
        const ml = gameData[building].maxLevel

        if (gameData[building].isUpgradeable) {
            gameData[building].effect = gameData[building].levels[cl-1].effect

            // if buliding is not constructed, grabs costs of lvl1, otherwise, grabs costs of the next level
            if (gameData[building].amount === 0) {
                gameData[building].costTime = gameData[building].levels[0].costTime
                gameData[building].costGold = gameData[building].levels[0].costGold
                gameData[building].costWood = gameData[building].levels[0].costWood
                gameData[building].costStone = gameData[building].levels[0].costStone
            } else if (gameData[building].amount === 1 && cl < ml) {
                gameData[building].costTime = gameData[building].levels[cl].costTime
                gameData[building].costGold = gameData[building].levels[cl].costGold
                gameData[building].costWood = gameData[building].levels[cl].costWood
                gameData[building].costStone = gameData[building].levels[cl].costStone
            }
        }  
    }
    saveGame(gameData)
}
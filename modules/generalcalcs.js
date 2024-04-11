'use strict';

import { generateMarkup, printMessage } from "./domhelpers.js"
import { loadGame, saveGame } from "./utilities.js"

// Calculate happines. Min 0, max 100. If reach 0 happines, riots will occur (generally pop will die and attack our army. If no army, gold will disappear)
export const calculateHappiness = () => {
    let gameData = loadGame()
    let calculatedHappiness = gameData.basicResources.baseHappiness // 50

    // Positive gains
    gameData.general.tax === 1 ? calculatedHappiness += 20 : null
    gameData.general.foodLevel === 3 ? calculatedHappiness += 25 : null

    // Negative gains
    gameData.alerts.famine ? calculatedHappiness -= 20 : null
    gameData.alerts.overpopulation ? calculatedHappiness -= 5 : null
    gameData.general.tax === 3 ? calculatedHappiness -= 20 : null
    gameData.general.foodLevel === 1 ? calculatedHappiness -= 25 : null

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

    if (id === 'taxLow') gameData.general.tax = 1
    if (id === 'taxBalanced') gameData.general.tax = 2
    if (id === 'taxHigh') gameData.general.tax = 3

    saveGame(gameData)
    generateMarkup('empireManagementPanel')
}

// change food ration
export const changeFoodLevel = (id) => {
    let gameData = loadGame()

    if (id === 'foodLow') gameData.general.foodLevel = 1
    if (id === 'foodBalanced') gameData.general.foodLevel = 2
    if (id === 'foodHigh') gameData.general.foodLevel = 3

    saveGame(gameData)
    generateMarkup('empireManagementPanel')
}
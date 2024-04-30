'use strict';

import { showPanel, printMessage, converThousand } from "./dom/general.js"
import { randomResource } from "./resources.js"
import { saveGame } from "./utilities.js"

// Calculate happines. Min 0, max 100. If reach 0 happines, riots will occur (generally pop will die and attack our army. If no army, gold will disappear)
export const calculateHappiness = (isNewMonth, gameData) => {
    let calculatedHappiness = gameData.basicResources.baseHappiness // 50

    // Positive gains
    gameData.general.tax < 1 ? calculatedHappiness += 25 : null
    gameData.general.foodLevel > 1 ? calculatedHappiness += 25 : null
    gameData.general.production < 1 ? calculatedHappiness += 25 : null
    gameData.buildings[7].amount === 1 ? calculatedHappiness += 10 : null

    // Negative gains
    gameData.alerts.famine ? calculatedHappiness -= 25 : null
    gameData.alerts.overpopulation ? calculatedHappiness -= 10 : null
    gameData.general.tax > 1 ? calculatedHappiness -= 25 : null
    gameData.general.foodLevel < 1 ? calculatedHappiness -= 25 : null
    gameData.general.production > 1 ? calculatedHappiness -= 25 : null

    // Happiness cannot go below 0 or above 100
    calculatedHappiness < 0 ? calculatedHappiness = 0 : null
    calculatedHappiness > 100 ? calculatedHappiness = 100 : null

    gameData.tempData.happiness = calculatedHappiness

    // checks if happiness is too low and prints / triggers adequate response
    calculatedHappiness > 0 && calculatedHappiness < 20 ? printMessage('Our population is unhappy! Increase happiness of our population, otherwise our people will riot!', 'warning', gameData) : null

    if (!calculatedHappiness && gameData.basicResources.pop > 10) {
        gameData.alerts.riot = true
        if (isNewMonth) actionRiot(gameData)
    } else {
        gameData.alerts.riot = false
    }
}

// change tax index 
export const changeTax = (id, gameData) => {
    if (id === 'taxLow') gameData.general.tax = 0.5
    if (id === 'taxBalanced') gameData.general.tax = 1
    if (id === 'taxHigh') gameData.general.tax = 1.5

    saveGame(gameData)
    showPanel('empireManagementPanel', gameData)
}

// change food ration
export const changeFoodLevel = (id, gameData) => {
    if (id === 'foodLow') gameData.general.foodLevel = 0.5
    if (id === 'foodBalanced') gameData.general.foodLevel = 1
    if (id === 'foodHigh') gameData.general.foodLevel = 1.5

    saveGame(gameData)
    showPanel('empireManagementPanel', gameData)
}

// change peoduction level
export const changeProductionLevel = (id, gameData) => {
    if (id === 'productionLow') gameData.general.production = 0.75
    if (id === 'productionBalanced') gameData.general.production = 1
    if (id === 'productionHigh') gameData.general.production = 1.25

    saveGame(gameData)
    showPanel('empireManagementPanel', gameData)
}

// if riot event is active, people will be attacking each other and looting our supplies.
const actionRiot = (gameData) => {
    const deadPop = randomResource(gameData.basicResources.pop, 0.04, 0.08)
    const stolenGold = randomResource(gameData.basicResources.gold, 0.08, 0.12)
    const stolenFood = randomResource(gameData.basicResources.food, 0.08, 0.12)
    printMessage(`Our people are rioting! <span class='text-bold'>${converThousand(deadPop)}</span><img class='img-s' src='media/res/pop.png'>died during riots. 
    Rioters broke into our storages and stole ${stolenGold > 0 ? `<span class='text-bold'>${converThousand(stolenGold)}</span><img class='img-s' src='media/res/gold.png'> and ` : ``} ${stolenFood > 0 ? `<span class='text-bold'>${converThousand(stolenFood)}</span><img class='img-s' src='media/res/food.png'>` : ``}.`, 'critical', gameData)
    gameData.basicResources.pop -= deadPop
    gameData.tempData.popDied = deadPop 
    gameData.basicResources.gold -= stolenGold
    gameData.tempData.goldStolen = stolenGold 
    gameData.basicResources.food -= stolenFood
    gameData.tempData.foodStolen = stolenFood
}

// calculates total available space from houses, capital and settlements
export const calculateTotalSpace = (gameData) => {
    const basicSpace = gameData.basicResources.basicSpace
    const houseSpace = gameData.buildings[1].amount * gameData.buildings[1].effect
    const totalSpace = basicSpace + houseSpace

    gameData.tempData.houseSpace = houseSpace
    gameData.tempData.totalSpace = totalSpace
}
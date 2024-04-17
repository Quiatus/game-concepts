'use strict';

import { showPanel, printMessage, converThousand } from "./domhelpers.js"
import { gold, pop, food } from "./resources.js"
import { saveGame } from "./utilities.js"

// Calculate happines. Min 0, max 100. If reach 0 happines, riots will occur (generally pop will die and attack our army. If no army, gold will disappear)
export const calculateHappiness = (isNewMonth, gameData) => {
    let calculatedHappiness = gameData.basicResources.baseHappiness // 50

    // Positive gains
    gameData.general.tax === 1 ? calculatedHappiness += 25 : null
    gameData.general.foodLevel === 3 ? calculatedHappiness += 25 : null

    // Negative gains
    gameData.alerts.famine ? calculatedHappiness -= 25 : null
    gameData.alerts.overpopulation ? calculatedHappiness -= 10 : null
    gameData.general.tax === 3 ? calculatedHappiness -= 25 : null
    gameData.general.foodLevel === 1 ? calculatedHappiness -= 25 : null

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
    if (id === 'taxLow') gameData.general.tax = 1
    if (id === 'taxBalanced') gameData.general.tax = 2
    if (id === 'taxHigh') gameData.general.tax = 3

    saveGame(gameData)
    showPanel('empireManagementPanel', gameData)
}

// change food ration
export const changeFoodLevel = (id, gameData) => {
    if (id === 'foodLow') gameData.general.foodLevel = 1
    if (id === 'foodBalanced') gameData.general.foodLevel = 2
    if (id === 'foodHigh') gameData.general.foodLevel = 3

    saveGame(gameData)
    showPanel('empireManagementPanel', gameData)
}

// if riot event is active, people will be attacking each other and looting our supplies.
const actionRiot = (gameData) => {
    const deadPop = pop.removePops(gameData, 'riot')
    const stolenGold = gold.removeGold(gameData.basicResources.gold, 'riot')
    const stolenFood = food.removeFood(gameData.basicResources.food, 'riot')
    printMessage(`Our people are rioting! <span class='text-bold'>${converThousand(deadPop)}</span><img class='img-s' src='media/res/pop.png'>died during riots. 
    Rioters broke into our storages and stole ${stolenGold > 0 ? `<span class='text-bold'>${converThousand(stolenGold)}</span><img class='img-s' src='media/res/gold.png'> and ` : ``} ${stolenFood > 0 ? `<span class='text-bold'>${converThousand(stolenFood)}</span><img class='img-s' src='media/res/food.png'>` : ``}.`, 'critical', gameData)
    gameData.basicResources.pop -= deadPop
    gameData.tempData.popDied = deadPop 
    gameData.basicResources.gold -= stolenGold
    gameData.tempData.goldStolen = stolenGold 
    gameData.basicResources.food -= stolenFood
    gameData.tempData.foodStolen = stolenFood
}
'use strict';

import { showPanel, printMessage, printNewMonthMessages, displayMenu } from "./modules/dom/general.js"
import { checkIfNewGame, loadGame, saveGame } from "./modules/utilities.js"
import { calculateHappiness, calculateTotalSpace } from "./modules/general.js";
import { progressBuild, applyCapitalBonuses, updateBuildCost, startConstruction } from "./modules/features/buildings.js"
import { month, gold, pop, food, wood, stone } from "./modules/features/resources.js";
import { generateEvent } from "./modules/features/events.js";
import { calculateMight, recruitUnits, checkUpkeep, unlockUnits } from "./modules/features/units.js"

let gameData = {}

// initiates app once page is fully loaded
document.addEventListener('readystatechange', (e) => { if (e.target.readyState === "complete") initApp() });

// Button event listeners
document.addEventListener('click', (e) => {
    if (e.target.className === 'menuBtn') showPanel(e.target.id, gameData, true)
    if (e.target.className === 'btnBuild') startConstruction(e, gameData)
})
document.querySelector('#btnNewMonth').addEventListener('click', () => progressGame(true))

// initializes the app
const initApp = () => {
    checkIfNewGame()
    gameData = loadGame()
    checkBefore(false)
    gameData.tempData.messages = []
    gameData.general.isNewGame ? printMessage('A new game has started!', 'info', gameData) : printMessage('Game loaded!', 'info', gameData)
    checkAfter(false)
}

const checkBefore = () => {
    showPanel('', gameData)  // show general panel
    displayMenu(gameData)
    unlockUnits(gameData) // unlocks recruitable units
    applyCapitalBonuses(gameData) // apply capital bonuses 
    updateBuildCost(gameData) // Updates the current building cost for any upgradeable building  
    calculateTotalSpace(gameData) // calculates max. available space for pop (from building, capital and settlements)
}

const checkAfter = (isNewMonth) => {
    checkUpkeep(gameData) // check if there is enough gold to pay the army
    calculateMight(gameData) // calculate might
    calculateHappiness(isNewMonth, gameData) // calculates happiness based on the conditions calculaed before
    showPanel('overviewPanel', gameData, isNewMonth)  // show general panel
    saveGame(gameData)
}

const progressGame = (isNewMonth) => {
    gameData.tempData.messages = []
    progressBuild(gameData) // progress construction
    generateEvent(gameData) // generates random event at the beginning of the month
    checkBefore(isNewMonth)

    month.increaseMonth(gameData);
    gold.calculateGold(gameData);
    pop.calculatePop(gameData);
    food.calculateFood(gameData);
    wood.calculateWood(gameData);
    stone.calculateStone(gameData);

    printNewMonthMessages(gameData)
    pop.isMaxPop(gameData) // checks if there is a space for population, if not, shows warning
    food.checkIfEnoughFood(gameData) // checks if there is enough food, if not, shows warning
    recruitUnits(gameData) // recruit units 
    checkAfter(isNewMonth)
}
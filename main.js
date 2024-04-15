'use strict';

import { generateMarkup, showPanel, displayActiveAlerts, printNewMonthMessages, clearMessages, displayActiveEvents,showMissionNumber, showMenuButtons } from "./modules/domhelpers.js"
import { checkIfNewGame, loadGame, saveGame } from "./modules/utilities.js"
import { changeTax, calculateHappiness, changeFoodLevel } from "./modules/generalcalcs.js";
import { startConstruction, progressBuild, applyCapitalBonuses, updateBuildCost } from "./modules/buildings.js"
import { month, gold, pop, food, wood, stone } from "./modules/resources.js";
import { generateEvent, removeMission } from "./modules/events.js";
import { dismissUnits, calculateMight, recruitUnits, addRecruits, checkUpkeep, unlockUnits } from "./modules/units.js"

let gameData = {}

// initiates app once page is fully loaded
document.addEventListener('readystatechange', (e) => {
    if (e.target.readyState === "complete") initApp();
});

// initializes the app
const initApp = () => {
    checkIfNewGame()
    gameData = loadGame()
    showPanel('overviewPanel', gameData)  // show general panel
    checkBefore(false)
    checkAfter(false)
}

const checkBefore = (isNewMonth) => {
    unlockUnits(gameData) // unlocks recruitable units
    applyCapitalBonuses(gameData) // apply capital bonuses 
    updateBuildCost(gameData) // Updates the current building cost for any upgradeable building  
    pop.calculateTotalSpace(gameData) // calculates max. available space for pop (from building, capital and settlements)
    displayActiveEvents(isNewMonth, gameData) // displays any active events
    showMissionNumber(gameData) // show number of mission on the menu button
}

const checkAfter = (isNewMonth) => {
    checkUpkeep(gameData) // check if there is enough gold to pay the army
    calculateMight(gameData) // calculate might
    calculateHappiness(isNewMonth, gameData) // calculates happiness based on the conditions calculaed before
    displayActiveAlerts(gameData) // shows any active alerts
    showMenuButtons(gameData) // show unlocked buttons
    generateMarkup(undefined ,gameData) // updates DOM
    saveGame(gameData)
}

const progressGame = (isNewMonth) => {
    clearMessages() 
    showPanel('overviewPanel', gameData)  // show general panel
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

// Button event listeners
document.addEventListener('click', (e) => {
    const button = e.target.id
    const btnClass = e.target.className

    // New month and reset buttons
    button === 'btnNewMonth' ? progressGame(true) : null
    button === 'btnReset' ? (localStorage.removeItem('gameSave'), location.reload()) : null

    btnClass.includes('menuPanel') ? showPanel(e.target.id, gameData) : null
    btnClass === 'btnTax' ? changeTax(e.target.id, gameData) : null
    btnClass === 'btnFood' ? changeFoodLevel(e.target.id, gameData) : null
    btnClass === 'btnBuild' ? startConstruction(e, gameData) : null
    btnClass == 'btnDismiss' ? dismissUnits(e.target.id, gameData) : null
    btnClass.includes('add-max') ? addRecruits(e.target.id, e, true, gameData) : null
    btnClass == 'btnRecruit' ? addRecruits(e.target.id, e, false, gameData) : null

    // missions
    button === 'btnAcceptMission' ? removeMission(e.target.parentNode.parentNode.id, true, gameData) : null
    button === 'btnRejectMission' ? removeMission(e.target.parentNode.parentNode.id, false, gameData) : null
})

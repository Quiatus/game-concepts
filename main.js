'use strict';

import { generateMarkup, showPanel, displayActiveAlerts, printNewMonthMessages, clearMessages, displayActiveEvents,showMissionNumber } from "./modules/domhelpers.js"
import { checkIfNewGame } from "./modules/utilities.js"
import { changeTax, calculateHappiness } from "./modules/generalcalcs.js";
import { startConstruction, progressBuild, applyCapitalBonuses, updateBuildCost } from "./modules/buildings.js"
import { Month, Gold, Pop, Food, Wood, Stone } from "./modules/resources.js";
import { generateEvent, removeMission } from "./modules/events.js";
import { dismissUnits, calculateMight, recruitUnits, addRecruits } from "./modules/units.js"

// instantiate classes
const gold = new Gold();
const pop = new Pop();
const month = new Month();
const food = new Food();
const wood = new Wood();
const stone = new Stone();

// initiates app once page is fully loaded
document.addEventListener('readystatechange', (e) => {
    if (e.target.readyState === "complete") initApp();
});

// initializes the app
const initApp = () => {
    checkIfNewGame()
    checkBeforeResourceCalc(false)
    checkAfterResourceCalc(false)
}

// check before gaining res or at the beginning of teh game
const checkBeforeResourceCalc = (isNewMonth) => {
    clearMessages(isNewMonth)
    showPanel('overviewPanel')  // show general panel
    progressBuild(isNewMonth) // progress construction
    applyCapitalBonuses() // apply capital bonuses 
    updateBuildCost() // Updates the current building cost for any upgradeable building
    pop.calculateTotalSpace() // calculates max. available space for pop (from building, capital and settlements)
    generateEvent(isNewMonth) // generates random event at the beginning of the month
    displayActiveEvents(isNewMonth) // displays any active events
    showMissionNumber() // show number of mission on the menu button
}

// checks various conditions after gaining resources and run events. Check for events before printing text
const checkAfterResourceCalc = (isNewMonth) => {
    pop.isMaxPop(isNewMonth) // checks if there is a space for population, if not, shows warning
    food.checkIfEnoughFood(pop, isNewMonth) // checks if there is enough food, if not, shows warning
    recruitUnits(isNewMonth) // recruit units
    calculateHappiness()  // calculates happiness based on the conditions calculaed before
    calculateMight() // calculate might
    displayActiveAlerts() // shows any active alerts
    generateMarkup() // updates DOM
}

// Calculate resources at teh beginning of month
const calculateResources = () => {
    month.increaseMonth();
    gold.calculateGold();
    pop.calculatePop();
    food.calculateFood();
    wood.calculateWood();
    stone.calculateStone();
}

const progressGame = () => {
    checkBeforeResourceCalc(true)    
    calculateResources() 
    printNewMonthMessages()
    checkAfterResourceCalc(true) 
}

// Button event listeners
document.addEventListener('click', (e) => {
    const button = e.target.id
    const btnClass = e.target.className

    // New month and reset buttons
    button === 'btnNewMonth' ? progressGame() : null
    button === 'btnReset' ? (localStorage.removeItem('gameSave'), location.reload()) : null

    btnClass.includes('menuPanel') ? showPanel(e.target.id) : null
    btnClass === 'btnTax' ? changeTax(e.target.id) : null
    btnClass === 'btnBuild' ? startConstruction(e) : null
    btnClass == 'btnDismiss' ? dismissUnits(e.target.id) : null
    btnClass.includes('add-max') ? addRecruits(e.target.id, e, true) : null
    btnClass == 'btnRecruit' ? addRecruits(e.target.id, e, false) : null

    // missions
    button === 'btnAcceptMission' ? removeMission(e.target.parentNode.parentNode.id, true) : null
    button === 'btnRejectMission' ? removeMission(e.target.parentNode.parentNode.id, false) : null
})

import { generateMarkup, showPanel, displayActiveAlerts, printNewMonthMessages, clearMessages } from "./modules/domhelpers.js"
import { checkIfNewGame } from "./modules/utilities.js"
import { changeTax, applyCapitalBonuses, calculateHappiness } from "./modules/valuecalc.js";
import { Capital, House, Farm, Lumberyard, Quarry } from "./modules/buildings.js"
import { Month, Gold, Pop, Food, Wood, Stone } from "./modules/resources.js";

// instantiate classes
const gold = new Gold();
const pop = new Pop();
const month = new Month();
const food = new Food();
const wood = new Wood();
const stone = new Stone();
const capital = new Capital();
const house = new House();
const farm = new Farm();
const lumberyard = new Lumberyard();
const quarry = new Quarry();

// initiates app once page is fully loaded
document.addEventListener('readystatechange', (e) => {
    if (e.target.readyState === "complete") {
        initApp();
    }
});

// initializes the app
const initApp = () => {
    checkIfNewGame()
    checkBeforeResourceCalc(false)
    checkAfterResourceCalc(false)
}

// check before gaining res or at the beginning of teh game
const checkBeforeResourceCalc = (isNewMonth) => {
    showPanel(0)  // show general panel
    checkConstruction(isNewMonth) // progress construction
    applyCapitalBonuses() // apply capital bonuses 
    pop.calculateTotalSpace() // calculates max. available space for pop (from building, capital and settlements)
}

// checks various conditions after gaining resources and run events. Check for events before printing text
const checkAfterResourceCalc = (isNewMonth) => {
    pop.isMaxPop(isNewMonth) // checks if there is a space for population, if not, shows warning
    food.checkIfEnoughFood(pop, isNewMonth) // checks if there is enough food, if not, shows warning
    calculateHappiness()  // calculates happiness based on the conditions calculaed before
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

// checks if any construction is ongoing.
const checkConstruction = (isNewMonth) => {
    if (isNewMonth) {
        capital.progressBuild('buildingCapital')
        house.progressBuild('buildingHouse')
        farm.progressBuild('buildingFarm')
        lumberyard.progressBuild('buildingLumberyard')
        quarry.progressBuild('buildingQuarry')
    }
}

/*
    Progress month:

    0. Clear message box
    1. Progress any active constructions or upgrades and update value accordingly
    2. Apply bonuses from the capital based on the capital's level
    3. Calculate available space for pops
    4. Calculate resource gain / spend:
        a. Increase month
        b. Calculate gold gains / losses
        c. Calculate pop gains / losses (except from events)
        d. Calculate food gains / losses
        e. Calculate other resource gains (wood, stone, metals, runes....)
    5. Print resource gain / loss messages
    6. Check if pop is at or above max space. If the same, triggers the appropriate alert
    7. Check if food status. If the food is low and consumption is equal or higher than production, trigger appropriate alert
    8. Calculate happines based on various conditions (taxes, alerts, etc.). If happiness is at 0, triggers 'Riot' event.
    9. Displays all active alerts
    10. Re-generate DOM with the updated values
*/
const progressGame = () => {
    clearMessages()
    checkBeforeResourceCalc(true)    
    calculateResources() 
    printNewMonthMessages()
    checkAfterResourceCalc(true) 
}

// Button event listeners
document.addEventListener('click', (e) => {
    const button = e.target.id

    // New month and reset buttons
    button === 'btnNewMonth' ? progressGame() : null
    button === 'btnReset' ? (localStorage.removeItem('gameSave'), location.reload()) : null

    // Menu buttons
    button == 'menuBtnGeneral' ? showPanel(0) : null
    button == 'menuBtnManagement' ? showPanel(1) : null
    button == 'menuBtnBuildings' ? showPanel(3) : null
    button == 'menuBtnStatistics' ? showPanel(2) : null
    
    // Tax buttons event listeners
    button === 'btnTaxLow' ? changeTax(1) : null
    button === 'btnTaxBalanced' ? changeTax(2) : null
    button === 'btnTaxHigh' ? changeTax(3) : null

    // build buttons
    button === 'btnbuildingCapital' ? capital.startConstruction(e, 'buildingCapital') : null
    button === 'btnbuildingHouse' ? house.startConstruction(e, 'buildingHouse') : null
    button === 'btnbuildingFarm' ? farm.startConstruction(e, 'buildingFarm') : null
    button === 'btnbuildingLumberyard' ? lumberyard.startConstruction(e, 'buildingLumberyard') : null
    button === 'btnbuildingQuarry' ? quarry.startConstruction(e, 'buildingQuarry') : null
})

import { printText, clearMessages, printMessage, showGeneralPanel, checkActiveAlerts } from "./modules/domhelpers.js"
import { checkIfNewGame, loadGame, saveGame } from "./modules/utilities.js"
import { House, Farm, Lumberyard, Quarry } from "./modules/buildings.js"
import { Month, Gold, Pop, Food, Wood, Stone } from "./modules/resources.js";

const buttons = document.querySelectorAll('button')
const btnBuild = document.querySelectorAll('.btnBuild')
const btnTax = document.querySelectorAll('.btnTax')

// instantiate classes
const gold = new Gold();
const pop = new Pop();
const month = new Month();
const food = new Food();
const wood = new Wood();
const stone = new Stone();
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

// checks if any construction is ongoing. If the game is loaded, disables built button, if next month, progresses the construction
const checkConstruction = (isNewMonth) => {
    btnBuild.forEach(btn => {
        btn.id == 'buildingHouse' ? house.checkIfBeingBuilt(btn, isNewMonth) : null
        btn.id == 'buildingFarm' ? farm.checkIfBeingBuilt(btn, isNewMonth) : null
        btn.id == 'buildingLumberyard' ? lumberyard.checkIfBeingBuilt(btn, isNewMonth) : null
        btn.id == 'buildingQuarry' ? quarry.checkIfBeingBuilt(btn, isNewMonth) : null
    })
}

// Calculate happines. Min 0, max 100. If reach 0 happines, riots will occur (generally pop will die and attack our army. If no army, gold will disappear)
const calculateHappiness = () => {
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

// change tax index (1 = low tax, high happiness; 2 = balanced; 3 = high tax, low happiness)
const changeTax = (id) => {
    let gameData = loadGame()

    id === 'btnTaxLow' ? gameData.general.tax = 1 : null
    id === 'btnTaxBalanced' ? gameData.general.tax = 2 : null
    id === 'btnTaxHigh' ? gameData.general.tax = 3 : null

    saveGame(gameData)
    printText()
}

// check before gaining res or at the beginning of teh game
const checkBeforeGains = (isNewMonth) => {
    showGeneralPanel()
    clearMessages(isNewMonth)
    checkConstruction(isNewMonth) // checks ongoing constructions
    pop.calculateTotalSpace() 
}

// checks various conditions after gaining resources and run events. Check for events before printing text
const checkAfterGains = (isNewMonth) => {
    pop.isMaxPop(isNewMonth)
    food.checkIfEnoughFood(pop, isNewMonth)

    // Should run at the end
    calculateHappiness()
    checkActiveAlerts()
    printText()
}

// initializes the app
const initApp = () => {
    checkIfNewGame()
    checkBeforeGains(false)
    checkAfterGains(false)
}

// progress month
const incmnth = () => {
    checkBeforeGains(true)

    // res gains
    month.increaseMonth();
    gold.calculateGold();
    pop.calculatePop();
    food.calculateFood();
    wood.calculateWood();
    stone.calculateStone();
    printMessage('', 'gains')

    // spendings
    let gameData = loadGame()
    printMessage(`Our people have consumed <span class='text-bold text-yellow'>${gameData.tempData.consumedFood}</span> food.`, 'info')

    // events 
    checkAfterGains(true)
}

// Main buttons event listeners
buttons[0].addEventListener('click', incmnth);
buttons[1].addEventListener('click', () => {
    localStorage.removeItem('gameSave')
    location.reload()
})

// Building buttons event listeners
btnBuild.forEach(btn => {btn.addEventListener('click', (e) => {
    btn.id == 'buildingHouse' ? house.startConstruction(e) : null
    btn.id == 'buildingFarm' ? farm.startConstruction(e) : null
    btn.id == 'buildingLumberyard' ? lumberyard.startConstruction(e) : null
    btn.id == 'buildingQuarry' ? quarry.startConstruction(e) : null
})})

// Tax buttons event listeners
btnTax.forEach(btn => {btn.addEventListener('click', (e) => changeTax(e.target.id))})

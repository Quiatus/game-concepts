import { printText, clearMessages, printMessage, showGeneralPanel, checkActiveAlerts } from "./modules/domhelpers.js"
import { checkIfNewGame, loadGame, saveGame } from "./modules/utilities.js"
import { House, Farm } from "./modules/buildings.js"
import { Month, Gold, Pop, Food, Wood, Stone } from "./modules/resources.js";
import { Alerts } from "./modules/alerts.js";

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
const alerts = new Alerts();

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
    })
}

const calculateHappiness = () => {
    let gameData = loadGame()
    let calculatedHappiness = gameData.basicResources.baseHappiness

    gameData.general.tax === 1 ? calculatedHappiness += 20 : null
    gameData.alerts.famine ? calculatedHappiness -= 10 : null
    gameData.alerts.overpopulation ? calculatedHappiness -= 5 : null
    gameData.general.tax === 3 ? calculatedHappiness -= 20 : null

    calculatedHappiness < 0 ? calculatedHappiness = 0 : null
    calculatedHappiness > 100 ? calculatedHappiness = 100 : null

    gameData.tempData.happiness = calculatedHappiness

    calculatedHappiness > 0 && calculatedHappiness < 20 ? printMessage('Our population is unhappy! Increase happiness of our population, otherwise our people will riot!', 'warning') : null
    calculatedHappiness === 0 ? (
        printMessage('Our population is rioting!', 'critical'),
        gameData.alerts.riot = true
    ) : null

    saveGame(gameData)
}

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
    checkConstruction(isNewMonth)
    pop.calculateTotalSpace()
}

// checks various conditions after gaining resources and run events
const checkAfterGains = (isNewMonth) => {
    pop.isMaxPop(isNewMonth)
    food.checkIfEnoughFood(pop, isNewMonth)
    calculateHappiness()
    checkActiveAlerts(alerts)
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

    month.increaseMonth();
    gold.calculateGold();
    pop.increasePop();
    food.gainFood();
    printMessage('', 'gains')
    food.consumeFood();
    
    checkAfterGains(true)
}

buttons[0].addEventListener('click', incmnth);
buttons[1].addEventListener('click', () => {
    localStorage.removeItem('gameSave')
    location.reload()
})

btnBuild.forEach(btn => {btn.addEventListener('click', (e) => {
    btn.id == 'buildingHouse' ? house.startConstruction(e) : null
    btn.id == 'buildingFarm' ? farm.startConstruction(e) : null
})})

btnTax.forEach(btn => {btn.addEventListener('click', (e) => changeTax(e.target.id))})

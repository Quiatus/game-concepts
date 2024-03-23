import { printText, clearMessages, printMessage, showGeneralPanel, checkActiveAlerts } from "./modules/domhelpers.js"
import { saveGame, checkIfNewGame } from "./modules/utilities.js"
import { House, Farm } from "./modules/buildings.js"
import { Month, Gold, Pop, Food, Wood, Stone } from "./modules/resources.js";
import { Alerts } from "./modules/alerts.js";

const buttons = document.querySelectorAll('button')
const btnBuild = document.querySelectorAll('.btnBuild')

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

const args = {gold, pop, month, food, wood, stone, house, farm, alerts}

document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === "complete") {
        initApp();
    }
});

// checks if any construction is ongoing. If the game is loaded, disables built button, if next month, progresses the construction
const checkConstruction = (nextMonth) => {
    btnBuild.forEach(btn => {
        btn.id == 'btnBuildHouse' ? house.checkIfBeingBuilt(btn, nextMonth) : null
        btn.id == 'btnBuildFarm' ? farm.checkIfBeingBuilt(btn, nextMonth) : null
    })
}

// checks various conditions at the game start
const checkResources = () => {
    pop.isMaxPop(alerts, false)
    food.checkIfEnoughFood(pop, false, alerts)
}

const calculateTotalSpace = () => {
    pop.totalSpace = pop.basicSpace + house.totalSpace()
}

// initializes the app
const initApp = () => {
    showGeneralPanel()

    checkIfNewGame(args)
    checkConstruction(false)
    calculateTotalSpace()
    checkResources()
    checkActiveAlerts(alerts)

    printText(args)
}

const incmnth = () => {
    showGeneralPanel()
    clearMessages()

    checkConstruction(true)
    calculateTotalSpace()

    month.increaseMonth();
    gold.calculateGold(pop.getResource());
    pop.increasePop(alerts);
    food.gainFood(farm);
    printMessage('', 'gains', args)

    food.consumeFood(pop, alerts);
    pop.isMaxPop(alerts, true)

    checkActiveAlerts(alerts)
    printText(args)
    saveGame(args)
}

buttons[0].addEventListener('click', incmnth);
buttons[1].addEventListener('click', () => {
    localStorage.removeItem('gameSave')
    location.reload()
})

btnBuild.forEach(btn => {btn.addEventListener('click', (e) => {
    btn.id == 'btnBuildHouse' ? house.startConstruction(e, args) : null
    btn.id == 'btnBuildFarm' ? farm.startConstruction(e, args) : null
})})

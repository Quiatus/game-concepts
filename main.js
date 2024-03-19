import { printText, clearMessages, printMessage, showGeneralPanel } from "./modules/domhelpers.js"
import { saveGame, checkIfNewGame } from "./modules/utilities.js"
import { House } from "./modules/buildings.js"
import { Month, Gold, Pop, Food, Wood, Stone } from "./modules/resources.js";

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

const args = {gold, pop, month, food, wood, stone, house}

// checks if any construction is ongoing. If the game is loaded, disables built button, if next month, progresses the construction
const checkConstruction = (nextMonth) => {
    house.checkIfBeingBuilt(btnBuild[0], nextMonth)
}

// checks various conditions at the game start
const checkResources = () => {
    pop.isMaxPop()
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
    
    printText(args)
}

const incmnth = () => {
    showGeneralPanel()
    clearMessages()

    checkConstruction(true)
    calculateTotalSpace()

    month.increaseMonth();
    gold.calculateGold(pop.getResource());
    pop.increasePop();

    printText(args)
    printMessage('', 'gains', args)

    saveGame(args)
}

buttons[0].addEventListener('click', incmnth);
buttons[1].addEventListener('click', () => {
    localStorage.removeItem('gameSave')
    location.reload()
})

btnBuild[0].addEventListener('click', (e) => house.startConstruction(e, args))

initApp()
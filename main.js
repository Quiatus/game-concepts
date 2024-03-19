import { printText, clearMessages, printMessage, showGeneralPanel } from "./modules/domhelpers.js"
import { saveGame, checkIfNewGame } from "./modules/utilities.js"
import { House } from "./modules/buildings.js"


class Resource {
    constructor() {
        this.resource = null
        this.resourceChange = null
    }

    getResource() {
        return this.resource
    }

    setResource(amount) {
        this.resource = amount
        saveGame(args)
    }

    getResourceChange() {
        return this.resourceChange
    }

    spendResource(amount) {
        this.resource -= amount
        saveGame(args)
    }

    addResource(amount) {
        this.resource += amount
        saveGame(args)
    }
}

class Month extends Resource{
    constructor() {
        super()
    }

    increaseMonth() {
        this.resource += 1
    }
}

class Gold extends Resource{
     constructor(){
        super()
        this.goldModifiers = [
            {
                id: 1,
                name: 'Base Increase',
                type: 'add',
                active: null,
                value: null
            },
            {
                id: 2,
                name: 'bonus Increase',
                type: 'add',
                active: null,
                value: null
            },
            {
                id: 3,
                name: 'res Increase',
                type: 'multiply',
                active: null,
                value: null
            }, 
            {
                id: 4,
                name: 'steal',
                type: 'substract',
                active: null,
                value: null
            }
        ]
     }

    calculateGold() {
        this.goldModifiers[0].value = this.getGoldFromPop()
        let amount = 0;

        for (let i = 0; i < this.goldModifiers.length; i++) {
            if (this.goldModifiers[i].active) {
                if (this.goldModifiers[i].type === 'add') amount += this.goldModifiers[i].value  
                else if (this.goldModifiers[i].type === 'substract') amount -= this.goldModifiers[i].value
                else if (this.goldModifiers[i].type === 'multiply') amount = Math.round(amount * this.goldModifiers[i].value)
            }
        }
        this.resource += amount
        this.resourceChange = amount
    }

    getGoldFromPop() {
        // each 10 pops generate 1 gold, +- 25%
        const min = Math.floor(pop.getResource() * 0.075);  
        const max = Math.floor(pop.getResource() * 0.125);  
        const addGold = Math.floor(Math.random() * (max - min) + min);
        return addGold;
    }
}

class Pop extends Resource{
    constructor(){
        super()
        this.basicSpace = null
    }

    increasePop() {
        // Pop increase is between 0.1% - 0.5% per month
        const min = Math.floor(this.resource * 0.001);  
        const max = Math.floor(this.resource * 0.005);
        // adds between 2 - 20 pop on the top of the base increase. This is to account for low increase if pop is too low
        const addPop = Math.floor(Math.random() * (max - min) + min) + Math.floor(Math.random() * (21-2) + 2); 

        if (this.resource + addPop >= this.totalSpace()) {
            this.resourceChange = (this.totalSpace() - this.resource)
            this.resource = this.totalSpace()
        } else {
            this.resource += addPop
            this.resourceChange = addPop
        }

        this.isMaxPop()
    }

    isMaxPop() {
        if (this.resource === this.totalSpace()) {
            popText.classList.add('text-red')
            printMessage('Population capacity reached. Build more housing!', 'warning')
        } else if (this.resource > this.totalSpace()) {
            popText.classList.add('text-red')
            printMessage('People have nowhere to live. x people have left. Build more housing!', 'critical')
            // remove x % of pop until pop = max space
        } else {
            popText.classList.remove('text-red')
        }
    }

    totalSpace() {
        return this.basicSpace + house.TotalSpace()
    }
}

class Food extends Resource{
    constructor() {
        super()
    }
}

class Wood extends Resource{
    constructor() {
        super()
    }
}

class Stone extends Resource{
    constructor() {
        super()
    }
}

const buttons = document.querySelectorAll('button');
const btnBuild = document.querySelectorAll('.btnBuild')
const popText = document.getElementById('popText')

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

// initializes the app
const initApp = () => {
    showGeneralPanel()
    checkIfNewGame(args)
    checkConstruction(false)
    checkResources()
    printText(args)
}

const incmnth = () => {
    showGeneralPanel()
    clearMessages()
    checkConstruction(true)

    month.increaseMonth();
    gold.calculateGold();
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
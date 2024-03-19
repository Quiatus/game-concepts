import { initData } from "./modules/initvals.js"
import { printText, clearMessages, printMessage, showGeneralPanel } from "./modules/domhelpers.js"

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
        saveGame()
    }

    getResourceChange() {
        return this.resourceChange
    }

    spendResource(amount) {
        this.resource -= amount
        saveGame()
    }

    addResource(amount) {
        this.resource += amount
        saveGame()
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

class Building {
    constructor() {
        this.name = null
        this.amountBuilt = null
        this.isUnique = null
        this.constructionTime = null
        this.isBeingConstructed = null
        this.constructionProgress = null
        this.buildCostGold = null
        this.buildCostWood = null
        this.buildCostStone = null
        this.requiresPlans = null
        this.plans = null
    }

    initValues(values) {
        this.name = values[0]
        this.amountBuilt = values[1]
        this.isUnique = values[2]
        this.constructionTime = values[3]
        this.isBeingConstructed = values[4]
        this.constructionProgress = values[5]
        this.buildCostGold = values[6]
        this.buildCostWood = values[7]
        this.buildCostStone = values[8]
        this.requiresPlans = values[9]
        this.plans = values[10]
    }

    checkIfCanBuild() {
        let canBuild = true
        let reason = ''

        if (this.isBeingConstructed === true) {
            canBuild = false
            reason = 'Construction already in progress!'
            return [canBuild, reason]
        }

        if (this.buildCostGold > gold.resource) {
            canBuild = false
            reason = 'Not enough gold!'
            return [canBuild, reason]
        }

        if (this.buildCostWood > wood.resource) {
            canBuild = false
            reason = 'Not enough wood!'
            return [canBuild, reason]
        }

        if (this.buildCostStone > stone.resource) {
            canBuild = false
            reason = 'Not enough stone!'
            return [canBuild, reason]
        }

        if (this.amountBuilt === 1 && this.isUnique === true) {
            canBuild = false
            reason = 'We can only build one unique building!'
            return [canBuild, reason]
        }

        if (this.requiresPlans === true && this.plans === 0) {
            canBuild = false
            reason = 'No available space for construction!'
            return [canBuild, reason]
        }

        return [canBuild, reason]
    }

    startConstruction(e) {
        const checkRes = this.checkIfCanBuild()
        
        if (checkRes[0]) {
            e.target.textContent = 'Building in progress'
            e.target.classList.add('btnDisable')
            e.target.disabled = true;

            this.isBeingConstructed = true;

            gold.spendResource(this.buildCostGold)
            wood.spendResource(this.buildCostWood)
            stone.spendResource(this.buildCostStone)

            saveGame()
            printText()
        } else {
            e.target.parentElement.children[0].textContent = checkRes[1]
            e.target.parentElement.children[0].classList.remove('hidden')
            setTimeout(() => {e.target.parentElement.children[0].classList.add('hidden')}, 5000)
        }
    }

    progressBuild(button) {
        if (this.constructionProgress === (this.constructionTime - 1)) {
            button.textContent = 'Begin constructio'
            button.classList.remove('btnDisable')
            button.disabled = false;
            this.isBeingConstructed = false;
            this.constructionProgress = 0;
            this.amountBuilt += 1;
        } else {
            this.constructionProgress += 1
        }
    }

    calculateProgress() {
        return 100 / this.constructionTime * this.constructionProgress
    }

    checkIfBeingBuilt(button, nextMonth) {
        if (this.isBeingConstructed && !nextMonth) {
            button.textContent = 'Building in progress'
            button.classList.add('btnDisable')
            button.disabled = true;
        } else if (this.isBeingConstructed && nextMonth) {
            this.progressBuild(button)
        }
    }
}

class House extends Building {
    constructor(){
        super()
        this.space = null
    }

    setSpace(space) {
        this.space = space
    }

    TotalSpace() {
        return this.space * this.amountBuilt
    }
}

let gameData = {}

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

//saves values from classes, then saves to json
const saveGame = () => {
    gameData.basicResources.month = month.getResource()
    gameData.basicResources.gold = gold.getResource()
    gameData.basicResources.pop = pop.getResource()
    gameData.basicResources.food = food.getResource()
    gameData.basicResources.wood = wood.getResource()
    gameData.basicResources.stone = stone.getResource()
    
    gameData.buildingHouse[1] = house.amountBuilt
    gameData.buildingHouse[4] = house.isBeingConstructed
    gameData.buildingHouse[5] = house.constructionProgress

    localStorage.setItem('gameSave', JSON.stringify(gameData));
}

//loads values from gamedata obj
const loadGame = () => {
    gold.resource = gameData.basicResources.gold
    pop.resource = gameData.basicResources.pop
    pop.basicSpace = gameData.basicResources.basicSpace
    food.resource = gameData.basicResources.food
    month.resource = gameData.basicResources.month
    wood.resource = gameData.basicResources.wood
    stone.resource = gameData.basicResources.stone

    house.initValues(gameData.buildingHouse)
    house.setSpace(gameData.buildingHouse[11])

    for (let i = 0; i < gold.goldModifiers.length; i++) {
        gold.goldModifiers[i].active = gameData.goldModifiers[i+1][0]
        gold.goldModifiers[i].value = gameData.goldModifiers[i+1][1]
    }

    checkConstruction(false)
    checks()
    printText(month, gold, pop, food, wood, stone, house)
}

// checks if any construction is ongoing. If the game is loaded, disables built button, if next month, progresses the construction
const checkConstruction = (nextMonth) => {
    house.checkIfBeingBuilt(btnBuild[0], nextMonth)
}

// checks various conditions at the game start
const checks = () => {
    pop.isMaxPop()
}

// initializes the app
const initApp = () => {
    const load = JSON.parse(localStorage.getItem('gameSave'))
    load 
    ? (
        gameData = load,
        printMessage('Game loaded successfully!')
    ) 
    : (
        gameData = initData,
        localStorage.setItem('gameSave', JSON.stringify(gameData)),
        printMessage('A new game has started. Have fun!')
    )

    showGeneralPanel()
    loadGame()
}

const incmnth = () => {
    showGeneralPanel()
    clearMessages()

    checkConstruction(true)

    month.increaseMonth();
    gold.calculateGold();
    pop.increasePop();

    printText(month, gold, pop, food, wood, stone, house)
    printMessage('', 'gains', {gold, pop})

    saveGame()
}

buttons[0].addEventListener('click', incmnth);
buttons[1].addEventListener('click', () => {
    localStorage.removeItem('gameSave')
    location.reload()
})

btnBuild[0].addEventListener('click', (e) => house.startConstruction(e))

initApp()
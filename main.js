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
            texts.forEach(item => {item.id === 'popText' ? item.classList.add('text-red') : null})
            printMessage('Population capacity reached. Build more housing!', 'warning')
        } else if (this.resource > this.totalSpace()) {
            texts.forEach(item => {item.id === 'popText' ? item.classList.add('text-red') : null})
            printMessage('People have nowhere to live. x people have left. Build more housing!', 'warning')
            // remove x % of pop until pop = max space
        } else {
            texts.forEach(item => {item.id === 'popText' ? item.classList.remove('text-red') : null})
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

const initData = {
    basicResources: {
        month: 0,
        gold: 500,
        pop: 100,
        food: 50,
        wood: 20,
        stone: 5,
        basicSpace: 1000
    },
    goldModifiers: {
        1: [true, 0],
        2: [false, 0],
        3: [false, 1.1],
        4: [false, 20]
    },
    buildingHouse: ['House', 0, false, 2, false, 0, 2500, 5, 0, false, 0, 100]  // Name, amount, unique, time, constructing, progress, gold, wood, stone, require plans, plans, effect
}

let gameData = {}

const buttons = document.querySelectorAll('button');
const messages = document.querySelector('.message-div')
const texts = document.querySelectorAll('span');
const btnBuild = document.querySelectorAll('.btnBuild');
const menuButtons = document.querySelectorAll('.menuBtn');
const rightPanels = document.querySelectorAll('.right-panel');

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
    printText()
}

// checks if any construction is ongoing. If the game is loaded, disables built button, if next month, progresses the construction
const checkConstruction = (nextMonth) => {
    house.checkIfBeingBuilt(btnBuild[0], nextMonth)
}

// checks various conditions at the game start
const checks = () => {
    pop.isMaxPop()
}

const showGeneralPanel = () => {
    rightPanels.forEach(panel => panel.classList.add('none'))
    rightPanels[0].classList.remove('none')
}

// initializes the app
const initApp = () => {
    const load = JSON.parse(localStorage.getItem('gameSave'))
    load ? gameData = load : (
        gameData = initData,
        localStorage.setItem('gameSave', JSON.stringify(gameData))
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

    printText()
    printMessage('', 'gains')

    saveGame()
}

const printText = () => {
    texts.forEach(item => {
        item.id === 'month' ? item.textContent = converThousand(month.getResource()) : null
        item.id === 'gold' ? item.textContent = converThousand(gold.getResource()) : null
        item.id === 'pop' ? item.textContent = converThousand(pop.getResource()) : null
        item.id === 'maxPop' ? item.textContent = ` / ${converThousand(pop.totalSpace())}` : null
        item.id === 'food' ? item.textContent = converThousand(food.getResource()) : null
        item.id === 'wood' ? item.textContent = converThousand(wood.getResource()) : null
        item.id === 'stone' ? item.textContent = converThousand(stone.getResource()) : null

        item.id === 'stat-space-cap' ? item.textContent = converThousand(pop.basicSpace) : null
        item.id === 'stat-space-house' ? item.textContent = converThousand(house.TotalSpace()) : null
        item.id === 'stat-space-total' ? item.textContent = converThousand(pop.totalSpace()) : null
        item.id === 'stat-space-free' ? item.textContent = converThousand(pop.totalSpace() - pop.getResource()) : null
        item.id === 'stat-build-house' ? item.textContent = converThousand(house.amountBuilt) : null

        item.id === 'building-house-cost' 
        ? item.innerHTML = `<span class='text-gold'>${converThousand(house.buildCostGold)}</span>` 
            + (house.buildCostWood > 0 ? ` • <span class='text-brown'>${converThousand(house.buildCostWood)}</span>` : ``)
            + (house.buildCostStone > 0 ? ` • <span class='text-gray'>${converThousand(house.buildCostStone)}</span>` : ``)
        : null

        item.id === 'building-house-constrtime' ? item.textContent = `${converThousand(house.constructionTime)} months` : null
        item.id === 'building-house-built' ? item.textContent = converThousand(house.amountBuilt) : null
        item.id === 'building-house-space' ? item.textContent = converThousand(house.space) : null
        item.id === 'building-house-progress' 
        ? house.isBeingConstructed ? item.textContent = `${house.calculateProgress()} %` : item.textContent = '-'  
        : null
    })
}

const clearMessages = () => {
    let child = messages.lastElementChild;
    while (child) {
        messages.removeChild(child);
        child = messages.lastElementChild;
    }   
}

const newMonthGains = () => {
    let addedGold, addedPop = ''

    gold.getResourceChange() > 0 ? addedGold = `<span class="text-gold text-bold"> ${converThousand(gold.getResourceChange())} </span> gold,` : null
    pop.getResourceChange() > 0 ? addedPop = `<span class="text-purple text-bold"> ${converThousand(pop.getResourceChange())} </span> pops,` : null

    let res = `Gained ${addedPop} ${addedGold}.`.replace(',.', '.').replace(', .', '.')
    const repl = res.lastIndexOf(',')
    repl > 0 ? res = res.substring(0, repl) + ' and ' + res.substring(repl+1) : null

    return res
}

const printMessage = (text, type='info') => {
    const msg = document.createElement('p');
    msg.textContent = text
    if (type==='critical') {
        msg.className = 'text-red'
    } 
    if (type==='warning') {
        msg.className = 'text-orange'
    } 
    if (type==='info') {
        msg.className = 'text-white'
    } 
    if (type==='gains') {
        msg.innerHTML = newMonthGains();
    }

    messages.appendChild(msg)
}

const converThousand = (string) => string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

buttons[0].addEventListener('click', incmnth);
buttons[1].addEventListener('click', () => {
    localStorage.removeItem('gameSave')
    location.reload()
})

btnBuild[0].addEventListener('click', (e) => house.startConstruction(e))

menuButtons.forEach(btn => {btn.addEventListener('click', () => {
    rightPanels.forEach(panel => panel.classList.add('none'))
    btn.id == 'menuBtnGeneral' ? showGeneralPanel() : null
    btn.id == 'menuBtnManagement' ? rightPanels[1].classList.remove('none') : null
    btn.id == 'menuBtnBuildings' ? rightPanels[2].classList.remove('none') : null
})})

initApp()
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
        gameData.basicResources.month = this.resource
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

    calculateGold(currentPop) {
        this.goldModifiers[0].value = this.getGoldFromPop(currentPop)
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

    getGoldFromPop(currentPop) {
        // each 10 pops generate 1 gold, +- 25%
        const min = Math.floor(currentPop * 0.075);  
        const max = Math.floor(currentPop * 0.125);  
        const addGold = Math.floor(Math.random() * (max - min) + min);
        return addGold;
    }

}

class Pop extends Resource{
    constructor(){
        super()
    }

    increasePop(space) {
        // Pop increase is between 0.1% - 0.5% per month
        const min = Math.floor(this.resource * 0.001);  
        const max = Math.floor(this.resource * 0.005);
        // adds between 2 - 20 pop on the top of the base increase. This is to account for low increase if pop is too low
        const addPop = Math.floor(Math.random() * (max - min) + min) + Math.floor(Math.random() * (21-2) + 2); 

        if (this.resource + addPop >= space) {
            this.resourceChange = (space - this.resource)
            this.resource = space
        } else {
            this.resource += addPop
            this.resourceChange = addPop
        }

        this.isMaxPop()
    }

    isMaxPop() {
        this.resource === totalSpace() 
        ? (popText.classList.add('text-red'),
        printMessage('Our people have nowhere to live. Build more housing!', 'warning'))
        : popText.classList.remove('text-red') 
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
            e.target.parentElement.children[1].textContent = checkRes[1]
            e.target.parentElement.children[1].classList.remove('hidden')
            setTimeout(() => {e.target.parentElement.children[1].classList.add('hidden')}, 5000)
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

    hTotalSpace() {
        return this.space * this.amountBuilt
    }
}

const initData = {
    basicResources: {
        month: 0,
        gold: 500,
        pop: 100,
        wood: 20,
        stone: 5,
        basicSpace: 1000
    },
    goldModifiers: {
        1: [true, 0],
        2: [true, 10],
        3: [false, 1.1],
        4: [false, 20]
    },
    buildingHouse: ['House', 0, false, 2, false, 0, 250, 5, 0, 100]  // Name, amount, unique, time, constructing, progress, gold, wood, stone, effect
}

let gameData = {}

const btn = document.getElementById('btn');
const btnRes = document.getElementById('res');
const btnBuildHouse = document.getElementById('btnBuildHouse');

const popText = document.getElementById('pop');

const messages = document.querySelector('.message-div')
const texts = document.querySelectorAll('span');
const buttons = document.querySelectorAll('button');

const gold = new Gold();
const pop = new Pop();
const month = new Month();
const wood = new Wood();
const stone = new Stone();
const house = new House();

const saveGame = () => {
    gameData.basicResources.gold = gold.getResource()
    gameData.basicResources.pop = pop.getResource()
    gameData.basicResources.wood = wood.getResource()
    gameData.basicResources.stone = stone.getResource()
    
    gameData.buildingHouse[1] = house.amountBuilt
    gameData.buildingHouse[4] = house.isBeingConstructed
    gameData.buildingHouse[5] = house.constructionProgress

    localStorage.setItem('testStorage', JSON.stringify(gameData));
}

const loadGame = () => {
    gold.resource = gameData.basicResources.gold
    pop.resource = gameData.basicResources.pop
    month.resource = gameData.basicResources.month
    wood.resource = gameData.basicResources.wood
    stone.resource = gameData.basicResources.stone

    house.initValues(gameData.buildingHouse)
    house.setSpace(gameData.buildingHouse[9])

    for (let i = 0; i < gold.goldModifiers.length; i++) {
        gold.goldModifiers[i].active = gameData.goldModifiers[i+1][0]
        gold.goldModifiers[i].value = gameData.goldModifiers[i+1][1]
    }
}

const checkConstruction = (nextMonth) => {
    house.checkIfBeingBuilt(btnBuildHouse, nextMonth)
}

const initApp = () => {
    const load = JSON.parse(localStorage.getItem('testStorage'))
    load ? gameData = load : (
        gameData = initData,
        localStorage.setItem('testStorage', JSON.stringify(gameData))
    )

    loadGame()
    checkConstruction(false)
    printText()
}

const printText = () => {
    texts.forEach(item => {
        item.id === 'month' ? item.textContent = converThousand(month.getResource()) : null
        item.id === 'gold' ? item.textContent = converThousand(gold.getResource()) : null
        item.id === 'pop' ? item.textContent = `${converThousand(pop.getResource())} / ${converThousand(totalSpace())}` : null
        item.id === 'wood' ? item.textContent = converThousand(wood.getResource()) : null
        item.id === 'stone' ? item.textContent = converThousand(stone.getResource()) : null

        item.id === 'stat-space-cap' ? item.textContent = converThousand(gameData.basicResources.basicSpace) : null
        item.id === 'stat-space-house' ? item.textContent = converThousand(house.hTotalSpace()) : null
        item.id === 'stat-space-total' ? item.textContent = converThousand(totalSpace()) : null
        item.id === 'stat-space-free' ? item.textContent = converThousand(totalSpace() - pop.getResource()) : null
        item.id === 'stat-build-house' ? item.textContent = converThousand(house.amountBuilt) : null

        item.id === 'building-house-cost' 
        ? item.innerHTML = `<span class='text-gold'>${converThousand(house.buildCostGold)}</span>` 
            + (house.buildCostWood > 0 ? ` | <span class='text-brown'>${converThousand(house.buildCostWood)}</span>` : ``)
            + (house.buildCostStone > 0 ? ` | <span class='text-gray'>${converThousand(house.buildCostStone)}</span>` : ``)
        : null

        item.id === 'building-house-constrtime' ? item.textContent = `${converThousand(house.constructionTime)} months` : null
        item.id === 'building-house-built' ? item.textContent = converThousand(house.amountBuilt) : null
        item.id === 'building-house-space' ? item.textContent = converThousand(house.space) : null
        item.id === 'building-house-progress' 
        ? house.isBeingConstructed ? item.textContent = `${house.calculateProgress()} %` : item.textContent = '-'  
        : null
    })
}

const incmnth = () => {
    clearMessages()

    checkConstruction(true)

    month.increaseMonth();
    gold.calculateGold(pop.getResource());
    pop.increasePop(totalSpace());

    printText()
    printMessage('', 'gains')

    saveGame()
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
    if (type==='warning') {
        msg.textContent = text
        msg.className = 'text-red'
    } 
    if (type==='info') {
        msg.textContent = text
    } 
    if (type==='gains') {
        msg.innerHTML = newMonthGains();
    }

    messages.appendChild(msg)
}

const converThousand = (string) => string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const totalSpace = () => {
    return gameData.basicResources.basicSpace + house.hTotalSpace()
}

btn.addEventListener('click', incmnth);

btnRes.addEventListener('click', () => {
    localStorage.removeItem('testStorage')
    location.reload()
})

btnBuildHouse.addEventListener('click', (e) => house.startConstruction(e))

initApp();
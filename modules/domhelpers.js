import { loadGame } from "./utilities.js"

const messages = document.querySelector('.message-div')
const texts = document.querySelectorAll('span')
const menuButtons = document.querySelectorAll('.menuBtn')
const rightPanels = document.querySelectorAll('.right-panel')
const alertsPanel = document.querySelector('.alert-div')
const buildingBox = document.querySelectorAll('.building-div')

const resourcesText = document.getElementById('resourceBox')
const taxBox = document.getElementById('taxBox')

// clears the message box
export const clearMessages = (isNewMonth) => {
    isNewMonth ? messages.innerHTML = '' : null
}

// loops over alerts and checks which are active, then displays those
export const checkActiveAlerts = () => {
    let gameData = loadGame()
    alertsPanel.innerHTML = ''

    for (let alert in gameData.alerts) {
        if (gameData.alerts[alert]) {
            const span = document.createElement('span')
            span.textContent = alert
            alertsPanel.append(span)
        }
    }
}

// prints various messages 
export const printMessage = (text, type='info') => {
    const msg = document.createElement('p');
    msg.innerHTML = text
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



const displayResourceBox = (gameData) => {
    return resourcesText.innerHTML =
    `<div class="res">
    <span class="text-big text-gray">Month: </span><span class="text-big">${converThousand(gameData.basicResources.month)}</span>
    <span class="text-gray">Population: </span><span class="text-bold">${popText(gameData.basicResources.pop, gameData.tempData.totalSpace)}</span>
    <span class="text-gray">Gold: </span><span class="text-bold">${converThousand(gameData.basicResources.gold)}</span>
    <span class="text-gray">Food: </span><span class="text-bold">${converThousand(gameData.basicResources.food)}</span>
    <span class="text-gray">Wood: </span><span class="text-bold">${converThousand(gameData.basicResources.wood)}</span>
    <span class="text-gray">Stone: </span><span class="text-bold">${converThousand(gameData.basicResources.stone)}</span>
    </div>
    <hr>
    <div class="res">
    <span class="text-gray">Fame: </span><span class="text-bold" id="fame">0</span>
    <span class="text-gray">Might: </span><span class="text-bold" id="might">0</span>
    <span class="text-gray">Happiness: </span><span class="text-bold" id="happiness">${changeHappinessColor(gameData.tempData.happiness)}</span>
    <span class="text-gray">Army status: </span><span class="text-bold text-green" id="armyStatus">Ready</span>
    </div>`
}

const displayTaxBox = (gameData) => {
    return taxBox.innerHTML = `<h4 class="text-big">Taxes</h4>
    <div class="build-description">
        <p>Important source of <span class="text-gold text-bold">gold</span>. Increased taxes will negatively affect happiness. Decreased taxes has opposite effect.</p>
    </div>
    <div class="settings-stats">
        <span class="text-gray">Current tax:</span> <span id="tax-level">${changeTaxText(gameData.general.tax)}</span>
        <span class="text-gray">Gold p. 100 pop.:</span><span id="tax-gain">${gameData.general.tax * 5}</span>
    </div>
    <span>Set tax level:</span>
    <div class="settings-buttons">
        <button class="btnTax" id="btnTaxLow">Low</button>
        <button class="btnTax" id="btnTaxBalanced">Balanced</button>
        <button class="btnTax" id="btnTaxHigh">High</button>
    </div>`
}

// Main fuction that changes text fields
export const printText = () => {
    let gameData = loadGame()

    displayResourceBox(gameData)
    displayTaxBox(gameData)
    
    texts.forEach(item => {

        // Settings 
        // item.id === 'tax-level' ? item.innerHTML = changeTaxText(gameData.general.tax) : null
        // item.id === 'tax-gain' ? item.textContent = (gameData.general.tax * 5) : null

        // Statistics text
        item.id === 'stat-space-cap' ? item.textContent = converThousand(gameData.basicResources.basicSpace) : null
        item.id === 'stat-space-house' ? item.textContent = converThousand(gameData.tempData.houseSpace) : null
        item.id === 'stat-space-total' ? item.textContent = converThousand(gameData.tempData.totalSpace) : null
        item.id === 'stat-space-free' ? item.textContent = converThousand(gameData.tempData.totalSpace - gameData.basicResources.pop) : null
        item.id === 'stat-build-house' ? item.textContent = converThousand(gameData.buildingHouse.amount) : null
        item.id === 'stat-build-farm' ? item.textContent = converThousand(gameData.buildingFarm.amount) : null
        item.id === 'stat-build-lumber' ? item.textContent = converThousand(gameData.buildingLumberyard.amount) : null
        item.id === 'stat-build-quarry' ? item.textContent = converThousand(gameData.buildingQuarry.amount) : null
        item.id === 'stat-gen-hap' ? item.innerHTML = changeHappinessColor(gameData.tempData.happiness) : null

        // Economics text
        item.id === 'econ-p-birth' ? gameData.resourceGain.pop > 0 ? item.textContent = converThousand(gameData.resourceGain.pop) : item.textContent = '-' : null
        item.id === 'econ-p-totalgain' ? item.textContent = converThousand(calcEconomy('p')[0]) : null
        item.id === 'econ-p-left' ? gameData.tempData.popLeft > 0 ? item.textContent = converThousand(gameData.tempData.popLeft) : item.textContent = '-' : null
        item.id === 'econ-p-death' ? gameData.tempData.popDied > 0 ? item.textContent = converThousand(gameData.tempData.popDied) : item.textContent = '-' : null
        item.id === 'econ-p-totalloss' ? item.textContent = converThousand(calcEconomy('p')[1]) : null
        item.id === 'econ-p-total' ? item.innerHTML = converThousand(calcEconomy('p')[2]) : null

        item.id === 'econ-g-tax' ? gameData.resourceGain.goldTax > 0 ? item.textContent = converThousand(gameData.resourceGain.goldTax) : item.textContent = '-' : null
        item.id === 'econ-g-totalgain' ? item.textContent = converThousand(calcEconomy('g')[0]) : null
        item.id === 'econ-g-totalloss' ? item.textContent = converThousand(calcEconomy('g')[1]) : null
        item.id === 'econ-g-total' ? item.innerHTML = converThousand(calcEconomy('g')[2]) : null

        item.id === 'econ-f-farm' ? gameData.resourceGain.food > 0 ? item.textContent = converThousand(gameData.resourceGain.food) : item.textContent = '-' : null
        item.id === 'econ-f-totalgain' ? item.textContent = converThousand(calcEconomy('f')[0]) : null
        item.id === 'econ-f-people' ? gameData.tempData.consumedFood > 0 ? item.textContent = converThousand(gameData.tempData.consumedFood) : item.textContent = '-' : null
        item.id === 'econ-f-totalloss' ? item.textContent = converThousand(calcEconomy('f')[1]) : null
        item.id === 'econ-f-total' ? item.innerHTML = converThousand(calcEconomy('f')[2]) : null

        item.id === 'econ-w-lumber' ? gameData.resourceGain.wood > 0 ? item.textContent = converThousand(gameData.resourceGain.wood) : item.textContent = '-' : null
        item.id === 'econ-w-totalgain' ? item.textContent = converThousand(calcEconomy('w')[0]) : null
        item.id === 'econ-w-totalloss' ? item.textContent = converThousand(calcEconomy('w')[1]) : null
        item.id === 'econ-w-total' ? item.innerHTML = converThousand(calcEconomy('w')[2]) : null

        item.id === 'econ-s-quarry' ? gameData.resourceGain.stone > 0 ? item.textContent = converThousand(gameData.resourceGain.stone) : item.textContent = '-' : null
        item.id === 'econ-s-totalgain' ? item.textContent = converThousand(calcEconomy('s')[0]) : null
        item.id === 'econ-s-totalloss' ? item.textContent = converThousand(calcEconomy('s')[1]) : null
        item.id === 'econ-s-total' ? item.innerHTML = converThousand(calcEconomy('s')[2]) : null


        // Building - capital text
        item.id === 'building-capital-level' ? item.textContent = `Level ${gameData.general.capitalLevel}` : null
        item.id === 'building-capital-space' ? item.textContent = converThousand(gameData.basicResources.basicSpace) : null
        item.id === 'building-capital-house' ? item.textContent = '20' : null
        item.id === 'building-capital-cost' ? item.innerHTML = displayBuildCosts(gameData.buildingCapital) : null
        item.id === 'building-capital-constrtime' ? item.textContent = `${converThousand(gameData.buildingCapital.costTime)} months` : null

        // Building - house text
        item.id === 'building-house-cost' ? item.innerHTML = displayBuildCosts(gameData.buildingHouse) : null
        item.id === 'building-house-constrtime' ? item.textContent = `${converThousand(gameData.buildingHouse.costTime)} months` : null
        item.id === 'building-house-amount' ? item.textContent = converThousand(gameData.buildingHouse.amount) : null
        item.id === 'building-house-descr' ? item.textContent = converThousand(gameData.buildingHouse.effect) : null
        item.id === 'building-house-space' ? item.textContent = converThousand(gameData.buildingHouse.space) : null

        // Building - farm text
        item.id === 'building-farm-cost' ? item.innerHTML = displayBuildCosts(gameData.buildingFarm) : null
        item.id === 'building-farm-constrtime' ? item.textContent = `${converThousand(gameData.buildingFarm.costTime)} months` : null
        item.id === 'building-farm-amount' ? item.textContent = converThousand(gameData.buildingFarm.amount) : null
        item.id === 'building-farm-descr' ? item.textContent = converThousand(gameData.buildingFarm.effect) : null
        item.id === 'building-farm-space' ? item.textContent = converThousand(gameData.buildingFarm.space) : null

        // Building - lumberyard text
        item.id === 'building-lumber-cost' ? item.innerHTML = displayBuildCosts(gameData.buildingLumberyard) : null
        item.id === 'building-lumber-constrtime' ? item.textContent = `${converThousand(gameData.buildingLumberyard.costTime)} months` : null
        item.id === 'building-lumber-amount' ? item.textContent = converThousand(gameData.buildingLumberyard.amount) : null
        item.id === 'building-lumber-descr' ? item.textContent = converThousand(gameData.buildingLumberyard.effect) : null
        item.id === 'building-lumber-space' ? item.textContent = converThousand(gameData.buildingLumberyard.space) : null

        // Building - quarry text
        item.id === 'building-quarry-cost' ? item.innerHTML = displayBuildCosts(gameData.buildingQuarry) : null
        item.id === 'building-quarry-constrtime' ? item.textContent = `${converThousand(gameData.buildingQuarry.costTime)} months` : null
        item.id === 'building-quarry-amount' ? item.textContent = converThousand(gameData.buildingQuarry.amount) : null
        item.id === 'building-quarry-descr' ? item.textContent = converThousand(gameData.buildingQuarry.effect) : null
        item.id === 'building-quarry-space' ? item.textContent = converThousand(gameData.buildingQuarry.space) : null

    })
}

// Shows the general panel at the start of game or at teh beginning of month
export const showGeneralPanel = () => {
    rightPanels.forEach(panel => panel.classList.add('none'))
    rightPanels[0].classList.remove('none')
}

// Display unlocked buildings
export const displayBuildingBox = () => {
    let gameData = loadGame()

    buildingBox.forEach(bb => {
        bb.id === 'bdHouse' ? gameData.buildingHouse.isVisible ? bb.classList.remove('none') : bb.classList.add('none') : null
        bb.id === 'bdFarm' ? gameData.buildingFarm.isVisible ? bb.classList.remove('none') : bb.classList.add('none') : null
        bb.id === 'bdLumberyard' ? gameData.buildingLumberyard.isVisible ? bb.classList.remove('none') : bb.classList.add('none') : null
        bb.id === 'bdQuarry' ? gameData.buildingQuarry.isVisible ? bb.classList.remove('none') : bb.classList.add('none') : null
    })
}
 
// Displays active construction
export const buildingConstrProgress = () => {
    const gameData = loadGame()
    buildingBox.forEach(item => {
        const building = gameData[item.id]

        // if the building is being built, hides the button, shows progress bar, calculates teh current progress
        if (building.isBeingBuilt) {
            const progress = 100 / building.costTime * building.buildProgress
            item.lastElementChild.children[0].classList.add('none')
            item.lastElementChild.children[1].classList.remove('none')
            item.lastElementChild.children[1].children[1].textContent = `${building.buildProgress} / ${building.costTime}`
            item.lastElementChild.children[1].children[1].style.background = `linear-gradient(90deg, var(--clr-darkgreen) ${progress}%, transparent ${progress}%)`
        } else {
            item.lastElementChild.children[0].classList.remove('none')
            item.lastElementChild.children[1].classList.add('none')
        }
    })
}

// decimal separator
const converThousand = (string) => string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");


// displays building costs
const displayBuildCosts = (building) => {
    return `<span class='text-gold'>${converThousand(building.costGold)}</span>
     ${building.costWood > 0 ? ` • <span class='text-brown'>${converThousand(building.costWood)}</span>` : ``}
     ${building.costStone > 0 ? ` • <span class='text-gray'>${converThousand(building.costStone)}</span>` : ``}`
}

// display beginning of month gains. Only shows positive gains
const newMonthGains = () => {
    let gameData = loadGame()
    let addedGold = '', addedFood = '', addedPop = '', addedWood = '', addedStone = ''

    gameData.resourceGain.goldTax > 0 ? addedGold = `<span class="text-gold text-bold"> ${converThousand(gameData.resourceGain.goldTax)} </span> gold,` : null
    gameData.resourceGain.pop > 0 ? addedPop = `<span class="text-purple text-bold"> ${converThousand(gameData.resourceGain.pop)} </span> people,` : null
    gameData.resourceGain.food > 0 ? addedFood = `<span class="text-yellow text-bold"> ${converThousand(gameData.resourceGain.food)} </span> food,` : null
    gameData.resourceGain.wood > 0 ? addedWood = `<span class="text-brown text-bold"> ${converThousand(gameData.resourceGain.wood)} </span> wood,` : null
    gameData.resourceGain.stone > 0 ? addedStone = `<span class="text-gray text-bold"> ${converThousand(gameData.resourceGain.stone)} </span> stone,` : null

    // cleanup functions - replaces last , with and removes commas
    let res = `Gained ${addedPop}${addedGold}${addedFood}${addedWood}${addedStone}.`.replace(',.', '.')
    const repl = res.lastIndexOf(',')
    repl > 0 ? res = res.substring(0, repl) + ' and ' + res.substring(repl+1) : null

    return res
}

// changes the color of the happiness text
const changeHappinessColor = (happiness) => {
    if (happiness < 20) {
        return `<span class="text-red">${happiness} %</span>`
    } else if (happiness >= 20 && happiness < 40) {
        return `<span class="text-brown">${happiness} %</span>`
    } else if (happiness >= 40 && happiness < 60) {
        return `<span class="text-gold">${happiness} %</span>`
    } else if (happiness >= 60 && happiness < 80) {
        return `<span class="text-green">${happiness} %</span>`
    } else if (happiness >= 80) {
        return `<span class="text-darkgreen">${happiness} %</span>`
    }
}

// changes the tax level text
const changeTaxText = (tax) => {
    if (tax === 1) {
        return '<span class="text-green">Low</span>'
    } else if (tax === 2) {
        return '<span class="text-gold">Balanced</span>'
    } else if (tax === 3) {
        return '<span class="text-red">High</span>'
    }
}

// changes the color of the pop text
const popText = (pop, space) => {
    if (pop >= space) {
        return `<span class="text-red">${converThousand(pop)}<span class="text-small"> / ${converThousand(space)}</span></span>`
    }
    return `<span>${converThousand(pop)}<span class="text-small"> / ${converThousand(space)}</span></span>`
}

// helper function to display economy stats. Calculates gains and losses and totals the amounts
const calcEconomy = (econType) => {
    let gameData = loadGame()
    let results = [0, 0, ``]
    let total = 0

    // calculate gains and losses
    if (econType === 'p') {
        results[0] = gameData.resourceGain.pop 
        results[1] = gameData.tempData.popDied + gameData.tempData.popLeft
    } else if (econType === 'g') {
        results[0] = gameData.resourceGain.goldTax
    } else if (econType === 'f') {
        results[0] = gameData.resourceGain.food 
        results[1] = gameData.tempData.consumedFood
    } else if (econType === 'w') {
        results[0] = gameData.resourceGain.wood 
    } else if (econType === 's') {
        results[0] = gameData.resourceGain.stone 
    }

    // calculate total
    total = results[0] - results[1]

    // if total is 0, display -
    results[0] === 0 ? results[0] = '-' : null
    results[1] === 0 ? results[1] = '-' : null

    // changes teh text color of total depending wheter the total is gain or loss
    if (total > 0) {
        results[2] = `<span class='text-green'>+ ${total}</span>`
    } else if (total < 0) {
        results[2] = `<span class='text-red'>${total}</span>`
    } else {
        results[2] = `-`
    }

    return results
}

// main menu buttons
menuButtons.forEach(btn => {btn.addEventListener('click', () => {
    rightPanels.forEach(panel => panel.classList.add('none'))
    btn.id == 'menuBtnGeneral' ? showGeneralPanel() : null
    btn.id == 'menuBtnManagement' ? rightPanels[1].classList.remove('none') : null
    btn.id == 'menuBtnBuildings' ? rightPanels[2].classList.remove('none') : null
})})
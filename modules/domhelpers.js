import { loadGame } from "./utilities.js"
import { displayResourceBox, displayTaxBox, displayStatistics, displayEconomy, displayCapital } from "./domgenerators.js"

const messages = document.querySelector('.message-div')
const texts = document.querySelectorAll('span')
const rightPanels = document.querySelectorAll('.right-panel')
const alertsPanel = document.querySelector('.alert-div')
const buildingBox = document.querySelectorAll('.building-div')

// decimal separator
export const converThousand = (string) => string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// clears the message box
export const clearMessages = (isNewMonth) => {
    isNewMonth ? messages.innerHTML = '' : null
}

// Shows the general panel at the start of game or at the beginning of month. Switches to panel based on the button click
export const showPanel = (num) => {
    rightPanels.forEach(panel => panel.classList.add('none'))
    rightPanels[num].classList.remove('none')
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

// loops over alerts and checks which are active, then displays those
export const displayActiveAlerts = () => {
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

// Main fuction that changes text fields
export const printText = () => {
    let gameData = loadGame()

    displayResourceBox(gameData)
    displayTaxBox(gameData)
    displayStatistics(gameData)
    displayEconomy(gameData)
    displayCapital(gameData)

    texts.forEach(item => {
        // Building - capital text


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


// displays building costs
export const displayBuildCosts = (building) => {
    return `<span class='text-gold'>${converThousand(building.costGold)}</span>
     ${building.costWood > 0 ? ` • <span class='text-brown'>${converThousand(building.costWood)}</span>` : ``}
     ${building.costStone > 0 ? ` • <span class='text-gray'>${converThousand(building.costStone)}</span>` : ``}`
}

// display beginning of month gains. Only shows positive gains
const newMonthGains = () => {
    let gameData = loadGame()
    let addedGold = '', addedFood = '', addedPop = '', addedWood = '', addedStone = ''

    gameData.resourceGain.goldTotal > 0 ? addedGold = `<span class="text-gold text-bold"> ${converThousand(gameData.resourceGain.goldTotal)} </span> gold,` : null
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
export const changeHappinessColor = (happiness) => {
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

// changes the color of the pop text
export const popText = (pop, space) => {
    if (pop >= space) {
        return `<span class="text-red">${converThousand(pop)}<span class="text-small"> / ${converThousand(space)}</span></span>`
    }
    return `<span>${converThousand(pop)}<span class="text-small"> / ${converThousand(space)}</span></span>`
}

// helper function to display economy stats. Calculates gains and losses and totals the amounts
export const calcEconomy = (econType) => {
    let gameData = loadGame()
    let results = [0, 0, ``]
    let total = 0

    // calculate gains and losses
    if (econType === 'p') {
        results[0] = gameData.resourceGain.pop 
        results[1] = gameData.tempData.popDied + gameData.tempData.popLeft
    } else if (econType === 'g') {
        results[0] = gameData.resourceGain.goldTotal
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

    // changes the text color of total depending wheter the total is gain or loss
    if (total > 0) results[2] = `<span class='text-green'>+ ${total}</span>`
    else if (total < 0) results[2] = `<span class='text-red'>${total}</span>`
    else results[2] = `<span class='text-white'>0</span>`

    return results
}

// grabs info about capital levels
export const getCapitalInfo = () => {
        let gameData = loadGame()
        const capitalLevel = gameData.general.capitalLevel
        let nextLevel = 'max'
        const currentLevel = gameData.capitalLevels[capitalLevel - 1]
        capitalLevel < 10 ? nextLevel = gameData.capitalLevels[capitalLevel] : null
        
        return {currentLevel, nextLevel}
}
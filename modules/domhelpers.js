import { loadGame } from "./utilities.js"
import { displayResourceBox, displayTaxBox, displayStatistics, displayEconomy, displayCapital, generateBuildings } from "./domgenerators.js"

const messages = document.querySelector('.message-div')
const rightPanels = document.querySelectorAll('.right-panel')
const alertsPanel = document.querySelector('.alert-div')
const buildings = document.getElementById('buildings')

// decimal separator
export const converThousand = (string) => string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

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
        messages.innerHTML = ''
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

// Main fuction that generates markup
export const printText = () => {
    let gameData = loadGame()

    displayResourceBox(gameData)
    displayTaxBox(gameData)
    displayStatistics(gameData)
    displayEconomy(gameData)
    displayCapital(gameData)
    displayBuildings(gameData)
}

// Shows every unlocked building
const displayBuildings = (gameData) => {
    buildings.innerHTML = ''
    for (let i = 0; i < gameData.buildingList.length; i++) {
        let building = gameData[gameData.buildingList[i]]
        if (building.isVisible) {
            const buildDiv = document.createElement('div')
            buildDiv.innerHTML = generateBuildings(building)
            buildings.append(buildDiv)
        }
    }    
}
 
// Displays active construction
export const buildingConstrProgress = (building) => {
    // if the building is being built, hides the button, shows progress bar, calculates teh current progress
    if (!building.isBeingBuilt) {
        return `<div class="build-buttons">
            <span class="text-red error-text-build none"></span>
            <button class="btnBuild" id="btn${building.id}">${building.name === 'Capital' ? `Upgrade` : `Build`} ${building.name}</button>
        </div>`
    } else {
        const progress = 100 / building.costTime * building.buildProgress
        return `<div class="build-progress">
            <span class="text-gray">Progress:</span>
            <div class="progress-bar" style="background: linear-gradient(90deg, var(--clr-blue) ${progress}%, transparent ${progress}%">${building.buildProgress} / ${building.costTime}</div>
        </div>`
    }
}

// displays building costs
export const displayBuildCosts = (building) => {
    
    return `<div class="build-costs text-small">
        <div class="building-cost">
            <div><img class="img-s" src="media/gold.png"><span class="text-gold">${converThousand(building.costGold)}</span></div>
            ${building.costWood > 0 ? `<div><img class="img-s" src="media/wood.png"><span class="text-brown">${converThousand(building.costWood)}</span></div>` : ``}
            ${building.costStone > 0 ? `<div><img class="img-s" src="media/stone.png"><span class="text-darkgray">${converThousand(building.costStone)}</span></div>` : ``}
        </div>

        <div class="building-cost">
            <div><img class="img-s" src="media/month.png"><span>${converThousand(building.costTime)}</span></div>
        </div>
        
    </div>`
}

// display beginning of month gains. Only shows positive gains
const newMonthGains = () => {
    let gameData = loadGame()
    let addedGold = '', addedFood = '', addedPop = '', addedWood = '', addedStone = ''

    gameData.resourceGain.goldTotal > 0 ? addedGold = `<span class="text-gold"> ${converThousand(gameData.resourceGain.goldTotal)} </span> <img class='img-s' src='media/gold.png'>,` : null
    gameData.resourceGain.pop > 0 ? addedPop = `<span class="text-purple"> ${converThousand(gameData.resourceGain.pop)} </span> <img class='img-s' src='media/pop.png'>,` : null
    gameData.resourceGain.food > 0 ? addedFood = `<span class="text-yellow"> ${converThousand(gameData.resourceGain.food)} </span> <img class='img-s' src='media/food.png'>,` : null
    gameData.resourceGain.wood > 0 ? addedWood = `<span class="text-brown"> ${converThousand(gameData.resourceGain.wood)} </span> <img class='img-s' src='media/wood.png'>,` : null
    gameData.resourceGain.stone > 0 ? addedStone = `<span class="text-darkgray"> ${converThousand(gameData.resourceGain.stone)} </span> <img class='img-s' src='media/stone.png'>,` : null

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
        return `<span class="text-orange">${happiness} %</span>`
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
        capitalLevel < 2 ? nextLevel = gameData.capitalLevels[capitalLevel] : null
        
        return {currentLevel, nextLevel}
}

// grabs info about capital levels
export const getArmyStatus = (gameData) => {
    if (gameData.general.armyStatus) return `<span class='text-green'>Ready</span>`
    return `<span class='text-orange'>Exhausted</span>`
}

// display building description
export const displayBuildDescr = (building) => {
    let string = ''
    string = `${building.isUnique ? `Unique - ` : ``}${building.requireSpace ? `Requires space - ` : ``}${building.requireCapitalLevel ? `Requires capital level ${building.requireCapitalLevel} - ` : ``}`
    string = string.substring(0, string.length-3)
    return string
}

// prints messages at the beginning of the month
export const printNewMonthMessages = () => {
    let gameData = loadGame()
    printMessage('', 'gains')
    printMessage(`Our people have consumed <span class='text-yellow'>${gameData.tempData.consumedFood}</span> <img class='img-s' src='media/food.png'>.`, 'info')
}
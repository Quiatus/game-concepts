'use strict';

import { displayResourceBox, displayTaxBox, displayStatistics, displayEconomy, displayCapital, generateBuildings, generateMissions, generateArmy, generateRecruits, displayFoodBox } from "./domgenerators.js"

const messages = document.querySelector('.message-div')
const events = document.querySelector('.event-div')
const rightPanels = document.querySelectorAll('.right-panel')
const alertsPanel = document.querySelector('.alert-div')
const buildings = document.getElementById('buildings')
const menuBtnMissions = document.getElementById('missionsPanel')
const missions = document.getElementById('missions')
const army = document.getElementById('army') 
const recruitment = document.getElementById('recruitment') 
const menuBtnUnlock = document.getElementById('menuBtnUnlock') 

// === UTILITIES ===================================================================================================

// decimal separator
export const converThousand = (string) => string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// changes the color of the happiness text
export const changeHappinessColor = (happiness) => {
    if (happiness < 20) return `<span class="text-red">${happiness} %</span>`
    else if (happiness >= 20 && happiness < 40) return `<span class="text-orange">${happiness} %</span>`
    else if (happiness >= 40 && happiness < 60) return `<span class="text-gold">${happiness} %</span>`
    else if (happiness >= 60 && happiness < 80) return `<span class="text-green">${happiness} %</span>`
    else if (happiness >= 80) return `<span class="text-darkgreen">${happiness} %</span>`
}

// changes the color of the pop text
export const popText = (pop, space) => {
    if (pop >= space)  return `<span class="text-red">${converThousand(pop)}<span class="text-normal"> / ${converThousand(space)}</span></span>`
    return `<span>${converThousand(pop)}<span class="text-normal"> / ${converThousand(space)}</span></span>`
}

// === GENERAL =====================================================================================================

// Shows the general panel at the start of game or at the beginning of month. Switches to panel based on the button click
export const showPanel = (panelName, gameData) => {
    rightPanels.forEach(panel => panel.id === panelName ? panel.classList.remove('none') : panel.classList.add('none'))
    generateMarkup(panelName, gameData)
}

// show menu buttons for unlocked features
export const showMenuButtons = (gameData) => {
    let buttons = null

    let newDiv = document.createElement('div')
    newDiv.classList = 'menu-buttons-section'

    menuBtnUnlock.innerHTML = ''

    if (gameData.buildings[6].amount) {
        buttons = `<span class="menuBtn menuPanel" id="blacksmithPanel">Blacksmith</span>`
        newDiv.innerHTML += buttons
    }

    if (buttons) {
        menuBtnUnlock.append(newDiv)
    }
}

// loops over alerts and checks which are active, then displays those
export const displayActiveAlerts = (gameData) => {
    alertsPanel.innerHTML = ''

    for (let alert in gameData.alerts) {
        const span = document.createElement('span')
        span.textContent = alert
        if (gameData.alerts[alert]) span.classList.add('text-red', 'text-bold')
        alertsPanel.append(span)
    }
}

// Main fuction that generates markup based on which panel is shown
export const generateMarkup = (panel=null, gameData) => {
    displayResourceBox(gameData)

    if (panel === 'empireManagementPanel') {
        displayTaxBox(gameData)
        displayCapital(gameData)
        displayFoodBox(gameData)
    }

    if (panel === 'buildingsPanel') {
        displayBuildings(gameData)
    }

    if (panel === 'missionsPanel') {
        displayMissions(gameData)
    }

    if (panel === 'armyManagementPanel') {
        displayArmy(gameData)
    }

    if (panel === 'recruitmentPanel') {
        displayRecruits(gameData)
    }

    if (panel === 'statisticsPanel') {
        displayStatistics(gameData)
        displayEconomy(gameData)
    }
}

// === MESSAGES ====================================================================================================================

export const clearMessages = (isNewMonth) => {
    messages.innerHTML = ''
}

// display beginning of month gains. Only shows positive gains
const newMonthGains = (gameData) => {
    let addedGold = '', addedFood = '', addedPop = '', addedWood = '', addedStone = ''

    gameData.resourceGain.goldTotal > 0 ? addedGold = `<span class="text-gold"> ${converThousand(gameData.resourceGain.goldTotal)} </span> <img class='img-s' src='media/res/gold.png'>,` : null
    gameData.resourceGain.pop > 0 ? addedPop = `<span class="text-purple"> ${converThousand(gameData.resourceGain.pop)} </span> <img class='img-s' src='media/res/pop.png'>,` : null
    gameData.resourceGain.food > 0 ? addedFood = `<span class="text-yellow"> ${converThousand(gameData.resourceGain.food)} </span> <img class='img-s' src='media/res/food.png'>,` : null
    gameData.resourceGain.wood > 0 ? addedWood = `<span class="text-brown"> ${converThousand(gameData.resourceGain.wood)} </span> <img class='img-s' src='media/res/wood.png'>,` : null
    gameData.resourceGain.stone > 0 ? addedStone = `<span class="text-darkgray"> ${converThousand(gameData.resourceGain.stone)} </span> <img class='img-s' src='media/res/stone.png'>,` : null

    // cleanup functions - replaces last , with and removes commas
    let res = `Gained ${addedPop}${addedGold}${addedFood}${addedWood}${addedStone}.`.replace(',.', '.')
    const repl = res.lastIndexOf(',')
    repl > 0 ? res = res.substring(0, repl) + ' and ' + res.substring(repl+1) : null

    return res
}

// prints messages at the beginning of the month
export const printNewMonthMessages = (gameData) => {
    printMessage('', 'gains', gameData)
    printMessage(`Our population is consuming <span class='text-yellow'>${gameData.tempData.consumedFood}</span> <img class='img-s' src='media/res/food.png'>.`, 'info', gameData)
    if (gameData.tempData.armyUpkeep > 0) printMessage(`The army upkeep is <span class='text-gold'>${gameData.tempData.armyUpkeep}</span> <img class='img-s' src='media/res/gold.png'>.`, 'info', gameData)
}

// prints various messages 
export const printMessage = (text, type='info', gameData={}) => {
    const msg = document.createElement('p');
    msg.innerHTML = text
    if (type==='critical')  msg.className = 'text-red'
    if (type==='warning') msg.className = 'text-orange'
    if (type==='info') msg.className = 'text-white'
    if (type==='recruit') msg.className = 'text-green'
    if (type==='gains') msg.innerHTML = newMonthGains(gameData)

    messages.appendChild(msg)
}

// === STATISTICS ================================================================================================================

// helper function to display economy stats. Calculates gains and losses and totals the amounts
export const calcEconomy = (econType, gameData) => {
    let results = [0, 0, ``]
    let total = 0

    // calculate gains and losses
    if (econType === 'p') {
        results[0] = gameData.resourceGain.pop 
        results[1] = gameData.tempData.popDied + gameData.tempData.popLeft
    } else if (econType === 'g') {
        results[0] = gameData.tempData.totalGoldGain
        results[1] = gameData.tempData.armyUpkeep + gameData.tempData.goldStolen
    } else if (econType === 'f') {
        results[0] = gameData.resourceGain.food + gameData.resourceGain.foodEvents
        results[1] = gameData.tempData.consumedFood + gameData.tempData.foodStolen
    } else if (econType === 'w') {
        results[0] = gameData.resourceGain.wood + gameData.resourceGain.woodEvents
    } else if (econType === 's') {
        results[0] = gameData.resourceGain.stone + gameData.resourceGain.stoneEvents
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
export const getArmyStatus = (gameData) => {
    if (gameData.general.armyStatus) return `<span class='text-green'>Ready</span>`
    return `<span class='text-orange'>Exhausted</span>`
}


// === BUILDINGS =================================================================================================================

// Shows every unlocked building
const displayBuildings = (gameData) => {
    const buildingTypes = ['General', 'Resource', 'Military']
    buildings.innerHTML = ''
    for (let item of buildingTypes) {
        buildings.innerHTML += `<p class='mtbb text-big'>${item} buildings</p>`
        let buildingSubdiv = document.createElement('div')
        buildingSubdiv.classList = 'smallBoxDiv'
    
        for (let building of gameData.buildings) {
            if (building.isVisible && building.buildingType === item) {
                const buildDiv = document.createElement('div')
                buildDiv.innerHTML = generateBuildings(building, gameData.buildings[0].currentLevel)
                buildingSubdiv.append(buildDiv)
            }
        }    
        buildings.append(buildingSubdiv)
    }
}

// Displays active construction
export const buildingConstrProgress = (building, level=null) => {
    // if the building is being built, hides the button, shows progress bar, calculates teh current progress
    // If we cannot built due to missing space / unqiue building, shows the message instead of the button
    if (!building.isBeingBuilt) {
        // Check if the unique building is already built
        if (building.amount === 1 && building.isUnique && !building.isUpgradeable) {
            return `<div class="build-buttons">
            <span class="text-bold text-small text-75">We can build only one ${building.name}</span>
            </div>`
        // Check if upgradeable builsing is at max level
        } else if (building.currentLevel === building.maxLevel && building.isUpgradeable) {
            return `<div class="build-buttons">
            <span class="text-bold text-orange text-75">${building.name} is at max level</span>
            </div>`
        // Check if there is enough space to built
        }else if (building.requireCapitalLevel > level) {
            return `<div class="build-buttons">
            <span class="text-bold text-small text-75">Capital level ${building.requireCapitalLevel} required.</span>
            </div>`
        // Check if there is enough space to built
        } else if (building.requireSpace && building.maxSpace === building.amount && !building.isUpgradeable) {
            return `<div class="build-buttons">
            <span class="text-bold text-small text-75">We don't have space to built more ${building.name}s</span>
            </div>`
        // If all conditions are met, displays build button
        } else {
            return `<div class="build-buttons">
            <span class="text-red error-text-build none"></span>
            <button class="btnBuild" id="${building.id}">${(building.isUpgradeable && building.amount === 1) ? `Upgrade` : `Build`} ${building.name}</button>
            </div>`
        }
    } else {
        const progress = 100 / building.costTime * building.buildProgress
        return `<div class="build-progress">
            <span class="text-gray">Progress:</span>
            <div class="progress-bar" style="background: linear-gradient(90deg, var(--clr-progress) ${progress}%, transparent ${progress}%">${building.buildProgress} / ${building.costTime}</div>
        </div>`
    }
}

// displays building costs
export const displayBuildCosts = (building) => {    
    return `<div class="build-costs">
        <div class="resource-box">
            <div><img class="img-s" src="media/res/gold.png"><span class="text-gold">${converThousand(building.costGold)}</span></div>
            ${building.costWood > 0 ? `<div><img class="img-s" src="media/res/wood.png"><span class="text-brown">${converThousand(building.costWood)}</span></div>` : ``}
            ${building.costStone > 0 ? `<div><img class="img-s" src="media/res/stone.png"><span class="text-darkgray">${converThousand(building.costStone)}</span></div>` : ``}
        </div>

        <div class="resource-box">
            <div><img class="img-s" src="media/res/month.png"><span>${converThousand(building.costTime)}</span></div>
        </div>
        
    </div>`
}

// display building description
export const displayBuildDescr = (building) => {
    let string = ''
    string = `${building.isUnique ? `Unique - ` : ``}${building.requireSpace ? `Requires space - ` : ``}${building.isUpgradeable ? `Can be upgraded - ` : ``}`
    string = string.substring(0, string.length-3)
    return string
}

// === EVENT & MISSION ===========================================================================================================

export const showMissionNumber = (gameData) => {
    menuBtnMissions.textContent = `Missions (${gameData.tempData.activeMissions})`
}

// Shows active missions
const displayMissions = (gameData) => {
    missions.innerHTML = `<p class='mtbb text-big'>Active missions: ${gameData.tempData.activeMissions} / ${gameData.general.maxMissions}</p>`
    const missionSubdiv = document.createElement('div')
    missionSubdiv.classList = 'smallBoxDiv'
    
    for (let event of gameData.events) {
        if (event.active && event.isMission) {
            const missionDiv = document.createElement('div')
            const mission = event
            missionDiv.innerHTML = generateMissions(mission)
            missionSubdiv.append(missionDiv)
        }
    }  

    missions.append(missionSubdiv)
}

// displays active events
export const displayActiveEvents = (isNewMonth, gameData) => {
    events.innerHTML = ''
    // searches for active events
    for (let event of gameData.events) {
        if (event.active) {
            if (isNewMonth) events.append(generateEventMessage(event))
            if (!isNewMonth && event.isTimed) events.append(generateEventMessage(event))
        }
    }
}

// generates the event message based on the event type
const generateEventMessage = (event) => {
    let message = document.createElement('p');
    const descrID = Math.floor(Math.random() * event.description.length)
    if (event.isTimed && !event.isMission) message.innerHTML = `<span class='text-orange text-bold'>Event: </span>${event.description[descrID].replace('#effect#', eventText(event))} <span class='text-it'>( Remaining time: <span class='text-bold'>${event.remainingTime}</span> )</span>.`
    else if (event.isMission && event.isDisplayed) message.innerHTML = `<span class='text-orange text-bold'>Misson: </span>${event.description[descrID].replace('#effect#', eventText(event))}`
    else if (event.isMission && !event.isDisplayed) message.innerHTML = ``
    else message.innerHTML = `<span class='text-orange text-bold'>Discovery: </span>${event.description[descrID].replace('#effect#', eventText(event))}` 
    return message
}

// adds icon if the event is a resource
const eventText = (event) => {
    if (event.type === 'gainGold') return `<span class="text-gold"> ${converThousand(event.effect)} </span><img class="img-s" src="media/res/gold.png">`
    if (event.type === 'gainStone') return `<span class="text-darkgray"> ${converThousand(event.effect)} </span><img class="img-s" src="media/res/stone.png">`
    if (event.type === 'gainWood') return `<span class="text-brown"> ${converThousand(event.effect)} </span><img class="img-s" src="media/res/wood.png">`
    if (event.type === 'gainFood') return `<span class="text-yellow"> ${converThousand(event.effect)} </span><img class="img-s" src="media/res/food.png">`
    if (event.type === 'gainFarmSpace') return `<span class="text-yellow"> Farm </span>`
    if (event.type === 'gainLumberSpace') return `<span class="text-brown"> Lumber yard </span>`
    if (event.type === 'gainQuarrySpace') return `<span class="text-darkgray"> Quarry </span>`
}

// shows approx. time left of the mission
export const displayRemainingTimeMission = (time) => {
    if (time > 100) return `100 > <img class='img-s' src='media/res/month.png'>`
    if (time > 50 && time <= 100) return `50 - 100 <img class='img-s' src='media/res/month.png'>`
    if (time > 25 && time <= 50) return `25 - 50 <img class='img-s' src='media/res/month.png'>`
    if (time > 10 && time <= 25) return `10 - 25 <img class='img-s' src='media/res/month.png'>`
    if (time <= 10 ) return `< 10 <img class='img-s' src='media/res/month.png'>`
}

// displays mission rewards
export const displayMissionReward = (rewards) => { 
    let div = document.createElement('div')

    for (let [reward, amount] of rewards) {
        let sub = document.createElement('div')
        
        if (reward === 'pop') sub.innerHTML = `<img class="img-s" src="media/res/pop.png"><span class="text-purple">${converThousand(amount)}</span>`
        if (reward === 'gold') sub.innerHTML = `<img class="img-s" src="media/res/gold.png"><span class="text-gold">${converThousand(amount)}</span>`
        if (reward === 'food') sub.innerHTML = `<img class="img-s" src="media/res/food.png"><span class="text-yellow">${converThousand(amount)}</span>`
        if (reward === 'fame') sub.innerHTML = `<img class="img-s" src="media/res/fame.png"><span class="text-white">${converThousand(amount)}</span>`

        div.append(sub)
    }
    
    return div.innerHTML
}

// === ARMY =================================================================================================================

// generate unit box for each unit that amount is bigger than 0
const displayArmy = (gameData) => {
    army.innerHTML = ''
    for (let unit of gameData.units) {
        if (unit.amount) {
            const unitDiv = document.createElement('div')
            unitDiv.innerHTML = generateArmy(unit)
            army.append(unitDiv)
        }
    }    
}

// generate unit description
export const displayUnitDescription = (unit) => {
    let magical = 'Non-magical'
    let type = ''
    let element = 'General'

    if (unit.magic) magical = `<span class='text-blue'>Magical</span>`

    if (unit.attackType === 1) type = 'Heavy'
    else if (unit.attackType === 2) type = 'Range'
    else if (unit.attackType === 3) type = 'Support'
    else if (unit.attackType === 4) type = 'Melee'

    return `${type} - ${element} - ${magical}`
}

// === RECRUITMENT ============================================================================================================

// generate unit box for each unit that is recruitable
const displayRecruits = (gameData) => {
    recruitment.innerHTML = ''
    for (let unit of gameData.units) {
        if (unit.isRecruitable) {
            const unitDiv = document.createElement('div')
            unitDiv.innerHTML = generateRecruits(unit, gameData)
            recruitment.append(unitDiv)
        }
    }    
}
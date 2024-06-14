import { changeTax, changeFoodLevel, changeProductionLevel } from '../general.js'
import { removeMission } from "../features/events.js"
import { dismissUnits, addRecruits } from "../features/units.js"

import { displayMission, showActiveMissions } from './missions.js';
import { displayArmy, showArmyUnits } from './army.js';
import { displayRecruitment, showRecruitableUnits } from './recruit.js';
import { displayConquest } from './conquest.js'
import { displayCampaign } from './campaign.js'
import { displayBlacksmith } from './blacksmith.js'
import { displayTavern, showTavernVisitors } from './tavern.js'
import { displayBuildings, showUnlockedBuildings } from './buildings.js'
import { displayStatistics } from './stats.js'
import { displayEmpireManagement } from './empire.js'
import { displayResourceBox } from './resources.js'
import { displayOverview, displayMessages, displayActiveEvents } from './overview.js';

// decimal separator - uses local number format. If for whaterver reason the app cannot get the local format, uses regex 
export const converThousand = (string) => {
    const locale = navigator.language
    if (locale) return new Intl.NumberFormat(locale).format(string)
    else return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Shows the general panel at the start of game or at the beginning of month. Switches to panel based on the button click
export const showPanel = (panelName, gameData, isNewMonth=false) => {
    displayResourceBox(gameData)
    
    if (panelName === 'overviewPanel') {
        displayOverview(isNewMonth)
        displayMessages(gameData)
        displayActiveEvents(gameData, isNewMonth) 
    }
    if (panelName === 'empireManagementPanel') {
        displayEmpireManagement(gameData)
        document.querySelector('#btnReset').addEventListener('click', () => {localStorage.removeItem('gameSave'), location.reload()})
        document.querySelectorAll('.btnTax').forEach(item => item.addEventListener('click', (e) => {changeTax(e.target.id, gameData)}))
        document.querySelectorAll('.btnFood').forEach(item => item.addEventListener('click', (e) => {changeFoodLevel(e.target.id, gameData)}))
        document.querySelectorAll('.btnProduction').forEach(item => item.addEventListener('click', (e) => {changeProductionLevel(e.target.id, gameData)}))
    }
    if (panelName === 'statisticsPanel') displayStatistics(gameData)

    if (panelName === 'buildingsPanel') {
        displayBuildings(gameData)
        showUnlockedBuildings(gameData)
    }
    if (panelName === 'tavernPanel') {
        displayTavern(gameData)
        showTavernVisitors(gameData)
    }
    if (panelName === 'blacksmithPanel') displayBlacksmith(gameData)
    if (panelName === 'campaignPanel') displayCampaign(gameData)
    if (panelName === 'missionsPanel') {
        displayMission(gameData) 
        showActiveMissions(gameData)
        document.querySelectorAll('.btnMission').forEach(item => item.addEventListener('click', (e) => {removeMission(e, gameData)}))
    } 
    if (panelName === 'conquestsPanel') displayConquest(gameData)
    if (panelName === 'recruitmentPanel') {
        displayRecruitment(gameData)
        showRecruitableUnits(gameData) 
        document.querySelectorAll('.add-max').forEach(item => item.addEventListener('click', (e) => {addRecruits(e.target.id, e, true, gameData)}))
        document.querySelectorAll('.btnRecruit').forEach(item => item.addEventListener('click', (e) => {addRecruits(e.target.id, e, false, gameData)}))
    }
    if (panelName === 'armyManagementPanel') {
        displayArmy(gameData)
        showArmyUnits(gameData)
        document.querySelectorAll('.btnDismiss').forEach(item => item.addEventListener('click', (e) => {dismissUnits(e.target.id, gameData)}))
    }
}

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
    let clr = ''
    if (type==='critical')  clr = 'text-red'
    if (type==='warning') clr = 'text-orange'
    if (type==='info') clr = 'text-white'
    if (type==='reward') clr = 'text-green'
    if (type==='gains') text = newMonthGains(gameData)

    let message = [text, clr]

    gameData.tempData.messages.push(message)
}

export const displayMenu = (gameData) => {
    const menuGenerate = document.getElementById('menuGenerate')
    return menuGenerate.innerHTML = 
    `<div class="menu-buttons-section">
        <span class="menuBtn" id="overviewPanel">Overview</span>
        <span class="menuBtn" id="empireManagementPanel">Empire management</span>
        <span class="menuBtn" id="statisticsPanel">Statistics</span>
    </div>

    <div class="menu-buttons-section">
        <span class="menuBtn" id="buildingsPanel">Buildings</span>
        ${gameData.buildings[6].amount ? `<span class="menuBtn" id="blacksmithPanel">Blacksmith</span>` : ``}
        ${gameData.buildings[7].amount ? `<span class="menuBtn" id="tavernPanel">Tavern</span>` : ``}
    </div>

    <div class="menu-buttons-section">
        <span class="menuBtn" id="campaignPanel">Campaign</span>
        <span class="menuBtn" id="missionsPanel">Missions (${gameData.tempData.activeMissions})</span>
        <span class="menuBtn" id="conquestsPanel">Conquests</span>
    </div>

    <div class="menu-buttons-section">
        <span class="menuBtn" id="recruitmentPanel">Recruitment</span>
        <span class="menuBtn" id="armyManagementPanel">Army overview</span>
    </div>
    `
}
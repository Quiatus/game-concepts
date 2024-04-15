'use strict';
import { popText, changeHappinessColor, calcEconomy, converThousand, displayBuildCosts, buildingConstrProgress, getArmyStatus, displayBuildDescr, displayRemainingTimeMission, displayMissionReward, displayUnitDescription } from "./domhelpers.js"
import { calcMaxUnit } from "./units.js"

const resourcesText = document.getElementById('resourceBox')
const taxBox = document.getElementById('taxBox')
const foodBox = document.getElementById('foodBox')
const statistics = document.getElementById('statistics')
const economy = document.getElementById('economy')
const capital = document.getElementById('buildingCapital') 

// Generates resource box
export const displayResourceBox = (gameData) => {    
    return resourcesText.innerHTML =
    `<div class="res res-nm"><img class='img-m' src='media/res/month.png' title='Month'><span title='Month' class='text-bold'>${converThousand(gameData.basicResources.month)}</span></div>
    <div class="res res-b"><img title='Current population / Max population' class='img-m' src='media/res/pop.png'><span title='Current population / Max population' class='text-purple'>${popText(gameData.basicResources.pop, gameData.tempData.totalSpace)}</span></div>
    <div class="res"><img title='Gold' class='img-m' src='media/res/gold.png'><span title='Gold' class='text-gold'>${converThousand(gameData.basicResources.gold)}</span></div>
    <div class="res"><img title='Food' class='img-m' src='media/res/food.png'><span title='Food' class='text-yellow'>${converThousand(gameData.basicResources.food)}</span></div>
    <div class="res res-nm"><img title='Wood' class='img-m' src='media/res/wood.png'><span title='Wood' class='text-brown'>${converThousand(gameData.basicResources.wood)}</span></div>
    <div class="res res-nm"><img title='Stone' class='img-m' src='media/res/stone.png'><span title='Stone' class='text-darkgray'>${converThousand(gameData.basicResources.stone)}</span></div>
    <div class="res hr"><img title='Fame' class='img-m' src='media/res/fame.png'><span title='Fame'>${converThousand(gameData.basicResources.fame)}</span></div>
    <div class="res"> <img title='Might' class='img-m' src='media/army/army.png'><span title='Might'>${converThousand(gameData.tempData.might)}</span></div>
    <div class="res res-nm"> <img title='Happiness' class='img-m' src='media/res/fame.png'><span title='Happiness' class='text-bold'>${changeHappinessColor(gameData.tempData.happiness)}</span></div>
    <div class="res res-nm"><img title='Army status' class='img-m' src='media/army/army_status.png'><span title='Army status' class="text-bold">${getArmyStatus(gameData)}</span></div>`
}

// changes the tax level text
export const displayTaxBox = (gameData) => {
    let taxText = ''

    // change the text base on tax level
    if (gameData.general.tax === 1) taxText = '<span class="text-green">Low</span>'
    else if (gameData.general.tax === 2) taxText = '<span class="text-gold">Balanced</span>'
    else taxText = '<span class="text-red">High</span>'

    // markup
    return taxBox.innerHTML = `<h2>Taxes</h2>
    <div class="build-description">
        <p>Important source of <span class="text-gold text-bold">gold</span>. High taxes negatively affect happiness. Low taxes have the opposite effect.</p>
    </div>
    <div class="box-stats mtb">
        <span class="text-gray">Current tax:</span> <span>${taxText}</span>
        <span class="text-gray">Gold p. 100 pop.:</span><span>${gameData.general.tax * 5}</span>
    </div>
    <hr class="separator">
    <span>Set tax level:</span>
    <div class="buttons-box">
        <button class="btnTax" id="taxLow">Low</button>
        <button class="btnTax" id="taxBalanced">Balanced</button>
        <button class="btnTax" id="taxHigh">High</button>
    </div>`
}

// changes the food box
export const displayFoodBox = (gameData) => {
    let foodLevel = ''

    // change the text base on food level
    if (gameData.general.foodLevel === 1) foodLevel = '<span class="text-red">Limited</span>'
    else if (gameData.general.foodLevel === 2) foodLevel = '<span class="text-yellow">Normal</span>'
    else foodLevel = '<span class="text-green">Generous</span>'

    // markup
    return foodBox.innerHTML = `<h2>Food rationing</h2>
    <div class="build-description">
        <p>Increase or decrease the <span class="text-yellow text-bold">food</span> rations for our population. Limited rations decrease happiness and population growth, generous rations increase happiness and population growth.</p>
    </div>
    <div class="box-stats mtb">
        <span class="text-gray">Current rations:</span> <span>${foodLevel}</span>
        <span class="text-gray">Food p. 100 pop.:</span><span>${gameData.general.foodLevel * 0.5}</span>
        <span class="text-gray">Population growth:</span>${
            gameData.general.foodLevel === 1 ? `<span class="text-red">75%</span>` : gameData.general.foodLevel === 2 ? `<span class="text-white">100%</span>` : `<span class="text-green">125%</span>`
        }
    </div>
    <hr class="separator">
    <span>Set rationing level:</span>
    <div class="buttons-box">
        <button class="btnFood" id="foodLow">Limited</button>
        <button class="btnFood" id="foodBalanced">Normal</button>
        <button class="btnFood" id="foodHigh">Generous</button>
    </div>`
}

// Display statistics
export const displayStatistics = (gameData) => {
    return statistics.innerHTML = `
    <div>
        <p class="stat-header">General:</p>
        <div class="stat-div">
            <span class="text-gray">Fame:</span><span>${converThousand(gameData.basicResources.fame)}</span>
            <span class="text-gray">Happiness:</span><span>${changeHappinessColor(gameData.tempData.happiness)}</span>
            <span class="text-gray">Might:</span><span>${converThousand(gameData.tempData.might)}</span>
            <span class="text-gray">Army:</span><span>${getArmyStatus(gameData)}</span>
        </div>
    </div>

    <div>
        <p class="stat-header">Space:</p>
        <div class="stat-div">
            <span class="text-gray">Capital:</span><span>${converThousand(gameData.basicResources.basicSpace)}</span>
            <span class="text-gray">Housing distr:</span><span>${converThousand(gameData.tempData.houseSpace)}</span>
            <span class="text-gray">Settlements:</span><span>0</span>
            <span class="text-gray">Total space:</span><span>${converThousand(gameData.tempData.totalSpace)}</span>
            <span class="text-gray">Free space:</span><span>${converThousand(gameData.tempData.totalSpace - gameData.basicResources.pop)}</span>
        </div>
    </div>

    <div>
        <p class="stat-header">Buildings:</p>
        <div class="stat-div">
            <span class="text-gray">Housing distr:</span><span>${converThousand(gameData.buildings[1].amount)}</span>
            <span class="text-gray">Farms:</span><span>${converThousand(gameData.buildings[2].amount)}</span>
            <span class="text-gray">Lumber yards:</span><span>${converThousand(gameData.buildings[3].amount)}</span>
            <span class="text-gray">Quarries:</span><span>${converThousand(gameData.buildings[4].amount)}</span>
        </div>
    </div>    

    <div>
        <p class="stat-header">Settlements:</p>
        <div class="stat-div">
            <span class="text-gray">Villages:</span><span id="stat-settlement-village">0</span>
            <span class="text-gray">Towns:</span><span id="stat-settlement-town">0</span>
            <span class="text-gray">Cities:</span><span id="stat-settlement-city">0</span>
        </div>
    </div> 
    `
}

// Display economy info
export const displayEconomy = (gameData) => {
    return economy.innerHTML =
    `
    <div>
    <p class="stat-header">People:</p>
    <div class="economy-div">
        <span class="text-white spread">Gains</span>
        <span class="text-gray ml">Births:</span><span class="text-green">${converThousand(gameData.resourceGain.pop)}</span>
        <span class="text-white">Total:</span><span class="text-bold text-green">${converThousand(calcEconomy('p')[0])}</span>
    </div>
    <div class="economy-div">
        <span class=" text-white spread">Loses</span>
        <span class="text-gray ml">Left:</span><span class="text-red">${converThousand(gameData.tempData.popLeft)}</span>
        <span class="text-gray ml">Deaths:</span><span class="text-red">${converThousand(gameData.tempData.popDied)}</span>
        <span class="text-white">Total:</span><span class="text-bold text-red">${converThousand(calcEconomy('p')[1])}</span>
    </div>
    <div class="economy-div">
        <span class="text-white text-bold">Difference:</span><span class="text-bold">${converThousand(calcEconomy('p')[2])}</span>
    </div>
</div>

<div>
    <p class="stat-header">Gold:</p>
    <div class="economy-div">
        <span class="text-white spread">Income</span>
        <span class="text-gray ml">Taxes:</span><span class="text-green">${converThousand(gameData.resourceGain.goldTax)}</span>
        <span class="text-gray ml">Trade:</span><span class="text-green">${converThousand(gameData.tempData.commerce)}</span>
        <span class="text-gray ml">Events:</span><span class="text-green">${converThousand(gameData.resourceGain.goldEvents)}</span>
        <span class="text-white">Total:</span><span class="text-bold text-green">${converThousand(calcEconomy('g')[0])}</span>
    </div>
    <div class="economy-div">
        <span class=" text-white spread">Expenditures</span>
        <span class="text-gray ml">Army upkeep:</span><span class="text-red">${converThousand(gameData.tempData.armyUpkeep)}</span>
        <span class="text-gray ml">Stolen:</span><span class="text-red">${converThousand(gameData.tempData.goldStolen)}</span>
        <span class="text-white">Total:</span><span class="text-bold text-red">${converThousand(calcEconomy('g')[1])}</span>
    </div>
    <div class="economy-div">
        <span class="text-white text-bold">Difference:</span><span class="text-bold">${converThousand(calcEconomy('g')[2])}</span>
    </div>
</div>

<div>
    <p class="stat-header">Food:</p>
    <div class="economy-div">
        <span class="text-white spread">Gains</span>
        <span class="text-gray ml">Farms:</span><span class="text-green">${converThousand(gameData.resourceGain.food)}</span>
        <span class="text-gray ml">Events:</span><span class="text-green">${converThousand(gameData.resourceGain.foodEvents)}</span>
        <span class="text-white">Total:</span><span class="text-bold text-green">${converThousand(calcEconomy('f')[0])}</span>
    </div>
    <div class="economy-div">
        <span class=" text-white spread">Loses</span>
        <span class="text-gray ml">People:</span><span class="text-red">${converThousand(gameData.tempData.consumedFood)}</span>
        <span class="text-gray ml">Stolen:</span><span class="text-red">${converThousand(gameData.tempData.foodStolen)}</span>
        <span class="text-white">Total:</span><span class="text-bold text-red">${converThousand(calcEconomy('f')[1])}</span>
    </div>
    <div class="economy-div">
        <span class="text-white text-bold">Difference:</span><span class="text-bold">${converThousand(calcEconomy('f')[2])}</span>
    </div>
</div>

<div>
    <p class="stat-header">Wood:</p>
    <div class="economy-div">
        <span class="text-white spread">Gains</span>
        <span class="text-gray ml">Lumber yard:</span><span class="text-green">${converThousand(gameData.resourceGain.wood)}</span>
        <span class="text-gray ml">Events:</span><span class="text-green">${converThousand(gameData.resourceGain.woodEvents)}</span>
        <span class="text-white">Total:</span><span class="text-bold text-green">${converThousand(gameData.resourceGain.wood)}</span>
    </div>
    <div class="economy-div">
        <span class=" text-white spread">Loses</span>
        <span class="text-white">Total:</span><span class="text-bold text-red">${converThousand(calcEconomy('w')[0])}</span>
    </div>
    <div class="economy-div">
        <span class="text-white text-bold">Difference:</span><span class="text-bold">${converThousand(calcEconomy('w')[2])}</span>
    </div>
</div>

<div>
    <p class="stat-header">Stone:</p>
    <div class="economy-div">
        <span class="text-white spread">Gains</span>
        <span class="text-gray ml">Quarries:</span><span class="text-green">${converThousand(gameData.resourceGain.stone)}</span>
        <span class="text-gray ml">Events:</span><span class="text-green">${converThousand(gameData.resourceGain.stoneEvents)}</span>
        <span class="text-white">Total:</span><span class="text-bold text-green">${converThousand(calcEconomy('s')[0])}</span>
    </div>
    <div class="economy-div">
        <span class=" text-white spread">Loses</span>
        <span class="text-white">Total:</span><span class="text-bold text-red">${converThousand(calcEconomy('s')[1])}</span>
    </div>
    <div class="economy-div">
        <span class="text-white text-bold">Difference:</span><span class="text-bold">${converThousand(calcEconomy('s')[2])}</span>
    </div>
</div>`
}

export const displayCapital = (gameData) => {
    // helper vars for level array index
    const cl = gameData.buildings[0].currentLevel - 1
    const nl = gameData.buildings[0].currentLevel
    const ml = gameData.buildings[0].maxLevel
    return capital.innerHTML =
        `<h2>Capital</h2>
        <div class="build-description">
            <p>Capital city of our empire.</p>
        </div>
        <span class="text-bold text-orange">Level ${nl}</span>
        <div class="box-stats">
            <span class="text-gray">Space:</span><span>${converThousand(gameData.buildings[0].levels[cl].space)}</span>
            <span class="text-gray">Housing districts:</span><span>${converThousand(gameData.buildings[0].levels[cl].houses)}</span>
            <span class="text-gray">Militia p.m.:</span><span>${converThousand(gameData.buildings[0].levels[cl].militiaRecruit)}</span>
            ${gameData.buildings[0].levels[cl].commerce > 0 ? ` <span class="text-gray">Gold from trade:</span><span>${converThousand(gameData.buildings[0].levels[cl].commerce)}</span>` : ``}
        </div>
        <hr class="separator">
        ${nl === ml ? `<span class="text-bold text-orange">Capital is at max level.</span>` : 
        
       ` <span>Upgrade to <span class="text-orange">level ${nl + 1}</span></span>

       ${displayBuildCosts(gameData.buildings[0])}
       ${gameData.buildings[0].levels[nl].specialUnlock ? `
       <div class="box-stats">
       <span class="text-gray">Special costs:</span><span>${gameData.buildings[0].levels[nl].specialUnlock}</span>
       </div>` : ``}

       <span class='mt'>Upgrade bonuses:</span>
        <div class="box-stats">
            <span class="text-gray">Space:</span><span>${converThousand(gameData.buildings[0].levels[cl].space)} > <span class="text-green">${converThousand(gameData.buildings[0].levels[nl].space)}</span></span>
            <span class="text-gray">Housing districts:</span><span>${converThousand(gameData.buildings[0].levels[cl].houses)} > <span class="text-green">${converThousand(gameData.buildings[0].levels[nl].houses)}</span></span>
            <span class="text-gray">Militia p.m.:</span><span>${converThousand(gameData.buildings[0].levels[cl].militiaRecruit)} > <span class="text-green">${converThousand(gameData.buildings[0].levels[nl].militiaRecruit)}</span></span>
            <span class="text-gray">Gold from trade:</span><span>${converThousand(gameData.buildings[0].levels[cl].commerce)} > <span class="text-green">${converThousand(gameData.buildings[0].levels[nl].commerce)}</span></span>
            
        </div>

        <div class="subdiv">
        ${buildingConstrProgress(gameData.buildings[0])}
        </div>`
        }`
}

export const generateBuildings = (building, level) => {
    const cl = building.currentLevel
    const ml = building.maxLevel
    return `
    <div class="box" id="${building.id}">
        <h2>${building.name}</h2>
        <div class="build-description">
            <p>${building.info.replace('#effect#', `<span class='text-bold'>${building.effect}</span>`)}</p>
            <p class="text-orange">${displayBuildDescr(building)}</p> 
        </div>

        <div class='mtb'>
        ${(building.isUpgradeable && building.amount === 1) 
            ? `<span class="text-bold text-orange text-xl">Level ${building.currentLevel}</span>` 
            : `<span title='Current amount / Max amount' class=" text-bold text-xl">${building.amount}<span class="text-normal"> / ${building.maxSpace}</span></span>`}
        </div>

        <hr class="separator">

        ${(cl === ml && building.isUpgradeable) ? `<div class="subdiv">${buildingConstrProgress(building,level)}</div>` : `
        ${building.isUpgradeable && building.amount === 1 ? `<span>Upgrade to <span class="text-orange">level ${cl+1}</span></span>
        
        <p class='build-description'>${building.levels[cl].info.replace('#effect#', `<span class='text-bold'>${building.levels[cl].effect}</span>`)}</p>` : ``} 
        ${displayBuildCosts(building)}
        <div class="subdiv">${buildingConstrProgress(building,level)}</div>` }
    </div>`
}

export const generateMissions = (mission) => {
    return `
    <div class="box" id="mission${mission.id}">
        <h2 class='text-left'>${mission.missionDescription.name}</h2>
        <div class="mission-description">
            <p><span class='text-gray'>Objective:</span> ${mission.missionDescription.objective}</p>
            <p class="text-it">${mission.missionDescription.description}</p>
            <p class="timer"><span class='text-gray'>Expires:</span> ${displayRemainingTimeMission(mission.remainingTime)}</p>
        </div>
        

        <hr class="separator">
        Reward
        <div class='resource-box width100'>
        ${displayMissionReward(mission.rewards)}
        </div>

        <hr class="separator">

        <div class="buttons-box">
            <button id="btnAcceptMission">Accept</button>
            <button id="btnRejectMission">Reject</button>
        </div>
        
    </div>  `
}

export const generateArmy = (unit) => {
    return `
    <div class="box" id="unit${unit.name}">
        <h2 class='text-left'>${unit.name}</h2>
        <p class="text-bold text-it text-center">${displayUnitDescription(unit)}</p>
        <p class="text-bold text-xl" title="Amount">${converThousand(unit.amount)}</p>

        <div class='unit-stats'>
            <div class='unit-stat'>
                <div><img class="img-s" src="media/army/might.png" title="Attack"><span>${converThousand(unit.attack)}</span></div>
                <div><img class="img-s" src="media/army/defense.png" title="Defense"><span>${converThousand(unit.defense)}</span></div>
                <div><img class="img-s" src="media/army/health.png" title="HP"><span>${converThousand(unit.hp)}</span></div>
            </div>

            <div class='unit-stat'>
                <div><img class="img-s" src="media/army/speed.png" title="Speed"><span>${converThousand(unit.speed)}</span></div>
                <div><img class="img-s" src="media/army/army.png" title="Might (total)"><span>${converThousand(unit.might)}</span> <span class='text-gray'>(${converThousand(unit.might * unit.amount)})</span></div>
                <div><img class="img-s" src="media/res/gold.png" title="Upkeep (total)"><span>${converThousand(unit.pay)}</span> <span class='text-gray'>(${converThousand(Math.ceil(unit.pay * unit.amount))})</span></div>
            </div>
        </div>

        <hr class="separator">
        <div>
            Equipment
        </div>
        
        <div>
            Spells
        </div>

        <hr class="separator">
        <div class="add-form">
            <button class="btnDismiss" id="${unit.name}" >Dismiss</button>
            <input id="dismiss${unit.name}" type="number" placeholder="0" min="0" onkeydown="if(event.key==='.'){event.preventDefault();}" oninput="event.target.value = event.target.value.replace(/[^0-9]*/g,'');">
            <span class="text-gray">units</span>
            
        </div>
    </div>  `
}

export const generateRecruits = (unit) => {
    return `
    <div class="box" id="rec${unit.name}">
        <h2 class='text-left'>${unit.name}</h2>

        <div class='recruit-info'>
        <span class='text-gray'>In queue: </span>
        <span class='text-white text-bold'>${converThousand(unit.queue)}</span>
        </div>

        <hr class="separator">

        <div class='recruit-stats'>
            <div class='resource-box'>
                <div><img class="img-s" src="media/res/gold.png"><span class="text-gold">${converThousand(unit.recruitCost.gold)}</span></div>
                <div><img class="img-s" src="media/res/pop.png"><span class="text-purple">${converThousand(unit.recruitCost.pop)}</span></div>
            </div>
            <div class='resource-box'>
                <div><img class="img-s" src="media/res/month.png"><span class="text-white">${converThousand(unit.recrutpm)}</span></div>
            </div>
        </div>

        <div class="add-form relative">
            <span class="text-red error-text-recruit none">Not enough resources!</span>
            <button class="btnRecruit" id="${unit.name}">Recruit</button>
            <input id="recruit${unit.name}" type="number" placeholder="0" min="0" onkeydown="if(event.key==='.'){event.preventDefault();}" oninput="event.target.value = event.target.value.replace(/[^0-9]*/g,'');">
            <span class="text-it text-gray add-max" id="${unit.name}">(Max ${converThousand(calcMaxUnit(unit.recruitCost))})</span>
            
        </div>
    </div>  `
}
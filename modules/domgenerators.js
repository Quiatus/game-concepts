import { popText, changeHappinessColor, calcEconomy, converThousand, displayBuildCosts, getCapitalInfo, buildingConstrProgress, getArmyStatus, displayBuildDescr } from "./domhelpers.js"

const resourcesText = document.getElementById('resourceBox')
const taxBox = document.getElementById('taxBox')
const statistics = document.getElementById('statistics')
const economy = document.getElementById('economy')
const capital = document.getElementById('buildingCapital')

// Generates resource box
export const displayResourceBox = (gameData) => {    
    return resourcesText.innerHTML =
    `<div class="res res-nm"><img class='img-m' src='media/month.png'><span class='text-bold'>${converThousand(gameData.basicResources.month)}</span></div>
    <div class="res res-b"><img class='img-m' src='media/pop.png'><span class='text-purple'>${popText(gameData.basicResources.pop, gameData.tempData.totalSpace)}</span></div>
    <div class="res"><img class='img-m' src='media/gold.png'><span class='text-gold'>${converThousand(gameData.basicResources.gold)}</span></div>
    <div class="res"><img class='img-m' src='media/food.png'><span class='text-yellow'>${converThousand(gameData.basicResources.food)}</span></div>
    <div class="res res-nm"><img class='img-m' src='media/wood.png'><span class='text-brown'>${converThousand(gameData.basicResources.wood)}</span></div>
    <div class="res res-nm"><img class='img-m' src='media/stone.png'><span class='text-darkgray'>${converThousand(gameData.basicResources.stone)}</span></div>
    <div class="res hr"><img class='img-m' src='media/fame.png'><span>${converThousand(gameData.basicResources.fame)}</span></div>
    <div class="res"> <img class='img-m' src='media/army.png'><span>0</span></div>
    <div class="res res-sm"> <img class='img-m' src='media/fame.png'><span class='text-bold'>${changeHappinessColor(gameData.tempData.happiness)}</span></div>
    <div class="res res-nm"><img class='img-m' src='media/fame.png'><span class="text-bold">${getArmyStatus(gameData)}</span></div>`
}

// changes the tax level text
export const displayTaxBox = (gameData) => {
    let taxText = ''

    // change the text base on tax level
    if (gameData.general.tax === 1) taxText = '<span class="text-green">Low</span>'
    else if (gameData.general.tax === 2) taxText = '<span class="text-gold">Balanced</span>'
    else taxText = '<span class="text-red">High</span>'

    // markup
    return taxBox.innerHTML = `<h4 class="text-big">Taxes</h4>
    <div class="build-description">
        <p>Important source of <span class="text-gold text-bold">gold</span>. Increased taxes will negatively affect happiness. Decreased taxes have the opposite effect.</p>
    </div>
    <div class="settings-stats build-amount">
        <span class="text-gray">Current tax:</span> <span>${taxText}</span>
        <span class="text-gray">Gold p. 100 pop.:</span><span>${gameData.general.tax * 5}</span>
    </div>
    <span>Set tax level:</span>
    <div class="settings-buttons">
        <button class="btnTax" id="btnTaxLow">Low</button>
        <button class="btnTax" id="btnTaxBalanced">Balanced</button>
        <button class="btnTax" id="btnTaxHigh">High</button>
    </div>`
}

// Display statistics
export const displayStatistics = (gameData) => {
    return statistics.innerHTML = `
    <div>
        <p class="stat-header">General:</p>
        <div class="stat-div">
            <span class="text-gray">Fame:</span><span id="stat-gen-fame">${converThousand(gameData.basicResources.fame)}</span>
            <span class="text-gray">Happiness:</span><span>${changeHappinessColor(gameData.tempData.happiness)}</span>
            <span class="text-gray">Might:</span><span id="stat-gen-might">0</span>
            <span class="text-gray">Army:</span><span>${getArmyStatus(gameData)}</span>
        </div>
    </div>

    <div>
        <p class="stat-header">Space:</p>
        <div class="stat-div">
            <span class="text-gray">Capital:</span><span>${converThousand(gameData.basicResources.basicSpace)}</span>
            <span class="text-gray">Houses:</span><span>${converThousand(gameData.tempData.houseSpace)}</span>
            <span class="text-gray">Settlements:</span><span id="stat-space-settlement">0</span>
            <span class="text-gray">Total space:</span><span>${converThousand(gameData.tempData.totalSpace)}</span>
            <span class="text-gray">Free space:</span><span>${converThousand(gameData.tempData.totalSpace - gameData.basicResources.pop)}</span>
        </div>
    </div>

    <div>
        <p class="stat-header">Buildings:</p>
        <div class="stat-div">
            <span class="text-gray">Houses:</span><span>${converThousand(gameData.buildingHouse.amount)}</span>
            <span class="text-gray">Farms:</span><span>${converThousand(gameData.buildingFarm.amount)}</span>
            <span class="text-gray">Lumber yards:</span><span>${converThousand(gameData.buildingLumberyard.amount)}</span>
            <span class="text-gray">Quarries:</span><span>${converThousand(gameData.buildingQuarry.amount)}</span>
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
        <span class="text-white">Total:</span><span class="text-bold text-green">${converThousand(calcEconomy('g')[0])}</span>
    </div>
    <div class="economy-div">
        <span class=" text-white spread">Expenditures</span>
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
        <span class="text-white">Total:</span><span class="text-bold text-green">${converThousand(calcEconomy('f')[0])}</span>
    </div>
    <div class="economy-div">
        <span class=" text-white spread">Loses</span>
        <span class="text-gray ml">People:</span><span class="text-red">${converThousand(gameData.tempData.consumedFood)}</span>
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
    return capital.innerHTML =
        `<h4 class="text-big">Capital</h4>
        <div class="build-description">
            <p>Capital city of our empire.</p>
        </div>
        <span class="text-bold text-orange">Level ${getCapitalInfo().currentLevel.level}</span>
        <div class="settings-stats">
            <span class="text-gray">Space:</span><span>${converThousand(getCapitalInfo().currentLevel.space)}</span>
            <span class="text-gray">Max. houses:</span><span>${converThousand(getCapitalInfo().currentLevel.houses)}</span>
            ${getCapitalInfo().currentLevel.commerce > 0 ? ` <span class="text-gray">Commerce:</span><span>${converThousand(getCapitalInfo().currentLevel.commerce)}</span>` : ``}
        </div>
        <hr class="subdiv-separator">
        
        ${getCapitalInfo().nextLevel === 'max' ?  `<span class="text-bold">Capital is at max level.</span>` : 
        
       ` <span>Upgrade to <span class="text-orange">level ${getCapitalInfo().nextLevel.level}</span></span>

       ${displayBuildCosts(gameData.buildingCapital)}
       ${getCapitalInfo().nextLevel.specialUnlock ? `
       <div class="settings-stats">
           <span class="text-gray">Special costs:</span><span>${getCapitalInfo().nextLevel.specialUnlock}</span>
       </div>` : ``}

       <span>Upgrade bonuses:</span>
        <div class="settings-stats">
            <span class="text-gray">Space:</span><span>${converThousand(getCapitalInfo().currentLevel.space)} > <span class="text-green">${converThousand(getCapitalInfo().nextLevel.space)}</span></span>
            <span class="text-gray">Max. houses:</span><span>${converThousand(getCapitalInfo().currentLevel.houses)} > <span class="text-green">${converThousand(getCapitalInfo().nextLevel.houses)}</span></span>
            <span class="text-gray">Gold from trade:</span><span>${converThousand(getCapitalInfo().currentLevel.commerce)} > <span class="text-green">${converThousand(getCapitalInfo().nextLevel.commerce)}</span></span>
        </div>

        <div class="subdiv">
        ${buildingConstrProgress(gameData.buildingCapital)}
        </div>`
        }`
}

export const generateBuildings = (building, level) => {
    return `
    <div class="box text-small" id="${building.id}">
        <h4 class="text-big">${building.name}</h4>
        <div class="build-description">
            <p class="text-gray text-bold mb">${building.buildingType} building</p>
            <p>${building.info.replace('#effect#', `<span class='text-bold'>${building.effect}</span>`)}</p>
            <p class="text-orange">${displayBuildDescr(building)}</p> 
        </div>
        
        <div class='build-amount'><span class="text-big">${building.amount}<span class="text-small"> / ${building.maxSpace}</span></span></div>
        
        ${displayBuildCosts(building)}

        <div class="subdiv">
            ${buildingConstrProgress(building,level)}
        </div>
    </div>`
}
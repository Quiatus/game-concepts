import { converThousand } from "./general.js"
import { changeEmpireTextColors } from './empire.js'

export const displayStatistics = (gameData) => {
    const rightPanel = document.getElementById('rightPanel')
    return rightPanel.innerHTML = `<h1>Statistics</h1>

    <div class="bigBoxDiv">
        <div class="box-sub">
            <h3>Economy</h3>
            <div class="statsBox economy" id="economy">
                ${displayEconomy(gameData)}
            </div>          
        </div>

        <div class="box-sub">
            <h3>General</h3>
            <div class="statsBox statistics" id="statistics">
                ${displayStatsGeneral(gameData)}
            </div>          
        </div>

        <div class="box-sub">
            <h3>Buildings</h3>
            <div class="statsBox statistics" id="statistics">
                ${displayStatsBuildings(gameData)}
            </div>          
        </div>

        <div class="box-sub">
            <h3>Materials</h3>
            <div class="statsBox statistics" id="statistics">
                ${displayStatsMaterials(gameData)}
            </div>          
        </div>
    </div>`
}

const displayStatsGeneral = (gameData) => {
    return `
    <div>
        <p class="stat-header">Empire:</p>
        <div class="stat-div">
            <span class="text-gray">Clan age:</span> <span>${ Math.floor(gameData.basicResources.month / 12)} years</span>
            <span class="text-gray">Capital:</span><span>Level ${gameData.buildings[0].currentLevel}</span>
            <span class="text-gray">Taxes:</span><span>${changeEmpireTextColors('tax', gameData.general.tax)}</span>
            <span class="text-gray">Food rations:</span><span>${changeEmpireTextColors('food', gameData.general.foodLevel)}</span>
            <span class="text-gray">Production:</span><span>${changeEmpireTextColors('production', gameData.general.production)}</span>
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
        <p class="stat-header">Settlements:</p>
        <div class="stat-div">
            <span class="text-gray">Villages:</span><span id="stat-settlement-village">0</span>
            <span class="text-gray">Towns:</span><span id="stat-settlement-town">0</span>
            <span class="text-gray">Cities:</span><span id="stat-settlement-city">0</span>
        </div>
    </div> 
    `
}

const displayStatsBuildings = (gameData) => {
    return `
    <div>
        <p class="stat-header">Buildings - general:</p>
        <div class="stat-div">
            <span class="text-gray">Housing distr:</span><span>${converThousand(gameData.buildings[1].amount)}</span>
            <span class="text-gray">Tavern:</span><span>${gameData.buildings[7].amount ? `1` : `Not built`}</span>

        </div>
    </div>    

    <div>
        <p class="stat-header">Buildings - resources:</p>
        <div class="stat-div">
            <span class="text-gray">Farms:</span><span>${converThousand(gameData.buildings[2].amount)}</span>
            <span class="text-gray">Lumber yards:</span><span>${converThousand(gameData.buildings[3].amount)}</span>
            <span class="text-gray">Quarries:</span><span>${converThousand(gameData.buildings[4].amount)}</span>
        </div>
    </div>    

    <div>
        <p class="stat-header">Buildings - production:</p>
        <div class="stat-div">
            <span class="text-gray">Blacksmith:</span><span>${gameData.buildings[6].amount ? `Level ${gameData.buildings[6].currentLevel}` : `Not built`}</span>
        </div>
    </div> 

    <div>
        <p class="stat-header">Buildings - military:</p>
        <div class="stat-div">
        <span class="text-gray">Archery range:</span><span>${gameData.buildings[5].amount ? `Level ${gameData.buildings[5].currentLevel}` : `Not built`}</span>
        </div>
    </div>  `
}

const displayStatsMaterials = (gameData) => {
    return `
    <div>
        <p class="stat-header">Metal:</p>
        <div class="stat-div">
            
        </div>
    </div> 

    <div>
        <p class="stat-header">Runes:</p>
        <div class="stat-div">
            
        </div>
    </div> 
    `
}

const displayEconomy = (gameData) => {
    return `
    <div>
    <p class="stat-header">People:</p>
    <div class="economy-div">
        <span class="text-white spread">Gains</span>
        <span class="text-gray ml">Growth:</span><span class="text-green">${converThousand(gameData.resourceGain.pop)}</span>
        <span class="text-white">Total:</span><span class="text-bold text-green">${converThousand(calcEconomy('p', gameData)[0])}</span>
    </div>
    <div class="economy-div">
        <span class=" text-white spread">Loses</span>
        <span class="text-gray ml">Left:</span><span class="text-red">${converThousand(gameData.tempData.popLeft)}</span>
        <span class="text-gray ml">Deaths:</span><span class="text-red">${converThousand(gameData.tempData.popDied)}</span>
        <span class="text-white">Total:</span><span class="text-bold text-red">${converThousand(calcEconomy('p', gameData)[1])}</span>
    </div>
    <div class="economy-div">
        <span class="text-white text-bold">Difference:</span><span class="text-bold">${calcEconomy('p', gameData)[2]}</span>
    </div>
</div>

<div>
    <p class="stat-header">Gold:</p>
    <div class="economy-div">
        <span class="text-white spread">Income</span>
        <span class="text-gray ml">Taxes:</span><span class="text-green">${converThousand(gameData.resourceGain.goldTax)}</span>
        <span class="text-gray ml">Trade:</span><span class="text-green">${converThousand(gameData.tempData.commerce)}</span>
        <span class="text-gray ml">Events:</span><span class="text-green">${converThousand(gameData.resourceGain.goldEvents)}</span>
        <span class="text-white">Total:</span><span class="text-bold text-green">${converThousand(calcEconomy('g', gameData)[0])}</span>
    </div>
    <div class="economy-div">
        <span class=" text-white spread">Expenditures</span>
        <span class="text-gray ml">Army upkeep:</span><span class="text-red">${converThousand(gameData.tempData.armyUpkeep)}</span>
        <span class="text-gray ml">Stolen:</span><span class="text-red">${converThousand(gameData.tempData.goldStolen)}</span>
        <span class="text-white">Total:</span><span class="text-bold text-red">${converThousand(calcEconomy('g', gameData)[1])}</span>
    </div>
    <div class="economy-div">
        <span class="text-white text-bold">Difference:</span><span class="text-bold">${calcEconomy('g', gameData)[2]}</span>
    </div>
</div>

<div>
    <p class="stat-header">Food:</p>
    <div class="economy-div">
        <span class="text-white spread">Gains</span>
        <span class="text-gray ml">Farms:</span><span class="text-green">${converThousand(gameData.resourceGain.food)}</span>
        <span class="text-gray ml">Events:</span><span class="text-green">${converThousand(gameData.resourceGain.foodEvents)}</span>
        <span class="text-white">Total:</span><span class="text-bold text-green">${converThousand(calcEconomy('f', gameData)[0])}</span>
    </div>
    <div class="economy-div">
        <span class=" text-white spread">Loses</span>
        <span class="text-gray ml">People:</span><span class="text-red">${converThousand(gameData.tempData.consumedFood)}</span>
        <span class="text-gray ml">Stolen:</span><span class="text-red">${converThousand(gameData.tempData.foodStolen)}</span>
        <span class="text-white">Total:</span><span class="text-bold text-red">${converThousand(calcEconomy('f', gameData)[1])}</span>
    </div>
    <div class="economy-div">
        <span class="text-white text-bold">Difference:</span><span class="text-bold">${calcEconomy('f', gameData)[2]}</span>
    </div>
</div>

<div>
    <p class="stat-header">Wood:</p>
    <div class="economy-div">
        <span class="text-white spread">Gains</span>
        <span class="text-gray ml">Lumber yard:</span><span class="text-green">${converThousand(gameData.resourceGain.wood)}</span>
        <span class="text-gray ml">Events:</span><span class="text-green">${converThousand(gameData.resourceGain.woodEvents)}</span>
        <span class="text-white">Total:</span><span class="text-bold text-green">${converThousand(calcEconomy('w', gameData)[0])}</span>
    </div>
    <div class="economy-div">
        <span class=" text-white spread">Loses</span>
        <span class="text-white">Total:</span><span class="text-bold text-red">${converThousand(calcEconomy('w', gameData)[1])}</span>
    </div>
    <div class="economy-div">
        <span class="text-white text-bold">Difference:</span><span class="text-bold">${calcEconomy('w', gameData)[2]}</span>
    </div>
</div>

<div>
    <p class="stat-header">Stone:</p>
    <div class="economy-div">
        <span class="text-white spread">Gains</span>
        <span class="text-gray ml">Quarries:</span><span class="text-green">${converThousand(gameData.resourceGain.stone)}</span>
        <span class="text-gray ml">Events:</span><span class="text-green">${converThousand(gameData.resourceGain.stoneEvents)}</span>
        <span class="text-white">Total:</span><span class="text-bold text-green">${converThousand(calcEconomy('s', gameData)[0])}</span>
    </div>
    <div class="economy-div">
        <span class=" text-white spread">Loses</span>
        <span class="text-white">Total:</span><span class="text-bold text-red">${converThousand(calcEconomy('s', gameData)[1])}</span>
    </div>
    <div class="economy-div">
        <span class="text-white text-bold">Difference:</span><span class="text-bold">${calcEconomy('s', gameData)[2]}</span>
    </div>
</div>`
}


const calcEconomy = (econType, gameData) => {
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
    if (total > 0) results[2] = `<span class='text-green'>+ ${converThousand(total)}</span>`
    else if (total < 0) results[2] = `<span class='text-red'>${converThousand(total)}</span>`
    else results[2] = `<span class='text-white'>0</span>`

    return results
}
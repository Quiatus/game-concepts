import { converThousand } from "./general.js"
import { displayBuildCosts, buildingConstrProgress } from './buildings.js'

export const displayEmpireManagement = (gameData) => {
    const rightPanel = document.getElementById('rightPanel')
    return rightPanel.innerHTML = `
    <h1>Empire management</h1>

    <div class="smallBoxDiv">
        <div class="box" id="buildingCapital">
            ${displayCapital(gameData)}
        </div> 

        <div class="box" id="taxBox">
            ${displayTaxBox(gameData)}
        </div> 

        <div class="box" id="foodBox">
            ${displayFoodBox(gameData)}
        </div> 

        <div class="box">
            ${displayProductionBox(gameData)}
        </div> 

        <div class="box">
            ${displayResetBox()}
        </div> 
    </div>  
    `
}

const displayCapital = (gameData) => {
    // helper vars for level array index
    const cl = gameData.buildings[0].currentLevel - 1
    const nl = gameData.buildings[0].currentLevel
    const ml = gameData.buildings[0].maxLevel
    return `<h2>Capital</h2>
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

const displayTaxBox = (gameData) => {
    return `<h2>Taxes</h2>
    <div class="build-description">
        <p>Important source of <span class="text-gold text-bold">gold</span>. High taxes negatively affect happiness. Low taxes have the opposite effect.</p>
    </div>
    <div class="box-stats mtb">
        <span class="text-gray">Current tax:</span> <span>${changeEmpireTextColors('tax', gameData.general.tax)}</span>
        <span class="text-gray">Gold p. 100 pop.:</span><span>${gameData.general.tax * 10}</span>
    </div>
    <hr class="separator">
    <span>Set tax level:</span>
    <div class="buttons-box">
        <button class="btnTax" id="taxLow">Low</button>
        <button class="btnTax" id="taxBalanced">Balanced</button>
        <button class="btnTax" id="taxHigh">High</button>
    </div>`
}

const displayResetBox = () => {
    return `<h2>Abandon clan</h2>
    <div class="build-description">
        <p>Leave our people behind and start a new clan.</p>
        <p class='text-red'>Warning: this option is irreversible!</p>
    </div>
    <div class="buttons-box">
        <button id="btnReset">Do it!</button>
    </div>`
}

const displayFoodBox = (gameData) => {
    return `<h2>Food rationing</h2>
    <div class="build-description">
        <p>Increase or decrease the <span class="text-yellow text-bold">food</span> rations for our population. Limited rations decrease happiness and population growth, generous rations increase happiness and population growth.</p>
    </div>
    <div class="box-stats mtb">
        <span class="text-gray">Current rations:</span> <span>${changeEmpireTextColors('food', gameData.general.foodLevel)}</span>
        <span class="text-gray">Food p. 100 pop.:</span><span>${gameData.general.foodLevel}</span>
        <span class="text-gray">Population growth:</span>${
            gameData.general.foodLevel < 1 ? `<span class="text-red">75%</span>` : gameData.general.foodLevel === 1 ? `<span class="text-white">100%</span>` : `<span class="text-green">125%</span>`
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

const displayProductionBox = (gameData) => {
    return `<h2>Production</h2>
    <div class="build-description">
        <p>Set the output of all resource buildings. Lowering the output increases happiness, increasing the output decreases happiness and increases food consumption by 50%.</p>
    </div>
    <div class="box-stats mtb">
        <span class="text-gray">Current production:</span> <span>${changeEmpireTextColors('production', gameData.general.production)}</span>
        <span class="text-gray">Production:</span> ${
            gameData.general.production < 1 ? `<span class="text-red">75%</span>` : gameData.general.production === 1 ? `<span class="text-white">100%</span>` : `<span class="text-green">125%</span>`
        }
    </div>
    <hr class="separator">
    <span>Set production:</span>
    <div class="buttons-box">
        <button class="btnProduction" id="productionLow">Decrease</button>
        <button class="btnProduction" id="productionBalanced">Standard</button>
        <button class="btnProduction" id="productionHigh">Increase</button>
    </div>`
}

export const changeEmpireTextColors = (type, lvl) => {
    let text = ''
    let texts = []
    if (type === 'tax') texts = ['Low', 'Balanced', 'High']
    if (type === 'food') texts = ['Limited', 'Normal', 'Generous']
    if (type === 'production') texts = ['Decreased', 'Standard', 'Increased']

    if (lvl < 1) text = `<span class="${type === 'food' ? `text-red` : `text-green`}">${texts[0]}</span>`
    else if (lvl === 1) text = `<span class="${type === 'food' ? `text-yellow` : type === 'tax' ? `text-gold`: `text-white`}">${texts[1]}</span>`
    else text = `<span class="${type === 'food' ? `text-green` : `text-red`}">${texts[2]}</span>`

    return text
}
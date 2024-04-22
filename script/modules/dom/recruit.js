/*
Generate Recruitment panel.

## Featurs
- Show list of recruitable units
- Show recuitment queue
- Adds unit to recruitment queue

## Functions
generateRecruits: Generates the box for each unit that the player can recruit. This fn is called from showRecruitableUnits function
showRecruitableUnits: iterates over the list of army units. If the units is unlocked for recruitment, calls generateArmy fn, which then generate the html for the unit with all the information
*/

import { calcMaxUnit } from "../units.js"
import { converThousand } from "./general.js"

export const displayRecruitment = () => {
    const rightPanel = document.getElementById('rightPanel')
    return rightPanel.innerHTML = `
    <h1>Recruitment</h1>
    <div class="smallBoxDiv" id="recruitment">  
    </div>`
}

const generateRecruits = (unit, gameData) => {
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
            <span class="text-it text-gray add-max" id="${unit.name}">(Max ${converThousand(calcMaxUnit(unit.recruitCost, gameData))})</span>
            
        </div>
    </div>  `
}

export const showRecruitableUnits = (gameData) => {
    const recruitment = document.getElementById('recruitment') 
    recruitment.innerHTML = ''
    for (let unit of gameData.units) {
        if (unit.isRecruitable) {
            const unitDiv = document.createElement('div')
            unitDiv.innerHTML = generateRecruits(unit, gameData)
            recruitment.append(unitDiv)
        }
    }    
}
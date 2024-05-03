/*
Generate Army Managemnet panel.

## Featurs
- See available units
- See unit amount and statistics
- Equip or unequip units
- Dismiss units

## Functions
generateArmy: Generates the box for each unit whose amount is higher than 0. This fn is called from showArmyUnits function
displayArmy: Generates the main panel 
showArmyUnits: iterates over the list of army units. If the amount of units is higher than 0, calls generateArmy fn, which then generate the html for the unit with all the information
displayUnitDescription: changes the description text and color of the text based on the unit type
*/

import { converThousand } from "./general.js"

const generateArmy = (unit) => {
    return `
    <div class="box" id="unit${unit.name}">
        <h2 class='text-left'>${unit.name}</h2>
        <p class="text-bold text-it text-center">${displayUnitDescription(unit)}</p>
        <p class="text-bold text-xl" >${converThousand(unit.amount)}</p>

        <div class='unit-stats'>
            <div class='unit-stat'>
                <div><div class="toolbox"><img class="img-s" src="media/army/might.png"><span class="tooltip">Attack</span></div><span>${converThousand(unit.attack)}</span></div>
                <div><div class="toolbox"><img class="img-s" src="media/army/defense.png"><span class="tooltip">Defense</span></div><span>${converThousand(unit.defense)}</span></div>
                <div><div class="toolbox"><img class="img-s" src="media/army/health.png"><span class="tooltip">Health</span></div><span>${converThousand(unit.hp)}</span></div>
            </div>

            <div class='unit-stat'>
                <div><div class="toolbox"><img class="img-s" src="media/army/speed.png"><span class="tooltip">Speed</span></div><span>${converThousand(unit.speed)}</span></div>
                <div><div class="toolbox"><img class="img-s" src="media/army/army.png"><span class="tooltip">Might (total)</span></div><span>${converThousand(unit.might)}</span> <span class='text-gray'>(${converThousand(unit.might * unit.amount)})</span></div>
                <div><div class="toolbox"><img class="img-s" src="media/res/gold.png"><span class="tooltip">Upkeep (total)</span></div><span>${converThousand(unit.pay)}</span> <span class='text-gray'>(${converThousand(Math.ceil(unit.pay * unit.amount))})</span></div>
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

export const displayArmy = () => {
    const rightPanel = document.getElementById('rightPanel')
    return rightPanel.innerHTML = `
    <h1>Army overview</h1>
    
    <div class="smallBoxDiv" id="army"> 
    
    </div>`
}

export const showArmyUnits = (gameData) => {
    const army = document.getElementById('army') 
    army.innerHTML = ''
    for (let unit of gameData.units) {
        if (unit.amount) {
            const unitDiv = document.createElement('div')
            unitDiv.innerHTML = generateArmy(unit)
            army.append(unitDiv)
        }
    }    
}

const displayUnitDescription = (unit) => {
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
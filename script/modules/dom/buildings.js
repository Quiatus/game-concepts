/*
Generate Buildings panel.

## Featurs
- See available buildings
- build and upgrade buildings
- see info about buildings

## Functions
generateBuildings: Generates the box for each unlocked building. This fn is called from showUnlockedBuildings function
displayBuildings: Generates the main panel 
showUnlockedBuildings: iterates over the list of buildings. If the buildings is unlocked , calls generateBuildings fn, which then generate the html for the building with all the information
buildingConstrProgress: changes the bottom part of the building box based on the current status. This could be: build button if the building is unlocked, progress bar if the building is beign constructed, error message
                        if the building is unlocked, but certain condition was not met (capital level, space, etc.)
displayBuildCosts: show the building cost based on what is required
displayBuildDescr: change building description text based on the type
*/

// --- ADD TABS --- //

import { converThousand } from "./general.js"

export const displayBuildings = () => {
    const rightPanel = document.getElementById('rightPanel')
    return rightPanel.innerHTML = `
    <h1>Buildings</h1>
    <div class="buildings" id="buildings">  
        
    </div>
    `
}
const generateBuildings = (building, level) => {
    const cl = building.currentLevel
    const ml = building.maxLevel
    return `
    <div class="box" id="${building.id}">
        <h2>${building.name}</h2>
        <div class="build-description">
            <p class="build-description-icon-text">${building.info.replace('#effect#', `<span class='text-bold'>${building.effect}</span>`)}</p>
            <p class="text-orange">${displayBuildDescr(building)}</p> 
        </div>

        <div class='mtb'>
        ${(building.isUpgradeable && building.amount === 1) 
            ? `<span class="text-bold text-orange text-xl">Level ${building.currentLevel}</span>` 
            : `<span class=" text-bold text-xl">${building.amount}<span class="text-normal"> / ${building.maxSpace}</span></span>`}
        </div>

        <hr class="separator">

        ${(cl === ml && building.isUpgradeable) ? `<div class="subdiv">${buildingConstrProgress(building,level)}</div>` : `
        ${building.isUpgradeable && building.amount === 1 ? `<span>Upgrade to <span class="text-orange">level ${cl+1}</span></span>
        
        <p class='build-description'>${building.levels[cl].info.replace('#effect#', `<span class='text-bold'>${building.levels[cl].effect}</span>`)}</p>` : ``} 
        ${displayBuildCosts(building)}
        <div class="subdiv">${buildingConstrProgress(building,level)}</div>` }
    </div>`
}

export const showUnlockedBuildings = (gameData) => {
    const buildingTypes = ['General', 'Resource', 'Production', 'Military']
    const buildings = document.getElementById('buildings')
    
    buildings.innerHTML = ''
    for (let item of buildingTypes) {
        buildings.innerHTML += `<p class='mtbb text-big text-gray'>${item} buildings</p>`
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

const displayBuildDescr = (building) => {
    let string = ''
    string = `${building.isUnique ? `Unique - ` : ``}${building.requireSpace ? `Requires space - ` : ``}${building.isUpgradeable ? `Can be upgraded - ` : ``}`
    string = string.substring(0, string.length-3)
    return string
}
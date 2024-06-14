'use strict';

import { showPanel, printMessage } from "../dom/general.js"
import { saveGame } from "../utilities.js"

// checks the current capital level and applies modifiers
export const applyCapitalBonuses = (gameData) => {
    gameData.basicResources.basicSpace = gameData.buildings[0].levels[gameData.buildings[0].currentLevel - 1].space
    gameData.buildings[1].maxSpace = gameData.buildings[0].levels[gameData.buildings[0].currentLevel - 1].houses 
    gameData.units[0].recrutpm = gameData.buildings[0].levels[gameData.buildings[0].currentLevel - 1].militiaRecruit 
}

// Updates the current building cost for any upgradeable building
export const updateBuildCost = (gameData) => {
    for (let building of gameData.buildings) {
        let cl = building.currentLevel
        const ml = building.maxLevel
        if (building.isUpgradeable && cl < ml) {
            // if buliding is not constructed, grabs costs of lvl1, otherwise, grabs costs of the next level
            if (building.amount === 0) cl = 0
            
            building.costTime = building.levels[cl].costTime
            building.costGold = building.levels[cl].costGold
            building.costWood = building.levels[cl].costWood
            building.costStone = building.levels[cl].costStone
            building.requireCapitalLevel = building.levels[cl].requireCapitalLevel
            if (building.id === 'buildingCapital') building.specialUnlock = building.levels[cl].specialUnlock  
        }  
    }
}

// checks for various conditions and concatinate each that is not met
const checkIfEnoughResources = (building, gameData) => {
    let canBuild = true
    let reason = 'Not enough '

    if (building.costGold > gameData.basicResources.gold) {
        canBuild = false
        reason += 'gold, '
    }

    if (building.costWood > gameData.basicResources.wood) {
        canBuild = false
        reason += 'wood, '
    }

    if (building.costStone > gameData.basicResources.stone) {
        canBuild = false
        reason += 'stone, '
    }

    reason = reason.substring(0, reason.length - 2)
    return [canBuild, reason] // bool, string
}

// start building construction
export const startConstruction = (e, gameData) => {
    let buildingName = e.target.id

    for (let building of gameData.buildings) {
        if (building.id === buildingName) {
            building.space = building.maxSpace - building.amount

            // checks if enough resources to build
            const [check, reason] = checkIfEnoughResources(building, gameData)
            
            // if check pass, start building
            if (check) {
                building.isBeingBuilt = true
                
                gameData.basicResources.gold -= building.costGold
                gameData.basicResources.wood -= building.costWood
                gameData.basicResources.stone -= building.costStone
        
                saveGame(gameData)
                building.name === 'Capital' ? showPanel('empireManagementPanel', gameData) : showPanel('buildingsPanel', gameData)
            } else {
                // displays the error message if construction not possible
                e.target.parentElement.children[0].textContent = reason
                e.target.parentElement.children[0].classList.remove('none')
                setTimeout(() => {e.target.parentElement.children[0].classList.add('none')}, 2000)
            }
        }
    }
}

// progresses the construction
export const progressBuild = (gameData) => {
    // if the last month passes, completes the construction
    for (let building of gameData.buildings) {
        if (building.isBeingBuilt) {
            if (building.buildProgress === (building.costTime - 1)) {  
                building.isBeingBuilt = false;
                building.buildProgress = 0;
    
                if (!building.isUpgradeable || (building.isUpgradeable && building.amount === 0)) {
                    building.amount++;
                    printMessage(`A new <span class='${building.textColor}'>${building.name}</span> has been built.`, 'info', gameData)
                } else {
                    building.currentLevel++
                    if (building.id !== 'buildingCapital') building.effect = building.levels[building.currentLevel-1].effect
                    printMessage(`<span class='${building.textColor}'>${building.name}</span> has been upgraded to <span class='text-orange'>level ${building.currentLevel}</span>.`, 'info', gameData)
                }      
                
            } else {
                building.buildProgress++
            }
        }
    }
}
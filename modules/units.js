'use strict';

import { saveGame } from "./utilities.js"
import { showPanel } from "./domhelpers.js"
import { printMessage } from "./domhelpers.js"

// check if any building that allows recruitment is built and if so, unlock the appropriate unit or increases the recruitment
export const unlockUnits = (gameData) => {
    for (let building of gameData.buildings) {
        if (building.buildingType === 'Military' && building.amount === 1) {
            for (let unit of gameData.units) {
                if (unit.name === building.unlocksUnit) {
                    unit.isRecruitable = true
                    unit.recrutpm = building.effect
                    break
                }
            }
        }
    }
}

// calculate might
export const calculateMight = (gameData) => {
    let might = 0

    for (let unit of gameData.units) {
        if (unit.amount) might += unit.might * unit.amount
    }

    gameData.tempData.might = might
}

// calcualte max recruitable unit
export const calcMaxUnit = (unitCost, gameData) => {
    let lowestCost = []

    const res = [
        gameData.basicResources.gold,
        gameData.basicResources.pop
    ]

    const cost = [
        unitCost.gold,
        unitCost.pop
    ]

    for (let [i, en] of res.entries()) {
        lowestCost.push(Math.floor(en / cost[i]))
    }

    return Math.min(...lowestCost)
}

// dismiss selected amount of units
export const dismissUnits = (unitName, gameData) => {
    let val = Number(document.getElementById(`dismiss${unitName}`).value)

    if (!val) val = 0

    for (let unit of gameData.units) {
        if (unit.name === unitName) {
            unit.amount -= val
            if (unit.amount < 0) unit.amount = 0
        }
    }

    saveGame(gameData)
    calculateMight(gameData)
    showPanel('armyManagementPanel', gameData)
}

// if units are recruitable and are in queue, add them to army.
export const recruitUnits = (gameData) => {
    for (let unit of gameData.units) {
        if (unit.isRecruitable && unit.queue) {
            if (unit.queue >= unit.recrutpm) {
                unit.amount += unit.recrutpm
                unit.queue -= unit.recrutpm
                printMessage(unit.recruitMessage.replace('##amount##', unit.recrutpm), 'recruit', gameData)
            } else {
                unit.amount += unit.queue
                printMessage(unit.recruitMessage.replace('##amount##', unit.queue), 'recruit', gameData)
                unit.queue = 0
            }
        }
    }
}

// add selected amount of units to recruitment queue
export const addRecruits = (unitName, e, max=false, gameData) => {
    let recruitAmount = 0
    let val = Number(document.getElementById(`recruit${unitName}`).value)
    let check = false

    for (let unit of gameData.units) {
        if (unit.name === unitName) {
            const maxAmount = calcMaxUnit(unit.recruitCost, gameData)
            if (max) {
                recruitAmount = maxAmount
                check = true
            }
            else {
                if (!val) val = 0
                if (val <= maxAmount) {
                    recruitAmount = val
                    check = true
                }
            }

            if (check) {
                unit.queue += recruitAmount
                gameData.basicResources.gold -= (unit.recruitCost.gold * recruitAmount)
                gameData.basicResources.pop -= (unit.recruitCost.pop * recruitAmount)
                saveGame(gameData)
                showPanel('recruitmentPanel', gameData)
            } else {
                e.target.parentElement.children[0].classList.remove('none')
                setTimeout(() => {e.target.parentElement.children[0].classList.add('none')}, 2000)
            }
        }
    }
}

// check if there is enough gold to pay the army
export const checkUpkeep = (gameData) => {
    gameData.alerts.desertion = false
    if (gameData.tempData.armyUpkeep > gameData.tempData.totalGoldGain && gameData.basicResources.gold > 0) {
        printMessage('Our army upkeep is higher than our gold income. Increase gold production or dismiss some units.', 'warning', gameData)
    } else if (gameData.tempData.armyUpkeep > gameData.tempData.totalGoldGain && gameData.basicResources.gold === 0) {
        gameData.alerts.desertion = true
        printMessage('We do not have enough gold to pay our army. Our units are deserting!', 'critical', gameData)
        removeUnitsDesertion(gameData)
    }    
}

// if there is not enough gold, remove 10% of units per month
const removeUnitsDesertion = (gameData) => {
    for (let unit of gameData.units) {
        if (unit.amount) {
            unit.amount -= Math.floor(unit.amount * 0.1)
        }
    }
}
'use strict';

import { loadGame, saveGame } from "./utilities.js"
import { generateMarkup } from "./domhelpers.js"
import { printMessage } from "./domhelpers.js"

// calculate might
export const calculateMight = () => {
    let gameData = loadGame()
    let might = 0

    for (let unit of gameData.units) {
        if (unit.amount) might += unit.might * unit.amount
    }

    gameData.tempData.might = might
    saveGame(gameData)
}

// calcualte max recruitable unit
export const calcMaxUnit = (unitCost) => {
    const gameData = loadGame()
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
export const dismissUnits = (unitName) => {
    let gameData = loadGame()
    let val = Number(document.getElementById(`dismiss${unitName}`).value)

    if (!val) val = 0

    for (let unit of gameData.units) {
        if (unit.name === unitName) {
            unit.amount -= val
            if (unit.amount < 0) unit.amount = 0
        }
    }

    saveGame(gameData)
    calculateMight()
    generateMarkup('armyManagementPanel')
}

// if units are recruitable and are in queue, add them to army.
export const recruitUnits = (isNewMonth) => {
    if (isNewMonth) {
        let gameData = loadGame()

        for (let unit of gameData.units) {
            if (unit.isRecruitable && unit.queue) {
                if (unit.queue >= unit.recrutpm) {
                    unit.amount += unit.recrutpm
                    unit.queue -= unit.recrutpm
                    printMessage(unit.recruitMessage.replace('##amount##', unit.recrutpm), 'recruit')
                } else {
                    unit.amount += unit.queue
                    printMessage(unit.recruitMessage.replace('##amount##', unit.queue), 'recruit')
                    unit.queue = 0
                }
            }
        }
        saveGame(gameData)
    }
}

// add selected amount of units to recruitment queue
export const addRecruits = (unitName, e, max=false) => {
    let gameData = loadGame()
    let recruitAmount = 0
    let val = Number(document.getElementById(`recruit${unitName}`).value)
    let check = false

    for (let unit of gameData.units) {
        if (unit.name === unitName) {
            const maxAmount = calcMaxUnit(unit.recruitCost)
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
                generateMarkup('recruitmentPanel')
            } else {
                e.target.parentElement.children[0].classList.remove('none')
                setTimeout(() => {e.target.parentElement.children[0].classList.add('none')}, 2000)
            }
        }
    }
}

// check if there is enough gold to pay the army
export const checkUpkeep = (isNewMonth) => {
    if (isNewMonth) {
        let gameData = loadGame()
        gameData.alerts.desertion = false
        
        if (gameData.tempData.armyUpkeep > gameData.tempData.totalGoldGain && gameData.basicResources.gold > 0) {
            printMessage('Our army upkeep is higher than our gold income. Increase gold production or dismiss some units.', 'warning')
        } else if (gameData.tempData.armyUpkeep > gameData.tempData.totalGoldGain && gameData.basicResources.gold === 0) {
            gameData.alerts.desertion = true
            printMessage('We do not have enough gold to pay our army. Our units are deserting!', 'critical')
            saveGame(gameData)
            removeUnitsDesertion()
        } else {
            saveGame(gameData)
        }
    }
    
}

// if there is not enough gold, remove 10% of units per month
const removeUnitsDesertion = () => {
    let gameData = loadGame()
    for (let unit of gameData.units) {
        if (unit.amount) {
            unit.amount -= Math.floor(unit.amount * 0.1)
        }
    }
    saveGame(gameData)
}
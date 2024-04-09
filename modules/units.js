'use strict';

import { loadGame, saveGame } from "./utilities.js"
import { generateMarkup } from "./domhelpers.js"

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
            console.log(unit.amount)
        }
    }

    saveGame(gameData)
    calculateMight()
    generateMarkup('armyManagementPanel')
}
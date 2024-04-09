'use strict';

import { loadGame, saveGame } from "./utilities.js"

// calcualte max recruitable unit
export const calcMaxUnit = (unit) => {
    const gameData = loadGame()
    const gold = gameData.basicResources.gold
    const pop = gameData.basicResources.pop
    const goldCost = unit.recruitCost.gold
    const popCost = unit.recruitCost.pop
    const maxGold = Math.floor(gold / goldCost)
    const maxPop = Math.floor(pop / popCost)

    if (maxGold > maxPop) return maxPop
    else return maxGold 

}
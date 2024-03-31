'use strict';

import { generateMarkup, printMessage } from "./domhelpers.js"
import { loadGame, saveGame } from "./utilities.js"

// Calculate happines. Min 0, max 100. If reach 0 happines, riots will occur (generally pop will die and attack our army. If no army, gold will disappear)
export const calculateHappiness = () => {
    let gameData = loadGame()
    let calculatedHappiness = gameData.basicResources.baseHappiness // 50

    // Positive gains
    gameData.general.tax === 1 ? calculatedHappiness += 20 : null

    // Negative gains
    gameData.alerts.famine ? calculatedHappiness -= 10 : null
    gameData.alerts.overpopulation ? calculatedHappiness -= 5 : null
    gameData.general.tax === 3 ? calculatedHappiness -= 20 : null

    // Happiness cannot go below 0 or above 100
    calculatedHappiness < 0 ? calculatedHappiness = 0 : null
    calculatedHappiness > 100 ? calculatedHappiness = 100 : null

    gameData.tempData.happiness = calculatedHappiness

    // checks if happiness is too low and prints / triggers adequate response
    calculatedHappiness > 0 && calculatedHappiness < 20 ? printMessage('Our population is unhappy! Increase happiness of our population, otherwise our people will riot!', 'warning') : null
    calculatedHappiness === 0 ? (
        printMessage('Our population is rioting!', 'critical'),
        gameData.alerts.riot = true
    ) : null

    saveGame(gameData)
}

// change tax index 
export const changeTax = (id) => {
    let gameData = loadGame()

    gameData.general.tax = id

    saveGame(gameData)
    generateMarkup('management')
}

// checks the current capital level and applies modifiers
export const applyCapitalBonuses = () => {
    let gameData = loadGame()
    const capital = gameData.buildingCapital

    gameData.basicResources.basicSpace = capital.levels[capital.currentLevel - 1].space
    gameData.tempData.commerce = capital.levels[capital.currentLevel - 1].commerce
    gameData.buildingHouse.maxSpace = capital.levels[capital.currentLevel - 1].houses 

    if (capital.currentLevel < capital.maxLevel) {
        gameData.buildingCapital.costTime = capital.levels[capital.currentLevel].costTime
        gameData.buildingCapital.costGold = capital.levels[capital.currentLevel].costGold
        gameData.buildingCapital.costWood = capital.levels[capital.currentLevel].costWood
        gameData.buildingCapital.costStone = capital.levels[capital.currentLevel].costStone
        gameData.buildingCapital.specialUnlock = capital.levels[capital.currentLevel].specialUnlock
    }
    
    saveGame(gameData)
}

// Updates the current building cost for any upgradeable building
export const updateBuildCost = () => {
    let gameData = loadGame()

    for (let i = 0; i < gameData.buildingList.length; i++) {
        const building = gameData.buildingList[i]
        const cl = gameData[building].currentLevel
        const ml = gameData[building].maxLevel

        if (gameData[building].isUpgradeable) {
            gameData[building].effect = gameData[building].levels[cl-1].effect

            // if buliding is not constructed, grabs costs of lvl1, otherwise, grabs costs of the next level
            if (gameData[building].amount === 0) {
                gameData[building].costTime = gameData[building].levels[0].costTime
                gameData[building].costGold = gameData[building].levels[0].costGold
                gameData[building].costWood = gameData[building].levels[0].costWood
                gameData[building].costStone = gameData[building].levels[0].costStone
            } else if (gameData[building].amount === 1 && cl < ml) {
                gameData[building].costTime = gameData[building].levels[cl].costTime
                gameData[building].costGold = gameData[building].levels[cl].costGold
                gameData[building].costWood = gameData[building].levels[cl].costWood
                gameData[building].costStone = gameData[building].levels[cl].costStone
            }
        }  
    }
    saveGame(gameData)
}

// generates events at the beginning of the month
export const generateEvent = (isNewMonth) => {
    if (isNewMonth) {

        // checks if any events are unlocked
        unlockEvents()

        // disable active events from previous month or decrease timed events
        actionActiveEvents()
        
        //determine how many events are genereated (0 - 3)
        let genEvents = 0
        const rnd = Math.floor(Math.random() * 100) + 1
        if (rnd === 0) genEvents = 3
        else if (rnd > 0 && rnd <= 3) genEvents = 2
        else if (rnd > 3 && rnd <= 13) genEvents = 1
        else  genEvents = 0

        // check if any event is generated
        if (genEvents > 0) {
            let gameData = loadGame()
            const totalEvents = gameData.events.length 

            // generate events
            while (genEvents > 0) {
                let gameData = loadGame()
                const eventNumber = Math.floor(Math.random() * totalEvents)

                // if the event is already active and is unlocked, it won't generate it again
                if (!gameData.events[eventNumber].active && gameData.events[eventNumber].unlocked) {
                    // uses rarity modifier
                    const rarity = Math.floor(Math.random() * gameData.events[eventNumber].rarity)
                    if (rarity === 0) {
                        gameData.events[eventNumber].active = true
                        // if the event has random value, generates it
                        if (gameData.events[eventNumber].isRandom) {
                            const min = gameData.events[eventNumber].random.min
                            const max = gameData.events[eventNumber].random.max
                            const val = gameData.events[eventNumber].random.val
                            const value = Math.floor(Math.random() * (max - min) + min)
                            gameData.events[eventNumber][val] = value
                        }
                        genEvents--
                    }
                }   
                saveGame(gameData)
            }  

            // if any event granted build space, add it to max. avalilable space
            calculateBuildSpace()
        }
    }
}

//check active events, then disable active events from previous month or decrease timed events
const actionActiveEvents = () => {
    let gameData = loadGame()
    const totalEvents = gameData.events.length

    for (let i = 0; i < totalEvents; i++) {
        // look for active  event
        if (gameData.events[i].active) {
            // check if the event is timed
            if (gameData.events[i].isTimed) {
                // if event is timed and the timer is larger than 0, decrease timer by 1
                if (gameData.events[i].remainingTime > 1) {
                    gameData.events[i].remainingTime -= 1
                } else {
                    // when timer reaches 0, disable teh event
                    gameData.events[i].active = false
                }
            // if event is not timed, just disable it 
            } else {
                gameData.events[i].active = false
            }
        }
    }

    saveGame(gameData)
}

// if any event granted build space, add it to max. avalilable space
const calculateBuildSpace = () => {
    let gameData = loadGame()
    const totalEvents = gameData.events.length
    for (let i = 0; i < totalEvents; i++) {
        if (gameData.events[i].active && gameData.events[i].type === 'gainFarmSpace') gameData.buildingFarm.maxSpace++
        if (gameData.events[i].active && gameData.events[i].type === 'gainLumberSpace') gameData.buildingLumberyard.maxSpace++
        if (gameData.events[i].active && gameData.events[i].type === 'gainQuarrySpace') gameData.buildingQuarry.maxSpace++
    }
    saveGame(gameData)
}

// unlock or locks events
const unlockEvents = () => {
    let gameData = loadGame()
    const totalEvents = gameData.events.length
    const month = gameData.basicResources.month
    const fame = gameData.basicResources.fame
    const might = gameData.tempData.might

    for (let i = 0; i < totalEvents; i++) {
        if (!gameData.events[i].unlocked) {
            // checks if month, fame, might or special condition is met, if so, unlocks the event, otherwise locks it.
            if (month >= gameData.events[i].unlockConditions.month  
                && fame >= gameData.events[i].unlockConditions.fame
                && might >= gameData.events[i].unlockConditions.might
                && gameData.events[i].unlockConditions.special) {
                    gameData.events[i].unlocked = true
                }
            else {
                gameData.events[i].unlocked = false
            }
        }
    }

    saveGame(gameData)
}
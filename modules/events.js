'use strict';

import { loadGame, saveGame } from "./utilities.js"

// generates events at the beginning of the month
export const generateEvent = (isNewMonth) => {
    if (isNewMonth) {

        // checks if any events are unlocked
        unlockEvents()

        // disable active events from previous month or decrease timed events
        actionActiveEvents()
        
        //determine how many events are genereated (0 - 3)
        let eventNum = 0
        const rnd = Math.floor(Math.random() * 100) + 1
        if (rnd === 0) eventNum = 3
        else if (rnd > 0 && rnd <= 3) eventNum = 2
        else if (rnd > 3 && rnd <= 13) eventNum = 1
        else  eventNum = 0

        // check if any event is generated
        if (eventNum > 0) {
            let gameData = loadGame()
            const totalEvents = gameData.events.length 

            // generate events
            while (eventNum > 0) {
                let gameData = loadGame()
                const id = Math.floor(Math.random() * totalEvents)

                // if the event is already active and is unlocked, it won't generate it again
                if (!gameData.events[id].active && gameData.events[id].unlocked) {
                    // uses rarity modifier
                    const rarity = Math.floor(Math.random() * gameData.events[id].rarity)
                    if (rarity === 0) {
                        gameData.events[id].active = true
                        // if the event has random value, generates it
                        if (gameData.events[id].isRandom) {
                            const val = gameData.events[id].random.val
                            gameData.events[id][val] = generateRandomNumber(gameData.events[id])
                        }
                        eventNum--
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
            gameData.events[i].unlockConditions.special = specialUnlock(gameData.events[i], gameData)
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

// generates random number for the random events
const generateRandomNumber = (event) => {
    const min = event.random.min
    const max = event.random.max
    const value = Math.floor(Math.random() * (max - min) + min)
    return value
}

// check if special unlock condition are met
const specialUnlock = (event, gameData) => {
    if (event.type === 'popHappyGainMultiplier' && gameData.tempData.happiness >= 60) {
        return true
    } else if (event.type === 'popHappyGainMultiplier' && gameData.tempData.happiness < 60) {
        return false
    }
}
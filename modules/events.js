'use strict';

import { loadGame, saveGame } from "./utilities.js"
import { showPanel, showMissionNumber, printMessage } from "./domhelpers.js"

// generates events at the beginning of the month
export const generateEvent = (isNewMonth) => {
    if (isNewMonth) {

        // checks if any events are unlocked
        unlockEvents()

        // disable active events from previous month or decrease timed events
        actionActiveEvents()
        
        //determine how many events are genereated (0 - 3)
        let eventNum = 0
        const rnd = Math.floor(Math.random() * 100)
        if (rnd === 0) eventNum = 3
        else if (rnd > 0 && rnd <= 3) eventNum = 2
        else if (rnd > 3 && rnd <= 13) eventNum = 1
        else  eventNum = 0

        // check if any event is generated
        if (eventNum > 0) {

            // generate events 
            while (eventNum > 0) {
                let generated = false
                generated = checkIfEventIsGenerated()
                if (generated) eventNum--
            }  
        }

        // if any event granted build space, add it to max. avalilable space
        calculateBuildSpace()
    }
}

// check various condition to determine if the event can be generated or not
const checkIfEventIsGenerated = () => {
    let gameData = loadGame()
    const totalEvents = gameData.events.length
    const id = Math.floor(Math.random() * totalEvents)

    // if the event is already active and is unlocked, it won't generate it again
    if (!gameData.events[id].active && gameData.events[id].unlocked) {
        // uses rarity modifier
        const rarity = Math.floor(Math.random() * gameData.events[id].rarity)
        if (rarity === 0) {
            gameData.events[id].active = true
            // generates random number for the random events
            if (gameData.events[id].isRandom) {
                for (let i = 0; i < gameData.events[id].random.length; i++) {
                    const min = gameData.events[id].random[i][1]
                    const max = gameData.events[id].random[i][2]
                    const val = gameData.events[id].random[i][0]
                    const value = Math.floor(Math.random() * (max - min) + min)
                    gameData.events[id][val] = value
                }
            }

            // check if the event is a mission and whether the mission log is full
            if (gameData.events[id].isMission && gameData.tempData.activeMissions < gameData.general.maxMissions) {
                gameData.events[id].rewards = generateRewards(gameData.events[id].rewards)
                gameData.tempData.activeMissions++
                gameData.events[id].isDisplayed = true
                
            } else if (gameData.events[id].isMission && gameData.tempData.activeMissions === gameData.general.maxMissions) {
                return false
            }
            
            saveGame(gameData)
            return true
        }
    }   
    return false
}

// generate rewards for missions
const generateRewards = (rewards) => {
    for (let i = 0; i < rewards.length; i++) {
        rewards[i][1] = Math.floor(Math.random() * (rewards[i][3] - rewards[i][2]) + rewards[i][2])
    }
    return rewards
}

//check active events, then disable active events from previous month or decrease timed events
const actionActiveEvents = () => {
    let gameData = loadGame()
    const totalEvents = gameData.events.length

    for (let i = 0; i < totalEvents; i++) {
        // look for active  event
        if (gameData.events[i].active) {
            // check if the event is timed
            gameData.events[i].isDisplayed = false
            if (gameData.events[i].isTimed) {
                // if event is timed and the timer is larger than 0, decrease timer by 1
                if (gameData.events[i].remainingTime > 1) {
                    gameData.events[i].remainingTime -= 1
                } else {
                    // when timer reaches 0, disable the event
                    gameData.events[i].active = false
                    if (gameData.events[i].isMission) {
                        //gameData.activeMissions = gameData.activeMissions.filter(item => item.id !== gameData.events[i].id)
                        gameData.tempData.activeMissions--
                        printMessage(`A mission <span class='text-bold'>${gameData.events[i].missionDescription.name}</span> has expired!`,'warning')
                    }
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

// check if special unlock condition are met
const specialUnlock = (event, gameData) => {
    if (event.type === 'popHappyGainMultiplier' && gameData.tempData.happiness < 60) return false
    return true
}

// adds reward from mission
const addMissionReward = (mission) => {
    let gameData = loadGame()

    if (mission.missionType === 'General') {
        for (let i = 0; i < mission.rewards.length; i++) {
            if (mission.rewards[i][0] === 'pop') gameData.basicResources.pop += mission.rewards[i][1]
            if (mission.rewards[i][0] === 'gold') gameData.basicResources.gold += mission.rewards[i][1]
            if (mission.rewards[i][0] === 'food') gameData.basicResources.food += mission.rewards[i][1]
            if (mission.rewards[i][0] === 'fame') gameData.basicResources.fame += mission.rewards[i][1]
        }
    }

    // in case pop is added, check if pop > space and if so, triggers overpopulation
    if (gameData.basicResources.pop > gameData.tempData.totalSpace) gameData.alerts.overpopulation = true

    saveGame(gameData)
}

// removes mission from the log after accept / reject 
export const removeMission = (mission, status) => {
    let gameData = loadGame()
    let id = Number(mission.slice(7))
    const totalEvents = gameData.events.length

    //gameData.activeMissions = gameData.activeMissions.filter(item => item.id !== id)
    gameData.tempData.activeMissions--

    for (let i = 0; i < totalEvents; i++) {
        if (gameData.events[i].id === id) {
            gameData.events[i].active = false
            saveGame(gameData)
            if (!status) {
                printMessage(gameData.events[i].missionDescription.failure, 'warning')
            } else if (status) {
                printMessage(gameData.events[i].missionDescription.success, 'info')
                addMissionReward(gameData.events[i])
            }
             
        }
    }

    showPanel(0)
    showMissionNumber()
}
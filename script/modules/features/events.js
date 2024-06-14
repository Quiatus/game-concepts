'use strict';

import { showPanel, printMessage, displayMenu } from "../dom/general.js"

// generates events at the beginning of the month
export const generateEvent = (gameData) => {
    // checks if any events are unlocked
    unlockEvents(gameData)

    // disable active events from previous month or decrease timed events
    actionActiveEvents(gameData)
    
    //determine how many events are genereated (0 - 3)
    let eventNum = 0
    const rnd = Math.floor(Math.random() * 200)
    if (rnd >= 0 && rnd < 178) eventNum = 0
    else if (rnd === 178) eventNum = 3
    else if (rnd > 178 && rnd <= 180) eventNum = 2
    else eventNum = 1

    // check if any event is generated
    if (eventNum > 0) {

        // generate events 
        while (eventNum > 0) {
            let generated = false
            generated = checkIfEventIsGenerated(gameData)
            if (generated) eventNum--
        }  
    }

    // if any event granted build space, add it to max. avalilable space
    calculateBuildSpace(gameData)
}

// check various condition to determine if the event can be generated or not
const checkIfEventIsGenerated = (gameData) => {
    const id = Math.floor(Math.random() * gameData.events.length)
    let event = gameData.events[id]

    // if the event is already active and is unlocked, it won't generate it again
    if (!event.active && event.unlocked) {
        // uses rarity modifier
        const rarity = Math.floor(Math.random() * event.rarity)
        if (rarity === 0) {
            event.active = true
            // generates random number for the random events
            if (event.isRandom) {
                for (let item of event.random) {
                    const [val, min, max] = item
                    const value = Math.floor(Math.random() * (max - min) + min)
                    event[val] = value
                }
            }

            // check if the event is a mission and whether the mission log is full
            if (event.isMission && gameData.tempData.activeMissions < gameData.general.maxMissions) {
                event.rewards = generateRewards(event.rewards)
                gameData.tempData.activeMissions++
                event.isDisplayed = true
            } else if (event.isMission && gameData.tempData.activeMissions === gameData.general.maxMissions) {
                return false
            }
            return true
        }
    }   
    return false
}

// generate rewards for missions
const generateRewards = (rewards) => {
    for (let reward of rewards) {
        // reward, max, min, multiplier
        reward[1] = Math.floor(Math.random() * (reward[3] - reward[2]) + reward[2]) * reward[4]
    }
    return rewards
}

//check active events, then disable active events from previous month or decrease timed events
const actionActiveEvents = (gameData) => {
    for (let event of gameData.events) {
        // look for active  event
        if (event.active) {
            // check if the event is timed
            event.isDisplayed = false
            if (event.isTimed) {
                // if event is timed and the timer is larger than 0, decrease timer by 1
                if (event.remainingTime > 1) {
                    event.remainingTime -= 1
                } else {
                    // when timer reaches 0, disable the event
                    event.active = false
                    if (event.isMission) {
                        gameData.tempData.activeMissions--
                        printMessage(`A mission <span class='text-bold'>${event.missionDescription.name}</span> has expired!`,'warning', gameData)
                    }
                }
            // if event is not timed, just disable it 
            } else {
                event.active = false
            }
        }
    }
}

// if any event granted build space, add it to max. avalilable space
const calculateBuildSpace = (gameData) => {
    for (let event of gameData.events) {
        if (event.active && event.type === 'gainFarmSpace') gameData.buildings[2].maxSpace++
        if (event.active && event.type === 'gainLumberSpace') gameData.buildings[3].maxSpace++
        if (event.active && event.type === 'gainQuarrySpace') gameData.buildings[4].maxSpace++
    }
}

// unlock or locks events
const unlockEvents = (gameData) => {
    for (let event of gameData.events) {

        if (event?.unlockConditions) {
            event.unlockConditions.special = specialUnlock(event, gameData)
            // checks if month, fame, might or special condition is met, if so, unlocks the event, otherwise locks it.
            if (gameData.basicResources.month >= event.unlockConditions.month  
                && gameData.basicResources.fame >= event.unlockConditions.fame
                && gameData.tempData.might >= event.unlockConditions.might
                && event.unlockConditions.special) {
                    event.unlocked = true
                }
            else {
                event.unlocked = false
            }
        }
    }
}

// check if special unlock condition are met
const specialUnlock = (event, gameData) => {
    if (event.type === 'popHappyGainMultiplier' && gameData.tempData.happiness < 60) return false
    if (event.type === 'popGainRiot' && !gameData.alerts.riot) return false
    return true
}

// adds reward from mission
const addMissionReward = (mission, gameData) => {
    if (mission.missionType === 'Instant') {
        for (let [reward, amount] of mission.rewards) {
            if (reward === 'pop') gameData.basicResources.pop += amount
            if (reward === 'gold') gameData.basicResources.gold += amount
            if (reward === 'food') gameData.basicResources.food += amount
            if (reward === 'fame') gameData.basicResources.fame += amount
        }
    }

    // in case pop is added, check if pop > space and if so, triggers overpopulation
    if (gameData.basicResources.pop > gameData.tempData.totalSpace) gameData.alerts.overpopulation = true
}

// removes mission from the log after accept / reject / completed
export const removeMission = (mission, gameData) => {
    let missionId = mission.target.parentNode.parentNode.id
    let button = mission.target.id

    let id = Number(missionId.slice(7))

    gameData.tempData.activeMissions--

    for (let event of gameData.events) {
        if (event.id === id) {
            event.active = false
            if (button === 'btnRejectMission') {
                printMessage(event.missionDescription.failure, 'warning', gameData)
            } else if (button === 'btnAcceptMission') {
                printMessage(event.missionDescription.success, 'reward', gameData)
                addMissionReward(event, gameData)
            }
             
        }
    }

    showPanel('overviewPanel', gameData, true)
    displayMenu(gameData)
}
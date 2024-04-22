
/*
Generate Missions panel.

## Featurs
- Display all available missions
- Allows player to complete or reject the missions

## Functions
generateMissions: Generates the box for each active mission. This fn is called from showActiveMissions function
displayMission: Generates the main panel 
showActiveMissions: iterates over the list of mission events. If the mission is active calls generateMissions fn, which then generate the html for the unit with all the information
displayMissionReward: generates the reward markup based on the reward type
displayRemainingTimeMission: display approx. time before the mission expires
*/

import { converThousand } from "./general.js"

export const displayMission = () => {
    const rightPanel = document.getElementById('rightPanel')
    return rightPanel.innerHTML = `
    <h1>Missions</h1>
    <div id="missions">  
    </div>`
}

 const generateMissions = (mission) => {
    return `
    <div class="box" id="mission${mission.id}">
        <h2 class='text-left'>${mission.missionDescription.name}</h2>
        <div class="mission-description">
            <p><span class='text-gray'>Objective:</span> ${mission.missionDescription.objective}</p>
            <p class="text-it">${mission.missionDescription.description}</p>
            <p class="timer"><span class='text-gray'>Expires:</span> ${displayRemainingTimeMission(mission.remainingTime)}</p>
        </div>
        

        <hr class="separator">
        Reward
        <div class='resource-box width100'>
        ${displayMissionReward(mission.rewards)}
        </div>

        <hr class="separator">

        <div class="buttons-box">
            <button class="btnMission" id="btnAcceptMission">Accept</button>
            <button class="btnMission" id="btnRejectMission">Reject</button>
        </div>
        
    </div>  `
}

export const showActiveMissions = (gameData) => {
    const missions = document.getElementById('missions')
    missions.innerHTML = `<p class='mtbb text-big text-gray'>Active missions: ${gameData.tempData.activeMissions} / ${gameData.general.maxMissions}</p>`
    const missionSubdiv = document.createElement('div')
    missionSubdiv.classList = 'smallBoxDiv'
    
    for (let event of gameData.events) {
        if (event.active && event.isMission) {
            const missionDiv = document.createElement('div')
            const mission = event
            missionDiv.innerHTML = generateMissions(mission)
            missionSubdiv.append(missionDiv)
        }
    }  

    missions.append(missionSubdiv)
}

const displayRemainingTimeMission = (time) => {
    if (time > 100) return `100 > <img class='img-s' src='media/res/month.png'>`
    if (time > 50 && time <= 100) return `50 - 100 <img class='img-s' src='media/res/month.png'>`
    if (time > 25 && time <= 50) return `25 - 50 <img class='img-s' src='media/res/month.png'>`
    if (time > 10 && time <= 25) return `10 - 25 <img class='img-s' src='media/res/month.png'>`
    if (time <= 10 ) return `< 10 <img class='img-s' src='media/res/month.png'>`
}

const displayMissionReward = (rewards) => { 
    let div = document.createElement('div')

    for (let [reward, amount] of rewards) {
        let sub = document.createElement('div')
        
        if (reward === 'pop') sub.innerHTML = `<img class="img-s" src="media/res/pop.png"><span class="text-purple">${converThousand(amount)}</span>`
        if (reward === 'gold') sub.innerHTML = `<img class="img-s" src="media/res/gold.png"><span class="text-gold">${converThousand(amount)}</span>`
        if (reward === 'food') sub.innerHTML = `<img class="img-s" src="media/res/food.png"><span class="text-yellow">${converThousand(amount)}</span>`
        if (reward === 'fame') sub.innerHTML = `<img class="img-s" src="media/res/fame.png"><span class="text-white">${converThousand(amount)}</span>`

        div.append(sub)
    }
    
    return div.innerHTML
}
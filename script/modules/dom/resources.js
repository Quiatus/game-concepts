import { converThousand } from "./general.js"

export const displayResourceBox = (gameData) => {    
    const resourcesText = document.getElementById('resourceBox')
    return resourcesText.innerHTML =
    `<div class="res res-nm"><div class="toolbox"><img class='img-m' src='media/res/month.png'><span class="tooltip">Month</span></div><span class='text-bold'>${converThousand(gameData.basicResources.month)}</span></div>
    <div class="res res-b"><div class="toolbox"><img class='img-m' src='media/res/pop.png'><span class="tooltip">Current population / Total space</span></div><span class='text-purple'>${popText(gameData.basicResources.pop, gameData.tempData.totalSpace)}</span></div>
    <div class="res"><div class="toolbox"><img class='img-m' src='media/res/gold.png'><span class="tooltip">Gold</span></div><span class='text-gold'>${converThousand(gameData.basicResources.gold)}</span></div>
    <div class="res"><div class="toolbox"><img class='img-m' src='media/res/food.png'><span class="tooltip">Food</span></div><span class='text-yellow'>${converThousand(gameData.basicResources.food)}</span></div>
    <div class="res res-nm"><div class="toolbox"><img class='img-m' src='media/res/wood.png'><span class="tooltip">Wood</span></div><span class='text-brown'>${converThousand(gameData.basicResources.wood)}</span></div>
    <div class="res res-nm"><div class="toolbox"><img class='img-m' src='media/res/stone.png'><span class="tooltip">Stone</span></div><span class='text-darkgray'>${converThousand(gameData.basicResources.stone)}</span></div>
    <div class="res"><hr class="vseparator"><div class="toolbox"><img class='img-m' src='media/res/fame.png'><span class="tooltip">Fame</span></div><span>${converThousand(gameData.basicResources.fame)}</span></div>
    <div class="res"><div class="toolbox"><img class='img-m' src='media/army/army.png'><span class="tooltip">Might</span></div><span>${converThousand(gameData.tempData.might)}</span></div>
    <div class="res res-nm"><div class="toolbox"><img class='img-m' src='media/res/fame.png'><span class="tooltip">Happiness</span></div><span class='text-bold'>${changeHappinessColor(gameData.tempData.happiness)}</span></div>
    <div class="res res-nm"><div class="toolbox"><img class='img-m' src='media/army/army_status.png'><span class="tooltip">Army readiness</span></div><span class="text-bold">${getArmyStatus(gameData)}</span></div>
    
    <hr class="separator" id="res-sep">

    <div class="alert-div text-disabled text-big">
        ${displayActiveAlerts(gameData)}
    </div>`
}

const displayActiveAlerts = (gameData) => {
    let alerts = document.createElement('div')

    for (let alert in gameData.alerts) {
        const span = document.createElement('span')
        span.textContent = alert
        if (gameData.alerts[alert]) span.classList.add('text-red', 'text-bold')
        alerts.append(span)
    }

    return alerts.innerHTML
}

const getArmyStatus = (gameData) => {
    if (gameData.general.armyStatus) return `<span class='text-green'>Ready</span>`
    return `<span class='text-orange'>Exhausted</span>`
}

const changeHappinessColor = (happiness) => {
    if (happiness < 20) return `<span class="text-red">${happiness} %</span>`
    else if (happiness >= 20 && happiness < 40) return `<span class="text-orange">${happiness} %</span>`
    else if (happiness >= 40 && happiness < 60) return `<span class="text-gold">${happiness} %</span>`
    else if (happiness >= 60 && happiness < 80) return `<span class="text-green">${happiness} %</span>`
    else if (happiness >= 80) return `<span class="text-darkgreen">${happiness} %</span>`
}

const popText = (pop, space) => {
    if (pop > space) return `<span class="text-red">${converThousand(pop)}<span class="text-normal"> / ${converThousand(space)}</span></span>`
    return `<span>${converThousand(pop)}<span class="text-normal"> / ${converThousand(space)}</span></span>`
}
import { loadGame } from "./utilities.js"

const messages = document.querySelector('.message-div')
const texts = document.querySelectorAll('span')
const menuButtons = document.querySelectorAll('.menuBtn')
const rightPanels = document.querySelectorAll('.right-panel')
const alertsPanel = document.querySelector('.alert-div')

const converThousand = (string) => string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const newMonthGains = () => {
    let gameData = loadGame()
    let addedGold = '', addedFood = '', addedPop = ''

    gameData.resourceChange.gold > 0 ? addedGold = `<span class="text-gold text-bold"> ${converThousand(gameData.resourceChange.gold)} </span> gold,` : null
    gameData.resourceChange.pop > 0 ? addedPop = `<span class="text-purple text-bold"> ${converThousand(gameData.resourceChange.pop)} </span> pops,` : null
    gameData.resourceChange.food > 0 ? addedFood = `<span class="text-yellow text-bold"> ${converThousand(gameData.resourceChange.food)} </span> food,` : null

    let res = `Gained ${addedPop} ${addedGold} ${addedFood}.`.replace(',.', '.').replace(', .', '.')
    const repl = res.lastIndexOf(',')
    repl > 0 ? res = res.substring(0, repl) + ' and ' + res.substring(repl+1) : null

    return res
}

export const clearMessages = (isNewMonth) => {
    isNewMonth ? messages.innerHTML = '' : null
}

export const checkActiveAlerts = (alerts) => {
    alertsPanel.innerHTML = ''
    const alertList = alerts.listActiveAlerts()
    

    for (let i = 0; i < alertList.length; i++) {
        const span = document.createElement('span')
        span.textContent = alertList[i]
        alertsPanel.append(span)
    }
}

export const printMessage = (text, type='info') => {
    const msg = document.createElement('p');
    msg.innerHTML = text
    if (type==='critical') {
        msg.className = 'text-red'
    } 
    if (type==='warning') {
        msg.className = 'text-orange'
    } 
    if (type==='info') {
        msg.className = 'text-white'
    } 
    if (type==='gains') {
        msg.innerHTML = newMonthGains();
    }

    messages.appendChild(msg)
}

export const printText = () => {
    let gameData = loadGame()
    
    texts.forEach(item => {
        // Resource text
        item.id === 'month' ? item.textContent = converThousand(gameData.basicResources.month) : null
        item.id === 'gold' ? item.textContent = converThousand(gameData.basicResources.gold) : null
        item.id === 'pop' ? item.textContent = converThousand(gameData.basicResources.pop) : null
        item.id === 'maxPop' ? item.textContent = ` / ${converThousand(gameData.tempData.totalSpace)}` : null
        item.id === 'food' ? item.textContent = converThousand(gameData.basicResources.food) : null
        item.id === 'wood' ? item.textContent = converThousand(gameData.basicResources.wood) : null
        item.id === 'stone' ? item.textContent = converThousand(gameData.basicResources.stone) : null
        item.id === 'happiness' ? item.innerHTML = changeHappinessColor(gameData.tempData.happiness) : null

        // Settings 
        item.id === 'tax-level' ? item.innerHTML = changeTaxText(gameData.general.tax) : null
        item.id === 'tax-gain' ? item.textContent = (gameData.general.tax * 5) : null

        // Statistics text
        item.id === 'stat-space-cap' ? item.textContent = converThousand(gameData.basicResources.basicSpace) : null
        item.id === 'stat-space-house' ? item.textContent = converThousand(gameData.tempData.houseSpace) : null
        item.id === 'stat-space-total' ? item.textContent = converThousand(gameData.tempData.totalSpace) : null
        item.id === 'stat-space-free' ? item.textContent = converThousand(gameData.tempData.totalSpace - gameData.basicResources.pop) : null
        item.id === 'stat-build-house' ? item.textContent = converThousand(gameData.buildingHouse.amount) : null
        item.id === 'stat-build-farm' ? item.textContent = converThousand(gameData.buildingFarm.amount) : null
        item.id === 'stat-gen-hap' ? item.innerHTML = changeHappinessColor(gameData.tempData.happiness) : null

        // Building - house text
        item.id === 'building-house-cost' 
        ? item.innerHTML = `<span class='text-gold'>${converThousand(gameData.buildingHouse.costGold)}</span>` 
            + (gameData.buildingHouse.costWood > 0 ? ` • <span class='text-brown'>${converThousand(gameData.buildingHouse.costWood)}</span>` : ``)
            + (gameData.buildingHouse.costStone > 0 ? ` • <span class='text-gray'>${converThousand(gameData.buildingHouse.costStone)}</span>` : ``)
        : null
        item.id === 'building-house-constrtime' ? item.textContent = `${converThousand(gameData.buildingHouse.costTime)} months` : null
        item.id === 'building-house-amount' ? item.textContent = converThousand(gameData.buildingHouse.amount) : null
        item.id === 'building-house-descr' ? item.textContent = converThousand(gameData.buildingHouse.effect) : null
        item.id === 'building-house-progress' 
        ? gameData.buildingHouse.isBeingBuilt ? item.textContent = `${100 / gameData.buildingHouse.costTime * gameData.buildingHouse.buildProgress} %` : item.textContent = '-'  
        : null

        // Building - farm text
        item.id === 'building-farm-cost' 
        ? item.innerHTML = `<span class='text-gold'>${converThousand(gameData.buildingFarm.costGold)}</span>` 
            + (gameData.buildingFarm.costWood > 0 ? ` • <span class='text-brown'>${converThousand(gameData.buildingFarm.costWood)}</span>` : ``)
            + (gameData.buildingFarm.costStone > 0 ? ` • <span class='text-gray'>${converThousand(gameData.buildingFarm.costStone)}</span>` : ``)
        : null
        item.id === 'building-farm-constrtime' ? item.textContent = `${converThousand(gameData.buildingFarm.costTime)} months` : null
        item.id === 'building-farm-amount' ? item.textContent = converThousand(gameData.buildingFarm.amount) : null
        item.id === 'building-farm-descr' ? item.textContent = converThousand(gameData.buildingFarm.effect) : null
        item.id === 'building-farm-space' ? item.textContent = converThousand(gameData.buildingFarm.space) : null
        item.id === 'building-farm-progress' 
        ? gameData.buildingFarm.isBeingBuilt ? item.textContent = `${100 / gameData.buildingFarm.costTime * gameData.buildingFarm.buildProgress} %` : item.textContent = '-'  
        : null
    })
}

export const showGeneralPanel = () => {
    rightPanels.forEach(panel => panel.classList.add('none'))
    rightPanels[0].classList.remove('none')
}

const changeHappinessColor = (happiness) => {
    if (happiness < 20) {
        return `<span class="text-red">${happiness} %</span>`
    } else if (happiness >= 20 && happiness < 40) {
        return `<span class="text-brown">${happiness} %</span>`
    } else if (happiness >= 40 && happiness < 60) {
        return `<span class="text-gold">${happiness} %</span>`
    } else if (happiness >= 60 && happiness < 80) {
        return `<span class="text-green">${happiness} %</span>`
    } else if (happiness >= 80) {
        return `<span class="text-darkgreen">${happiness} %</span>`
    }
}

const changeTaxText = (tax) => {
    if (tax === 1) {
        return '<span class="text-green">Low</span>'
    } else if (tax === 2) {
        return '<span class="text-gold">Balanced</span>'
    } else if (tax === 3) {
        return '<span class="text-red">High</span>'
    }
}

menuButtons.forEach(btn => {btn.addEventListener('click', () => {
    rightPanels.forEach(panel => panel.classList.add('none'))
    btn.id == 'menuBtnGeneral' ? showGeneralPanel() : null
    btn.id == 'menuBtnManagement' ? rightPanels[1].classList.remove('none') : null
    btn.id == 'menuBtnBuildings' ? rightPanels[2].classList.remove('none') : null
})})
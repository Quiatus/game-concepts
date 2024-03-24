import { loadGame } from "./utilities.js"

const messages = document.querySelector('.message-div')
const texts = document.querySelectorAll('span')
const menuButtons = document.querySelectorAll('.menuBtn')
const rightPanels = document.querySelectorAll('.right-panel')
const alertsPanel = document.querySelector('.alert-div')

const converThousand = (string) => string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const newMonthGains = () => {
    let gameData = loadGame()
    let addedGold = '', addedFood = '', addedPop = '', addedWood = '', addedStone = ''

    gameData.resourceChange.gold > 0 ? addedGold = `<span class="text-gold text-bold"> ${converThousand(gameData.resourceChange.gold)} </span> gold,` : null
    gameData.resourceChange.pop > 0 ? addedPop = `<span class="text-purple text-bold"> ${converThousand(gameData.resourceChange.pop)} </span> pops,` : null
    gameData.resourceChange.food > 0 ? addedFood = `<span class="text-yellow text-bold"> ${converThousand(gameData.resourceChange.food)} </span> food,` : null
    gameData.resourceChange.wood > 0 ? addedWood = `<span class="text-brown text-bold"> ${converThousand(gameData.resourceChange.wood)} </span> wood,` : null
    gameData.resourceChange.stone > 0 ? addedStone = `<span class="text-gray text-bold"> ${converThousand(gameData.resourceChange.stone)} </span> stone,` : null

    let res = `Gained ${addedPop}${addedGold}${addedFood}${addedWood}${addedStone}.`.replace(',.', '.').replace(', .', '.')
    console.log(res)
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
        item.id === 'stat-build-lumber' ? item.textContent = converThousand(gameData.buildingLumberyard.amount) : null
        item.id === 'stat-build-quarry' ? item.textContent = converThousand(gameData.buildingQuarry.amount) : null
        item.id === 'stat-gen-hap' ? item.innerHTML = changeHappinessColor(gameData.tempData.happiness) : null

        // Economics text

        item.id === 'econ-p-birth' ? gameData.resourceChange.pop > 0 ? item.textContent = converThousand(gameData.resourceChange.pop) : item.textContent = '-' : null
        item.id === 'econ-p-totalgain' ? item.textContent = converThousand(calcEconomy('p')[0]) : null
        item.id === 'econ-p-left' ? gameData.tempData.popLeft > 0 ? item.textContent = converThousand(gameData.tempData.popLeft) : item.textContent = '-' : null
        item.id === 'econ-p-death' ? gameData.tempData.popDied > 0 ? item.textContent = converThousand(gameData.tempData.popDied) : item.textContent = '-' : null
        item.id === 'econ-p-totalloss' ? item.textContent = converThousand(calcEconomy('p')[1]) : null
        item.id === 'econ-p-total' ? item.innerHTML = converThousand(calcEconomy('p')[2]) : null

        item.id === 'econ-g-tax' ? gameData.resourceChange.gold > 0 ? item.textContent = converThousand(gameData.resourceChange.gold) : item.textContent = '-' : null
        item.id === 'econ-g-totalgain' ? item.textContent = converThousand(calcEconomy('g')[0]) : null
        item.id === 'econ-g-totalloss' ? item.textContent = converThousand(calcEconomy('g')[1]) : null
        item.id === 'econ-g-total' ? item.innerHTML = converThousand(calcEconomy('g')[2]) : null

        item.id === 'econ-f-farm' ? gameData.resourceChange.food > 0 ? item.textContent = converThousand(gameData.resourceChange.food) : item.textContent = '-' : null
        item.id === 'econ-f-totalgain' ? item.textContent = converThousand(calcEconomy('f')[0]) : null
        item.id === 'econ-f-people' ? gameData.tempData.consumedFood > 0 ? item.textContent = converThousand(gameData.tempData.consumedFood) : item.textContent = '-' : null
        item.id === 'econ-f-totalloss' ? item.textContent = converThousand(calcEconomy('f')[1]) : null
        item.id === 'econ-f-total' ? item.innerHTML = converThousand(calcEconomy('f')[2]) : null

        item.id === 'econ-w-lumber' ? gameData.resourceChange.wood > 0 ? item.textContent = converThousand(gameData.resourceChange.wood) : item.textContent = '-' : null
        item.id === 'econ-w-totalgain' ? item.textContent = converThousand(calcEconomy('w')[0]) : null
        item.id === 'econ-w-totalloss' ? item.textContent = converThousand(calcEconomy('w')[1]) : null
        item.id === 'econ-w-total' ? item.innerHTML = converThousand(calcEconomy('w')[2]) : null

        item.id === 'econ-s-quarry' ? gameData.resourceChange.stone > 0 ? item.textContent = converThousand(gameData.resourceChange.stone) : item.textContent = '-' : null
        item.id === 'econ-s-totalgain' ? item.textContent = converThousand(calcEconomy('s')[0]) : null
        item.id === 'econ-s-totalloss' ? item.textContent = converThousand(calcEconomy('s')[1]) : null
        item.id === 'econ-s-total' ? item.innerHTML = converThousand(calcEconomy('s')[2]) : null

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

        // Building - lumberyard text
        item.id === 'building-lumber-cost' 
        ? item.innerHTML = `<span class='text-gold'>${converThousand(gameData.buildingLumberyard.costGold)}</span>` 
            + (gameData.buildingLumberyard.costWood > 0 ? ` • <span class='text-brown'>${converThousand(gameData.buildingLumberyard.costWood)}</span>` : ``)
            + (gameData.buildingLumberyard.costStone > 0 ? ` • <span class='text-gray'>${converThousand(gameData.buildingLumberyard.costStone)}</span>` : ``)
        : null
        item.id === 'building-lumber-constrtime' ? item.textContent = `${converThousand(gameData.buildingLumberyard.costTime)} months` : null
        item.id === 'building-lumber-amount' ? item.textContent = converThousand(gameData.buildingLumberyard.amount) : null
        item.id === 'building-lumber-descr' ? item.textContent = converThousand(gameData.buildingLumberyard.effect) : null
        item.id === 'building-lumber-space' ? item.textContent = converThousand(gameData.buildingLumberyard.space) : null
        item.id === 'building-lumber-progress' 
        ? gameData.buildingLumberyard.isBeingBuilt ? item.textContent = `${100 / gameData.buildingLumberyard.costTime * gameData.buildingLumberyard.buildProgress} %` : item.textContent = '-'  
        : null

        // Building - quarry text
        item.id === 'building-quarry-cost' 
        ? item.innerHTML = `<span class='text-gold'>${converThousand(gameData.buildingQuarry.costGold)}</span>` 
            + (gameData.buildingQuarry.costWood > 0 ? ` • <span class='text-brown'>${converThousand(gameData.buildingQuarry.costWood)}</span>` : ``)
            + (gameData.buildingQuarry.costStone > 0 ? ` • <span class='text-gray'>${converThousand(gameData.buildingQuarry.costStone)}</span>` : ``)
        : null
        item.id === 'building-quarry-constrtime' ? item.textContent = `${converThousand(gameData.buildingQuarry.costTime)} months` : null
        item.id === 'building-quarry-amount' ? item.textContent = converThousand(gameData.buildingQuarry.amount) : null
        item.id === 'building-quarry-descr' ? item.textContent = converThousand(gameData.buildingQuarry.effect) : null
        item.id === 'building-quarry-space' ? item.textContent = converThousand(gameData.buildingQuarry.space) : null
        item.id === 'building-quarry-progress' 
        ? gameData.buildingQuarry.isBeingBuilt ? item.textContent = `${100 / gameData.buildingQuarry.costTime * gameData.buildingQuarry.buildProgress} %` : item.textContent = '-'  
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

const calcEconomy = (econType) => {
    let gameData = loadGame()
    let results = [0, 0, ``]
    let total = 0

    if (econType === 'p') {
        results[0] = gameData.resourceChange.pop 
        results[1] = gameData.tempData.popDied + gameData.tempData.popLeft
    } else if (econType === 'g') {
        results[0] = gameData.resourceChange.gold 
    } else if (econType === 'f') {
        results[0] = gameData.resourceChange.food 
        results[1] = gameData.tempData.consumedFood
    } else if (econType === 'w') {
        results[0] = gameData.resourceChange.wood 
    } else if (econType === 's') {
        results[0] = gameData.resourceChange.stone 
    }

    total = results[0] - results[1]

    results[0] === 0 ? results[0] = '-' : null
    results[1] === 0 ? results[1] = '-' : null

    if (total > 0) {
        results[2] = `<span class='text-green'>+ ${total}</span>`
    } else if (total < 0) {
        results[2] = `<span class='text-red'>${total}</span>`
    } else {
        results[2] = `-`
    }

    return results
}

menuButtons.forEach(btn => {btn.addEventListener('click', () => {
    rightPanels.forEach(panel => panel.classList.add('none'))
    btn.id == 'menuBtnGeneral' ? showGeneralPanel() : null
    btn.id == 'menuBtnManagement' ? rightPanels[1].classList.remove('none') : null
    btn.id == 'menuBtnBuildings' ? rightPanels[2].classList.remove('none') : null
})})
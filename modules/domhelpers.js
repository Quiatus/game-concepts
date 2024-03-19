const messages = document.querySelector('.message-div')
const texts = document.querySelectorAll('span')
const menuButtons = document.querySelectorAll('.menuBtn')
const rightPanels = document.querySelectorAll('.right-panel')

const converThousand = (string) => string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const newMonthGains = (gold, pop) => {
    let addedGold, addedPop = ''

    gold.getResourceChange() > 0 ? addedGold = `<span class="text-gold text-bold"> ${converThousand(gold.getResourceChange())} </span> gold,` : null
    pop.getResourceChange() > 0 ? addedPop = `<span class="text-purple text-bold"> ${converThousand(pop.getResourceChange())} </span> pops,` : null

    let res = `Gained ${addedPop} ${addedGold}.`.replace(',.', '.').replace(', .', '.')
    const repl = res.lastIndexOf(',')
    repl > 0 ? res = res.substring(0, repl) + ' and ' + res.substring(repl+1) : null

    return res
}

export const clearMessages = () => {
    let child = messages.lastElementChild;
    while (child) {
        messages.removeChild(child);
        child = messages.lastElementChild;
    }   
}

export const printMessage = (text, type='info', {gold, pop}={}) => {
    const msg = document.createElement('p');
    msg.textContent = text
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
        msg.innerHTML = newMonthGains(gold, pop);
    }

    messages.appendChild(msg)
}

export const printText = (month, gold, pop, food, wood, stone, house) => {
    texts.forEach(item => {
        item.id === 'month' ? item.textContent = converThousand(month.getResource()) : null
        item.id === 'gold' ? item.textContent = converThousand(gold.getResource()) : null
        item.id === 'pop' ? item.textContent = converThousand(pop.getResource()) : null
        item.id === 'maxPop' ? item.textContent = ` / ${converThousand(pop.totalSpace())}` : null
        item.id === 'food' ? item.textContent = converThousand(food.getResource()) : null
        item.id === 'wood' ? item.textContent = converThousand(wood.getResource()) : null
        item.id === 'stone' ? item.textContent = converThousand(stone.getResource()) : null

        item.id === 'stat-space-cap' ? item.textContent = converThousand(pop.basicSpace) : null
        item.id === 'stat-space-house' ? item.textContent = converThousand(house.TotalSpace()) : null
        item.id === 'stat-space-total' ? item.textContent = converThousand(pop.totalSpace()) : null
        item.id === 'stat-space-free' ? item.textContent = converThousand(pop.totalSpace() - pop.getResource()) : null
        item.id === 'stat-build-house' ? item.textContent = converThousand(house.amountBuilt) : null

        item.id === 'building-house-cost' 
        ? item.innerHTML = `<span class='text-gold'>${converThousand(house.buildCostGold)}</span>` 
            + (house.buildCostWood > 0 ? ` • <span class='text-brown'>${converThousand(house.buildCostWood)}</span>` : ``)
            + (house.buildCostStone > 0 ? ` • <span class='text-gray'>${converThousand(house.buildCostStone)}</span>` : ``)
        : null

        item.id === 'building-house-constrtime' ? item.textContent = `${converThousand(house.constructionTime)} months` : null
        item.id === 'building-house-built' ? item.textContent = converThousand(house.amountBuilt) : null
        item.id === 'building-house-space' ? item.textContent = converThousand(house.space) : null
        item.id === 'building-house-progress' 
        ? house.isBeingConstructed ? item.textContent = `${house.calculateProgress()} %` : item.textContent = '-'  
        : null
    })
}

export const showGeneralPanel = () => {
    rightPanels.forEach(panel => panel.classList.add('none'))
    rightPanels[0].classList.remove('none')
}

menuButtons.forEach(btn => {btn.addEventListener('click', () => {
    rightPanels.forEach(panel => panel.classList.add('none'))
    btn.id == 'menuBtnGeneral' ? showGeneralPanel() : null
    btn.id == 'menuBtnManagement' ? rightPanels[1].classList.remove('none') : null
    btn.id == 'menuBtnBuildings' ? rightPanels[2].classList.remove('none') : null
})})
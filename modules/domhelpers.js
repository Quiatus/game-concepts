const messages = document.querySelector('.message-div')
const texts = document.querySelectorAll('span')
const menuButtons = document.querySelectorAll('.menuBtn')
const rightPanels = document.querySelectorAll('.right-panel')

const converThousand = (string) => string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const newMonthGains = (args) => {
    let addedGold, addedPop = ''

    args.gold.getResourceChange() > 0 ? addedGold = `<span class="text-gold text-bold"> ${converThousand(args.gold.getResourceChange())} </span> gold,` : null
    args.pop.getResourceChange() > 0 ? addedPop = `<span class="text-purple text-bold"> ${converThousand(args.pop.getResourceChange())} </span> pops,` : null

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

export const printMessage = (text, type='info', args={}) => {
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
        msg.innerHTML = newMonthGains(args);
    }

    messages.appendChild(msg)
}

export const printText = (args) => {
    texts.forEach(item => {
        item.id === 'month' ? item.textContent = converThousand(args.month.getResource()) : null
        item.id === 'gold' ? item.textContent = converThousand(args.gold.getResource()) : null
        item.id === 'pop' ? item.textContent = converThousand(args.pop.getResource()) : null
        item.id === 'maxPop' ? item.textContent = ` / ${converThousand(args.pop.totalSpace())}` : null
        item.id === 'food' ? item.textContent = converThousand(args.food.getResource()) : null
        item.id === 'wood' ? item.textContent = converThousand(args.wood.getResource()) : null
        item.id === 'stone' ? item.textContent = converThousand(args.stone.getResource()) : null

        item.id === 'stat-space-cap' ? item.textContent = converThousand(args.pop.basicSpace) : null
        item.id === 'stat-space-house' ? item.textContent = converThousand(args.house.TotalSpace()) : null
        item.id === 'stat-space-total' ? item.textContent = converThousand(args.pop.totalSpace()) : null
        item.id === 'stat-space-free' ? item.textContent = converThousand(args.pop.totalSpace() - args.pop.getResource()) : null
        item.id === 'stat-build-house' ? item.textContent = converThousand(args.house.amountBuilt) : null

        item.id === 'building-house-cost' 
        ? item.innerHTML = `<span class='text-gold'>${converThousand(args.house.buildCostGold)}</span>` 
            + (args.house.buildCostWood > 0 ? ` • <span class='text-brown'>${converThousand(args.house.buildCostWood)}</span>` : ``)
            + (args.house.buildCostStone > 0 ? ` • <span class='text-gray'>${converThousand(args.house.buildCostStone)}</span>` : ``)
        : null

        item.id === 'building-house-constrtime' ? item.textContent = `${converThousand(args.house.constructionTime)} months` : null
        item.id === 'building-house-built' ? item.textContent = converThousand(args.house.amountBuilt) : null
        item.id === 'building-house-space' ? item.textContent = converThousand(args.house.space) : null
        item.id === 'building-house-progress' 
        ? args.house.isBeingConstructed ? item.textContent = `${args.house.calculateProgress()} %` : item.textContent = '-'  
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
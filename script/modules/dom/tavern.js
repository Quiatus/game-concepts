export const displayTavern = (gameData) => {
    const rightPanel = document.getElementById('rightPanel')
    return rightPanel.innerHTML = `
    <h1>Tavern</h1>

    <p class="text-i mb">${gameData.flavourText.tavern}</p>

    <div id="tavern">  
        
    </div>`
}

export const showTavernVisitors = (gameData) => {
    const tavern = document.getElementById('tavern')
    
    for (let visitor of gameData.tavern) {
        if (visitor.active) {
            const visitorDiv = document.createElement('div')
            visitorDiv.classList = 'visitorDiv'
            visitorDiv.innerHTML = generateVisitor(visitor)
            tavern.append(visitorDiv)
        }
    }
}

const generateVisitor = (visitor) => {
    return `
        <h2>${visitor.title}</h2>
        <p class="text-i ml mb">${visitor.dialogue[0]}</p>
        <p class="ml mb qnc">${visitor.dialogue[1].question}</p>
        <hr class="separator">
    `
}
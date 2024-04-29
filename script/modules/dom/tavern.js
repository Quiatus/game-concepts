export const displayTavern = () => {
    const rightPanel = document.getElementById('rightPanel')
    return rightPanel.innerHTML = `
    <h1>Tavern</h1>

    <p class="text-i mb">You enter the tavern and give a nod to the barkeep. He nods back and starts pouring you an ale into a mug. You then look around the place and see a few regulars, some talking quietly, some playing a game of dice and some
    already slumped across the table. You also see a few unfamiliar faces.</p>

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
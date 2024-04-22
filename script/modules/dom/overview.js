import { converThousand } from "./general.js"

export const displayOverview = () => {
    const rightPanel = document.getElementById('rightPanel')
    return rightPanel.innerHTML = `
    <h1>Overview</h1>

    <div class="bigBoxDiv">
        <span class="text-big text-gray">Messages</span>
        <div class="message-div mb"></div>

        <span class="text-big text-gray">Events</span>
        <div class="event-div"> </div>
    </div>
    `
}

export const displayMessages = (gameData) => {
    const messages = document.querySelector('.message-div')
    
    for (let [text, clr] of gameData.tempData.messages) {
        let msg = document.createElement('p');
        msg.innerHTML = text
        msg.className = clr
        messages.appendChild(msg)
    }
}

export const displayActiveEvents = (gameData, isNewMonth) => {
    const events = document.querySelector('.event-div')
    events.innerHTML = ''
    // searches for active events
    for (let event of gameData.events) {
        if (event.active) {
            if (isNewMonth) events.append(generateEventMessage(event))
            if (!isNewMonth && event.isTimed) events.append(generateEventMessage(event))
        }
    }
}

const generateEventMessage = (event) => {
    let message = document.createElement('p');
    if (event.isTimed && !event.isMission) message.innerHTML = `<span class='text-orange text-bold'>Event: </span>${event.description} <span class='text-it'>( Remaining time: <span class='text-bold'>${event.remainingTime}</span> )</span>.`
    else if (event.isMission && event.isDisplayed) message.innerHTML = `<span class='text-orange text-bold'>Misson: </span>${event.description}`
    else if (event.isMission && !event.isDisplayed) message.innerHTML = ``
    else message.innerHTML = `<span class='text-orange text-bold'>Discovery: </span>${event.description.replace('#effect#', converThousand(event.effect))}` 
    return message
}
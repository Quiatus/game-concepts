import { initData } from "./initvals.js"
import { printMessage } from "./domhelpers.js";

export const saveGame = (gameData) => {
    localStorage.setItem('gameSave', JSON.stringify(gameData));
}

export const loadGame = () => {
    const gameData = JSON.parse(localStorage.getItem('gameSave'))
    return gameData
}

// checks if game file exists, if so, loads it, if not, creates a new one and loads inital values
export const checkIfNewGame = () => {
    const load = JSON.parse(localStorage.getItem('gameSave'))
    load ? printMessage('Game loaded successfully!') 
    : ( localStorage.setItem('gameSave', JSON.stringify(initData)),
        printMessage('A new game has started. Have fun!'))
}
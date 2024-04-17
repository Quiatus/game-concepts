import { initData } from "./initvals.js"

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
    if (!load)  localStorage.setItem('gameSave', JSON.stringify(initData))
}
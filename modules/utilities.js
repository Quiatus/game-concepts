import { initData } from "./initvals.js"
import { printMessage } from "./domhelpers.js"

let gameData = {}

export const checkIfNewGame = (args) => {
    const load = JSON.parse(localStorage.getItem('gameSave'))
    load 
    ? (
        gameData = load,
        printMessage('Game loaded successfully!')
    ) 
    : (
        gameData = initData,
        localStorage.setItem('gameSave', JSON.stringify(gameData)),
        printMessage('A new game has started. Have fun!')
    )
    loadGame(args)
}

export const saveGame = (args) => {
    gameData.basicResources.month = args.month.getResource()
    gameData.basicResources.gold = args.gold.getResource()
    gameData.basicResources.pop = args.pop.getResource()
    gameData.basicResources.food = args.food.getResource()
    gameData.basicResources.wood = args.wood.getResource()
    gameData.basicResources.stone = args.stone.getResource()
    
    gameData.buildingHouse[1] = args.house.amountBuilt
    gameData.buildingHouse[4] = args.house.isBeingConstructed
    gameData.buildingHouse[5] = args.house.constructionProgress

    gameData.buildingFarm[1] = args.farm.amountBuilt
    gameData.buildingFarm[4] = args.farm.isBeingConstructed
    gameData.buildingFarm[5] = args.farm.constructionProgress

    localStorage.setItem('gameSave', JSON.stringify(gameData));
}

const loadGame = (args) => {
    args.gold.resource = gameData.basicResources.gold
    args.pop.resource = gameData.basicResources.pop
    args.pop.basicSpace = gameData.basicResources.basicSpace
    args.food.resource = gameData.basicResources.food
    args.month.resource = gameData.basicResources.month
    args.wood.resource = gameData.basicResources.wood
    args.stone.resource = gameData.basicResources.stone

    args.house.initValues(gameData.buildingHouse)
    args.farm.initValues(gameData.buildingFarm)

    for (let i = 0; i < args.gold.goldModifiers.length; i++) {
        args.gold.goldModifiers[i].active = gameData.goldModifiers[i+1][0]
        args.gold.goldModifiers[i].value = gameData.goldModifiers[i+1][1]
    }
}
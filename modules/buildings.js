import { generateMarkup, printMessage } from "./domhelpers.js"
import { saveGame, loadGame } from "./utilities.js"

class Building {

    // checks for various conditions and concatinate each that is not met
    checkIfEnoughResources(building, gameData) {
        let canBuild = true
        let reason = 'Not enough '

        if (building.costGold > gameData.basicResources.gold) {
            canBuild = false
            reason += 'gold, '
        }

        if (building.costWood > gameData.basicResources.wood) {
            canBuild = false
            reason += 'wood, '
        }

        if (building.costStone > gameData.basicResources.stone) {
            canBuild = false
            reason += 'stone, '
        }

        reason = reason.substring(0, reason.length - 2)
        return [canBuild, reason] // bool, string
    }

    // start building construction
    startConstruction(e, building) {
        let gameData = loadGame()

        gameData[building].space = gameData[building].maxSpace - gameData[building].amount

        // checks if enough resources to build
        const checkRes = this.checkIfEnoughResources(gameData[building], gameData)
        
        // if check pass, start building
        if (checkRes[0]) {
            gameData[building].isBeingBuilt = true
           
            gameData.basicResources.gold -= gameData[building].costGold
            gameData.basicResources.wood -= gameData[building].costWood
            gameData.basicResources.stone -= gameData[building].costStone

            saveGame(gameData)
            gameData[building].name === 'Capital' ? generateMarkup('management') : generateMarkup('buildings')
        } else {
            // displaus the error message if construction not possible
            e.target.parentElement.children[0].textContent = checkRes[1]
            e.target.parentElement.children[0].classList.remove('none')
            setTimeout(() => {e.target.parentElement.children[0].classList.add('none')}, 5000)
        }
    }

    // progresses the construction
    progressBuild(building) {
        let gameData = loadGame()
        
        // if the last month passes, completes the construction
        if (gameData[building].isBeingBuilt) {
            if (gameData[building].buildProgress === (gameData[building].costTime - 1)) {  
                gameData[building].isBeingBuilt = false;
                gameData[building].buildProgress = 0;
                if (gameData[building].name !== 'Capital') {
                    gameData[building].amount++;
                    printMessage(`A new <span class='text-gray text-bold'>${gameData[building].name}</span> has been built.`)
                } else {
                    gameData.general.capitalLevel++
                    printMessage(`Our capital has been upgraded to <span class='text-orange'>level ${gameData.general.capitalLevel}</span>.`)
                }      
                
            } else {
                gameData[building].buildProgress++
            }
            saveGame(gameData)
        }
    }
}

export class House extends Building {
    constructor(){
        super()
    }
}

export class Farm extends Building {
    constructor(){
        super()
    }
}

export class Lumberyard extends Building {
    constructor(){
        super()
    }
}

export class Quarry extends Building {
    constructor(){
        super()
    }
}

export class Capital extends Building {
    constructor(){
        super()
    }
}



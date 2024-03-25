import { printText, buildingConstrProgress } from "./domhelpers.js"
import { saveGame, loadGame } from "./utilities.js"

class Building {

    // checks for various conditions and concatinate each that is not met
    checkIfCanBuild(building, gameData) {
        let canBuild = true
        let reason = ''

        if (building.isBeingBuilt === true) {
            canBuild = false
            reason += 'Construction already in progress, '
        }

        if (building.requireCapitalLevel > gameData.general.capitalLevel) {
            canBuild = false
            reason += 'Capital level too low, '
        }

        if (building.costGold > gameData.basicResources.gold) {
            canBuild = false
            reason += 'Not enough gold, '
        }

        if (building.costWood > gameData.basicResources.wood) {
            canBuild = false
            reason += 'Not enough wood, '
        }

        if (building.costStone > gameData.basicResources.stone) {
            canBuild = false
            reason += 'Not enough stone, '
        }

        if (building.amount === 1 && building.amount === true && building.name !== 'Capital') {
            canBuild = false
            reason += 'We can only have one unique building, '
        }

        if (building.requireSpace === true && building.space === 0 && building.name !== 'Capital') {
            canBuild = false
            reason += 'No available space, '
        }
        reason = reason.substring(0, reason.length - 2)
        return [canBuild, reason] // bool, string
    }

    // start building construction
    startConstruction(e, target) {
        let gameData = loadGame()
        let building = gameData[target]
       
        // checks if construction is possible. Passes teh building object and resources
        const checkRes = this.checkIfCanBuild(building, gameData)
        
        // if check pass, start building
        if (checkRes[0]) {
            building.isBeingBuilt = true;
            building.requireSpace ? building.space -= 1 : null
            
            gameData.basicResources.gold -= building.costGold
            gameData.basicResources.wood -= building.costWood
            gameData.basicResources.stone -= building.costStone

            saveGame(gameData)
            buildingConstrProgress()
            printText()
        } else {
            // displaus the error message if construction not possible
            e.target.parentElement.children[0].textContent = checkRes[1]
            setTimeout(() => {e.target.parentElement.children[0].textContent = ''}, 5000)
        }
    }

    // progresses the construction
    progressBuild(target) {
        let gameData = loadGame()
        let building = gameData[target]
        
        // if the last month passes, completes the construction
        if (building.isBeingBuilt) {
            if (building.buildProgress === (building.costTime - 1)) {  
                building.isBeingBuilt = false;
                building.buildProgress = 0;
                if (building.name !== 'Capital') {
                    building.amount++;
                } else {
                    gameData.general.capitalLevel++
                }      
                
            } else {
                building.buildProgress++
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



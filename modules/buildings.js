import { printText } from "./domhelpers.js"
import { saveGame, loadGame } from "./utilities.js"

class Building {

    // checks for various conditions and concatinate each that is not met
    checkIfCanBuild(building, resources) {
        let canBuild = true
        let reason = ''

        if (building.isBeingBuilt === true) {
            canBuild = false
            reason += 'Construction already in progress, '
        }

        if (building.costGold > resources.gold) {
            canBuild = false
            reason += 'Not enough gold, '
        }

        if (building.costWood > resources.wood) {
            canBuild = false
            reason += 'Not enough wood, '
        }

        if (building.costStone > resources.stone) {
            canBuild = false
            reason += 'Not enough stone, '
        }

        if (building.amount === 1 && building.amount === true) {
            canBuild = false
            reason += 'We can only have one unique building, '
        }

        if (building.requireSpace === true && building.space === 0) {
            canBuild = false
            reason += 'No available space for construction, '
        }
        reason = reason.substring(0, reason.length - 2)
        return [canBuild, reason] // bool, string
    }

    // start building construction
    startConstruction(e) {
        let target = e.target.id // based on button clicked
        let gameData = loadGame()

        // checks if construction is possible. Passes teh building object and resources
        const checkRes = this.checkIfCanBuild(gameData[target], gameData.basicResources)
        
        // if check pass, start building
        if (checkRes[0]) {
            e.target.textContent = 'Building in progress'
            e.target.classList.add('btnDisable')
            e.target.disabled = true;

            gameData[target].isBeingBuilt = true;
            gameData[target].requireSpace ? gameData[target].space -= 1 : null
            
            gameData.basicResources.gold -= gameData[target].costGold
            gameData.basicResources.wood -= gameData[target].costWood
            gameData.basicResources.stone -= gameData[target].costStone

            saveGame(gameData)
            printText()
        } else {
            // displaus the error message if construction not possible
            e.target.parentElement.children[0].textContent = checkRes[1]
            setTimeout(() => {e.target.parentElement.children[0].textContent = ''}, 5000)
        }
    }

    // progresses the construction
    progressBuild(button, target) {
        let gameData = loadGame()
       
        // if the last month passes, completes the construction
        if (gameData[target].buildProgress === (gameData[target].costTime - 1)) {
            button.textContent = 'Begin construction'
            button.classList.remove('btnDisable')
            button.disabled = false;
            
            gameData[target].isBeingBuilt = false;
            gameData[target].buildProgress = 0;
            gameData[target].amount += 1;
        } else {
            gameData[target].buildProgress += 1
        }
        saveGame(gameData)
    }

    // runs at the beginning of month or at the game load. Checks if construction is in progress, if so, progresses it
    checkIfBeingBuilt(button, isNewMonth) {
        let target = button.id
        let gameData = loadGame()
        let building = gameData[target]
        
        // if the game is loaded, disables the construct button and shows the progress for each building being constructed
        if (building.isBeingBuilt && !isNewMonth) {
            button.textContent = 'Building in progress'
            button.classList.add('btnDisable')
            button.disabled = true;
        } else if (building.isBeingBuilt && isNewMonth) {
            this.progressBuild(button, target)
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


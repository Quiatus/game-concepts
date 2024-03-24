import { printText } from "./domhelpers.js"
import { saveGame, loadGame } from "./utilities.js"

class Building {
    checkIfCanBuild(building, resources) {
        let canBuild = true
        let reason = ''

        if (building.isBeingBuilt === true) {
            canBuild = false
            reason = 'Construction already in progress!'
            return [canBuild, reason]
        }

        if (building.costGold > resources.gold) {
            canBuild = false
            reason = 'Not enough gold!'
            return [canBuild, reason]
        }

        if (building.costWood > resources.wood) {
            canBuild = false
            reason = 'Not enough wood!'
            return [canBuild, reason]
        }

        if (building.costStone > resources.stone) {
            canBuild = false
            reason = 'Not enough stone!'
            return [canBuild, reason]
        }

        if (building.amount === 1 && building.amount === true) {
            canBuild = false
            reason = 'We can only have one unique building!'
            return [canBuild, reason]
        }

        if (building.requireSpace === true && building.space === 0) {
            canBuild = false
            reason = 'No available space for construction!'
            return [canBuild, reason]
        }

        return [canBuild, reason]
    }

    startConstruction(e) {
        let target = e.target.id
        let gameData = loadGame()

        const checkRes = this.checkIfCanBuild(gameData[target], gameData.basicResources)
        
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
            e.target.parentElement.children[0].textContent = checkRes[1]
            e.target.parentElement.children[0].classList.remove('hidden')
            setTimeout(() => {e.target.parentElement.children[0].classList.add('hidden')}, 3000)
        }
    }

    progressBuild(button, target) {
        let gameData = loadGame()
       
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

    checkIfBeingBuilt(button, isNewMonth) {
        let target = button.id
        let gameData = loadGame()
        let building = gameData[target]
        
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


import { printMessage } from "./domhelpers.js"
import { saveGame, loadGame } from "./utilities.js"

const popText = document.getElementById('popText')

export class Month{
    increaseMonth() {
        let gameData = loadGame()
        gameData.basicResources.month++
        saveGame(gameData)
    }
}

export class Gold{
    // loads values into modifiers, then calculates the amount gained
    calculateGold() {
        let gameData = loadGame()
        let amount = 0
        const pop = gameData.basicResources.pop
        const tax = gameData.general.tax

        const baseIncome = Math.round(this.getGoldFromPop(pop) * this.addTaxes(tax))
        
        amount = baseIncome

        gameData.resourceGain.goldTax = baseIncome
        gameData.basicResources.gold += amount
        gameData.basicResources.gold < 0 ? gameData.basicResources.gold = 0 : null

        saveGame(gameData)
    }

    addTaxes(tax) {
        if (tax === 1) {
            return 0.5
        } else if (tax === 2) {
            return 1
        } else if (tax === 3) {
            return 1.5
        } 
    }

    getGoldFromPop(pop) {
        // each 10 pops generate 1 gold, +- 25%
        const min = Math.floor(pop * 0.075);  
        const max = Math.floor(pop * 0.125);  
        const addGold = Math.floor(Math.random() * (max - min) + min);
        return addGold;
    }
}

export class Pop {
    calculateTotalSpace() {
        let gameData = loadGame()
        const basicSpace = gameData.basicResources.basicSpace
        const houseSpace = gameData.buildingHouse.amount * gameData.buildingHouse.effect
        const totalSpace = basicSpace + houseSpace

        gameData.tempData.houseSpace = houseSpace
        gameData.tempData.totalSpace = totalSpace

        saveGame(gameData)
    }

    calculatePop() {
        let gameData = loadGame()
        let amount = 0
        const pop = gameData.basicResources.pop
        const alert = gameData.alerts.overpopulation
        const totalSpace = gameData.tempData.totalSpace 

        const baseGain = this.increasePop(pop) 

        amount = baseGain

        if (!alert) {
            if (pop + amount >= totalSpace) {
                gameData.resourceGain.pop = totalSpace - pop
                gameData.basicResources.pop = totalSpace
            } else {
                gameData.basicResources.pop += amount
                gameData.resourceGain.pop = amount
                gameData.basicResources.pop < 0 ? gameData.basicResources.pop = 0 : null
            }
        }

        gameData.tempData.popDied = 0 
        gameData.tempData.popLeft = 0 
        saveGame(gameData)
    }

    increasePop(pop) {
        // Pop increase is between 0.1% - 0.5% per month
        const min = Math.floor(pop * 0.001);  
        const max = Math.floor(pop * 0.005);
        // adds between 2 - 20 pop on the top of the base increase. This is to account for low increase if pop is too low
        const addPop = Math.floor(Math.random() * (max - min) + min) + Math.floor(Math.random() * 19 + 2); 
        return addPop
    }

    isMaxPop(isNewMonth=true) {
        let gameData = loadGame()
        let pop = gameData.basicResources.pop
        let totalSpace = gameData.tempData.totalSpace 

        popText.classList.remove('text-red')

        if (pop === totalSpace) {
            popText.classList.add('text-red')
            printMessage('Population capacity reached. Build more housing or conquer more settlements!', 'warning')
        } else if ((pop > totalSpace) && isNewMonth) {
            gameData.alerts.overpopulation = true
            saveGame(gameData)
            popText.classList.add('text-red')
            const leftPop = this.removePops(gameData, 'overpopulation')
            printMessage(`People have nowhere to live. ${leftPop} people have left. Build more housing or conquer more settlements!`, 'critical')
            pop < totalSpace ? popText.classList.remove('text-red') : null
        } else if ((pop > totalSpace) && !isNewMonth) {
            gameData.alerts.overpopulation = true
            saveGame(gameData)
            popText.classList.add('text-red')
            printMessage(`People have nowhere to live. Build more housing!`, 'critical')
        }
    }

    removePops(reason) {
        let gameData = loadGame()
        let removedAmount = 0
        let pop = gameData.basicResources.pop

        if (reason === 'famine') {
            let producedFood = gameData.resourceGain.food
            let consumedFood = gameData.tempData.consumedFood
            let diff = (consumedFood - producedFood) * 100
            removedAmount = Math.floor(Math.random() * (diff * 1.25 - diff * 0.75) + diff * 0.75)   
            gameData.tempData.popDied = removedAmount     
        } else if (reason === 'overpopulation') {
            removedAmount = Math.floor(Math.random() * (pop * 0.15 - pop * 0.05) + pop * 0.05)
            gameData.tempData.popLeft = removedAmount 
        }

        gameData.basicResources.pop -= removedAmount
        saveGame(gameData)

        return removedAmount
    }
}

export class Food{
     calculateFood() {
        let gameData = loadGame()
        let amount = 0

        const baseGain = this.gainFood(gameData)
        const consumed = this.consumeFood(gameData.basicResources.pop)

        amount = baseGain - consumed

        gameData.resourceGain.food = baseGain
        gameData.tempData.consumedFood = consumed
        gameData.basicResources.food += amount
        gameData.basicResources.food < 0 ? gameData.basicResources.food = 0 : null
    
        saveGame(gameData)
    }

    gainFood(gameData) {
        const gain = gameData.buildingFarm.amount * gameData.buildingFarm.effect
        return gain
    }

    consumeFood(pop) {
        const consumedFood = Math.floor(pop / 100);
        return consumedFood
    }

    checkIfEnoughFood(pop, isNewMonth=true) {
        let gameData = loadGame()
        const food = gameData.basicResources.food
        const gainedFood = gameData.resourceGain.food
        const consumedFood = gameData.tempData.consumedFood
        gameData.alerts.famine = false
        
        if (((consumedFood - gainedFood) * 15 >= food) && food > 0) {
            printMessage(`We are running low on food! Increase food production!`, 'warning')
        } else if ((food === 0 && consumedFood > gainedFood) && !isNewMonth) {
            gameData.alerts.famine = true
            saveGame(gameData)
            printMessage(`Our clan is suffering from famine! Increase food production!`, 'critical')
        } else if ((food === 0 && consumedFood > gainedFood) && isNewMonth) {
            gameData.alerts.famine = true
            saveGame(gameData)
            const deadPop = pop.removePops('famine')
            printMessage(`Our clan is suffering from famine! ${deadPop} people has died from starvation! Increase food production! `, 'critical')
        } else if (food === 0 && consumedFood === gainedFood) {
            gameData.alerts.famine = true
            saveGame(gameData)
            printMessage(`Our food reserves are empty! Our population will die of starvation. Increase food production! `, 'critical')
        } else {
            saveGame(gameData)
        }
    }
}

export class Wood{
     calculateWood() {
        let gameData = loadGame()
        let amount = 0

        const baseGain = this.gainWood(gameData)
    
        amount = baseGain

        gameData.resourceGain.wood = baseGain
        gameData.basicResources.wood += amount
        gameData.basicResources.wood < 0 ? gameData.basicResources.wood = 0 : null

        saveGame(gameData)
    }

    gainWood(gameData) {
        const gain = gameData.buildingLumberyard.amount * gameData.buildingLumberyard.effect
        return gain
    }
}

export class Stone{
     calculateStone() {
        let gameData = loadGame()
        let amount = 0

        const baseGain = this.gainStone(gameData)

        amount = baseGain

        gameData.resourceGain.stone = baseGain
        gameData.basicResources.stone += amount
        gameData.basicResources.stone < 0 ? gameData.basicResources.stone = 0 : null

        saveGame(gameData)
    }

    gainStone(gameData) {
        const gain = gameData.buildingQuarry.amount * gameData.buildingQuarry.effect
        return gain
    }
}
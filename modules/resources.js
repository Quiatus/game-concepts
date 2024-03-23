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
     constructor(){
        this.goldModifiers = [
            {
                id: 1,
                name: 'Base Increase',
                type: 'add',
                active: null,
                value: null
            },
            {
                id: 2,
                name: 'Tax Multiplier',
                type: 'multiply',
                active: null,
                value: null
            },
            {
                id: 3,
                name: 'res Increase',
                type: 'multiply',
                active: null,
                value: null
            }, 
            {
                id: 4,
                name: 'steal',
                type: 'substract',
                active: null,
                value: null
            }
        ]
     }

     loadModifiers() {
        let gameData = loadGame()
        for (let i = 0; i < this.goldModifiers.length; i++) {
            this.goldModifiers[i].active = gameData.goldModifiers[i+1][0]
            this.goldModifiers[i].value = gameData.goldModifiers[i+1][1]
        }
     }

    addTaxes() {
        let gameData = loadGame()

        gameData.general.tax === 1 ? gameData.goldModifiers[2][1] = 0.5 : null
        gameData.general.tax === 2 ? gameData.goldModifiers[2][1] = 1 : null
        gameData.general.tax === 3 ? gameData.goldModifiers[2][1] = 1.5 : null

        saveGame(gameData)
    }

    calculateGold() {
        this.addTaxes() 
        this.loadModifiers()
        let gameData = loadGame()
        let pop = gameData.basicResources.pop
        
        this.goldModifiers[0].value = this.getGoldFromPop(pop)
        
        let amount = 0;

        for (let i = 0; i < this.goldModifiers.length; i++) {
            if (this.goldModifiers[i].active) {
                if (this.goldModifiers[i].type === 'add') amount += this.goldModifiers[i].value  
                else if (this.goldModifiers[i].type === 'substract') amount -= this.goldModifiers[i].value
                else if (this.goldModifiers[i].type === 'multiply') amount = Math.round(amount * this.goldModifiers[i].value)
            }
        }
        
        gameData.resourceChange.gold = 0
        gameData.basicResources.gold += amount
        gameData.resourceChange.gold = amount
        saveGame(gameData)
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
    calculateTotalSpace = () => {
        let gameData = loadGame()
        let basicSpace = gameData.basicResources.basicSpace
        let houseSpace = gameData.buildingHouse.amount * gameData.buildingHouse.effect
        let totalSpace = basicSpace + houseSpace

        gameData.tempData.houseSpace = houseSpace
        gameData.tempData.totalSpace = totalSpace
        saveGame(gameData)
    }

    increasePop() {
        let gameData = loadGame()
        let pop = gameData.basicResources.pop
        let alert = gameData.alerts.overpopulation
        let totalSpace = gameData.tempData.totalSpace 
        // Pop increase is between 0.1% - 0.5% per month
        const min = Math.floor(pop * 0.001);  
        const max = Math.floor(pop * 0.005);
        // adds between 2 - 20 pop on the top of the base increase. This is to account for low increase if pop is too low
        const addPop = Math.floor(Math.random() * (max - min) + min) + Math.floor(Math.random() * (21-2) + 2); 
        gameData.resourceChange.pop = 0
        if (!alert) {
            if (pop + addPop >= totalSpace) {
                gameData.resourceChange.pop = totalSpace - pop
                gameData.basicResources.pop = totalSpace
            } else {
                gameData.basicResources.pop += addPop
                gameData.resourceChange.pop = addPop
            }
        }
        saveGame(gameData)
    }

    isMaxPop(isNewMonth=true) {
        let gameData = loadGame()
        let pop = gameData.basicResources.pop
        let totalSpace = gameData.tempData.totalSpace 

        popText.classList.remove('text-red')
        if (pop === totalSpace) {
            popText.classList.add('text-red')
            printMessage('Population capacity reached. Build more housing!', 'warning')
        } else if ((pop > totalSpace) && isNewMonth) {
            gameData.alerts.overpopulation = true
            saveGame(gameData)
            popText.classList.add('text-red')
            const leftPop = this.removePops(gameData, 'overpopulation')
            printMessage(`People have nowhere to live. ${leftPop} people have left. Build more housing!`, 'critical')
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
            removedAmount = Math.floor(Math.random() * (pop * 0.12 - pop * 0.08) + pop * 0.08)          
        } else if (reason === 'overpopulation') {
            removedAmount = Math.floor(Math.random() * (pop * 0.15 - pop * 0.05) + pop * 0.05)
        }
        gameData.basicResources.pop -= removedAmount
        saveGame(gameData)
        return removedAmount
    }
}

export class Food{
    gainFood() {
        let gameData = loadGame()
        const gain = gameData.buildingFarm.amount * gameData.buildingFarm.effect
        gameData.resourceChange.food = 0
        gameData.basicResources.food += gain
        gameData.resourceChange.food = gain
        saveGame(gameData)
    }

    consumeFood() {
        let gameData = loadGame()
        const currentPop = gameData.basicResources.pop
        const consumedFood = Math.floor(currentPop / 100);
        printMessage(`Our people have consumed <span class='text-bold'>${consumedFood}</span> food.`, 'info')
        gameData.tempData.consumedFood = 0
        gameData.basicResources.food -= consumedFood
        gameData.tempData.consumedFood = consumedFood
        gameData.basicResources.food < 0 ? gameData.basicResources.food = 0 : null
        saveGame(gameData)
    }

    checkIfEnoughFood(pop, isNewMonth=true) {
        let gameData = loadGame()
        const food = gameData.basicResources.food
        const currentPop = gameData.basicResources.pop
        const gainedFood = gameData.resourceChange.food
        const consumedFood = Math.floor(currentPop / 100);
        gameData.alerts.famine = false
        
        if (((consumedFood - gainedFood) * 15 >= food) && food > 0) {
            printMessage(`We are running low on food! Increase food production!`, 'warning')
        } else if (food === 0 && !isNewMonth) {
            gameData.alerts.famine = true
            saveGame(gameData)
            printMessage(`Our clan is suffering from famine! Increase food production!`, 'critical')
        } else if (food === 0 && isNewMonth) {
            gameData.alerts.famine = true
            saveGame(gameData)
            const deadPop = pop.removePops('famine')
            printMessage(`Our clan is suffering from famine! ${deadPop} people has died from starvation! Increase food production! `, 'critical')
        }
    }
}

export class Wood{
}

export class Stone{

}
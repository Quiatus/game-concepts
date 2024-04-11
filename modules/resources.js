'use strict';
import { printMessage } from "./domhelpers.js"
import { saveGame, loadGame } from "./utilities.js"

export class Month{
    increaseMonth() {
        let gameData = loadGame()
        gameData.basicResources.month++
        saveGame(gameData)
    }
}

export class Gold{
    // calculates gold at the beginning of month
    calculateGold() {
        let gameData = loadGame()
        let amount = 0
        const pop = gameData.basicResources.pop
        const tax = gameData.general.tax
        let commerce = gameData.buildings[0].levels[gameData.buildings[0].currentLevel - 1].commerce // gained from higher capital levels. 
        const eventGain = this.getGoldFromEvents(gameData.events)
        const armyUpkeep = this.armyUpkeep(gameData.units)
        let totalIncome = 0
        let totalLoss = 0

        //base income from pop * tax multiplier
        const baseIncome = Math.round(this.getGoldFromPop(pop) * this.addTaxes(tax))
        
        // randomize commerce (amount +- 25%)
        if (commerce) commerce = Math.floor(Math.random() * ((commerce * 1.25) - (commerce * 0.75)) + (commerce * 0.75))

        totalIncome = baseIncome + commerce + eventGain 
        totalLoss = armyUpkeep
        amount = totalIncome - totalLoss

        gameData.resourceGain.goldTotal = baseIncome + commerce // this is so that the regural gains are separated from the event gains in the overview
        gameData.resourceGain.goldTax = baseIncome
        gameData.resourceGain.goldEvents = eventGain
        gameData.tempData.totalGoldGain = totalIncome
        gameData.tempData.armyUpkeep = armyUpkeep
        gameData.tempData.commerce = commerce
        gameData.basicResources.gold += amount

        if (gameData.basicResources.gold < 0) gameData.basicResources.gold = 0

        saveGame(gameData)
    }

    // generates gold from events
    getGoldFromEvents(events) {
        let amount = 0
        for (let event of events) {
            if (event.active && event.type === 'gainGold') amount += event.effect
        }
        return amount
    }

    // add tax multiplier
    addTaxes(tax) {
        if (tax === 1) {
            return 0.5
        } else if (tax === 2) {
            return 1
        } else if (tax === 3) {
            return 1.5
        } 
    }

    // each 10 pops generate 1 gold, +- 25%
    getGoldFromPop(pop) {  
        const min = Math.floor(pop * 0.075);  
        const max = Math.floor(pop * 0.125);  
        const addGold = Math.floor(Math.random() * (max - min) + min);
        return addGold;
    }

    // deduct army pay
    armyUpkeep(units) {
        let amount = 0
        for (let unit of units) {
            if (unit.amount) {
                amount += Math.ceil(unit.pay * unit.amount);
            }
        }

        return amount
    }
}

export class Pop {
    // calculates total available space from houses, capital and settlements
    calculateTotalSpace() {
        let gameData = loadGame()
        const basicSpace = gameData.basicResources.basicSpace
        const houseSpace = gameData.buildings[1].amount * gameData.buildings[1].effect
        const totalSpace = basicSpace + houseSpace

        gameData.tempData.houseSpace = houseSpace
        gameData.tempData.totalSpace = totalSpace

        saveGame(gameData)
    }

    // calculates pops at the beginning of the month
    calculatePop() {
        let gameData = loadGame()
        let amount = 0
        let alert = false
        const pop = gameData.basicResources.pop
        const totalSpace = gameData.tempData.totalSpace 
        const happiness = gameData.tempData.happiness
        const eventGain = this.getPopFromEvents(gameData.events)
        gameData.resourceGain.pop = 0

        // base increase from births
        let baseGain = this.increasePop(pop) 

        // apply happiness modifier to basic pop gain
        if (happiness < 20) {
            baseGain = Math.floor(baseGain * 0.5)
        } else if (happiness > 80) {
            baseGain = Math.floor(baseGain * 1.5)
        }

        // apply event bonus
        baseGain = Math.floor(baseGain * eventGain[1])

        // check if any alert is active
        if (gameData.alerts.overpopulation || gameData.alerts.riot) {
            alert = true
        }

        // checks if any alert affecting pop gain is active, if so, no pops are generated. Then checks if there is space, if not, no pops are added
        if (!alert) {

            gameData.resourceGain.pop = baseGain 
            amount = baseGain

            if (amount >= totalSpace - pop) {
                gameData.resourceGain.pop = totalSpace - pop
                gameData.basicResources.pop = totalSpace
            } else {
                gameData.basicResources.pop += amount
                gameData.basicResources.pop < 0 ? gameData.basicResources.pop = 0 : null
            }
        }

        gameData.tempData.popDied = 0 
        gameData.tempData.popLeft = 0 
        saveGame(gameData)
    }

    // Pop increase is between 0.1% - 0.5% per month
    // adds between 2 - 20 pop on the top of the base increase.
    increasePop(pop) {
        const min = Math.floor(pop * 0.001)
        const max = Math.floor(pop * 0.005)
        const lowPopCompensator = Math.floor(Math.random() * 19 + 2)

        const addPop = Math.floor(Math.random() * (max - min) + min) + lowPopCompensator;
        return addPop
    }

    // generates pop from events
    getPopFromEvents(events) {
        let additive = 0
        let multiplicative = 1
        for (let event of events) {
            if (event.active && event.type === 'popHappyGainMultiplier') multiplicative *= event.effect
        }
        return [additive, multiplicative]
    }

    // checks if max space is reached, if so, shows warning. If more pops than space, triggers overpopulation event
    isMaxPop(isNewMonth=true) {
        let gameData = loadGame()
        let pop = gameData.basicResources.pop
        let totalSpace = gameData.tempData.totalSpace 

        // warning if people have nowhere to live
        if (pop === totalSpace) {
            printMessage('Population capacity reached. Build more housing or conquer more settlements!', 'warning')
        } else if ((pop > totalSpace) && isNewMonth) {
            // overpopulation
            gameData.alerts.overpopulation = true
            const leftPop = this.removePops(gameData, 'overpopulation') // removes pops 
            printMessage(`People have nowhere to live. ${leftPop} people have left. Build more housing or conquer more settlements!`, 'critical')
        } else if ((pop > totalSpace) && !isNewMonth) {
            // overpopulation (on game load)
            gameData.alerts.overpopulation = true
            saveGame(gameData)
            printMessage(`People have nowhere to live. Build more housing or conquer more settlements!`, 'critical')
        } else {
            gameData.alerts.overpopulation = false
            saveGame(gameData)
        }
    }

    // removes x pop per month based on active event
    removePops(gameData, reason) {
        const pop = gameData.basicResources.pop
        let removedAmount = 0

        if (reason === 'famine') {
            // calculates the amount of pops that did not receive food and kills 25% - 75% of that amount
            let diff = (gameData.tempData.consumedFood - gameData.resourceGain.food) * 100
            removedAmount = Math.floor(Math.random() * (diff * 0.75 - diff * 0.25) + diff * 0.25)   
            gameData.tempData.popDied = removedAmount     
        } else if (reason === 'overpopulation') {
            // When overpopulated, between 5 - 15% of people will leave every month
            removedAmount = Math.floor(Math.random() * (pop * 0.15 - pop * 0.05) + pop * 0.05)
            gameData.tempData.popLeft = removedAmount 
        }

        gameData.basicResources.pop -= removedAmount
        saveGame(gameData)

        return removedAmount
    }
}

export class Food{
    // calculates food at the beginning of momth
     calculateFood() {
        let gameData = loadGame()
        let amount = 0
        const eventGain = this.getFoodFromEvents(gameData.events)

        // base income from farms
        const baseGain = this.gainFood(gameData)

        // consumtion from pops
        const consumed = this.consumeFood(gameData.basicResources.pop, gameData.general.foodLevel)

        amount = Math.floor((baseGain * eventGain[1])) + eventGain[0] - consumed

        gameData.resourceGain.food = baseGain * eventGain[1]
        gameData.tempData.consumedFood = consumed
        gameData.resourceGain.foodEvents = eventGain[0]

        gameData.basicResources.food += amount
        gameData.basicResources.food < 0 ? gameData.basicResources.food = 0 : null
    
        saveGame(gameData)
    }

    // calculate food gain from farms
    gainFood(gameData) {
        const gain = gameData.buildings[2].amount * gameData.buildings[2].effect
        return gain
    }

    // calucale amount of food eaten by pops
    consumeFood(pop, foodLevel) {
        let consumedFood = Math.floor(pop / 100 * (foodLevel * 0.5));
        if (consumedFood === 0) consumedFood = 1
        return consumedFood
    }

    // generates food from events
    getFoodFromEvents(events) {
        let additive = 0
        let multiplicative = 1
        for (let event of events) {
            if (event.active && event.type === 'gainFood') additive += event.effect
            if (event.active && event.type === 'foodGainMultiplier') multiplicative *= event.effect
        }
        return [additive, multiplicative]
    }

    // checks if we have enough food, if not, triggers famine event
    checkIfEnoughFood(pop, isNewMonth=true) {
        let gameData = loadGame()
        const food = gameData.basicResources.food
        const gainedFood = gameData.resourceGain.food
        const consumedFood = gameData.tempData.consumedFood
        gameData.alerts.famine = false
        
        if (((consumedFood - gainedFood) * 15 >= food) && food > 0) {
            // checks if food consumtions is lower than gain, then if food supplies will be depleted in 15 months. If so, triggers warning
            printMessage(`We are running low on food! Increase food production!`, 'warning')
        } else if ((food === 0 && consumedFood > gainedFood) && !isNewMonth) {
            // checks if famine is active at the game load
            gameData.alerts.famine = true
            saveGame(gameData)
            printMessage(`Our clan is suffering from famine! Increase food production!`, 'critical')
        } else if ((food === 0 && consumedFood > gainedFood) && isNewMonth) {
            // checks if famine is active at the beginnig of month, if so, kills pops
            gameData.alerts.famine = true
            const deadPop = pop.removePops(gameData, 'famine')
            printMessage(`Our clan is suffering from famine! ${deadPop} people has died from starvation! Increase food production! `, 'critical')
        } else if (food === 0 && consumedFood === gainedFood) {
            // if the food is 0 and the food gain is same as consumption, triggers warning
            gameData.alerts.famine = true
            saveGame(gameData)
            printMessage(`Our food reserves are empty! Our population will die of starvation. Increase food production! `, 'critical')
        } else {
            saveGame(gameData)
        }
    }
}

export class Wood{
    // calculates wood at the beginning of momth
     calculateWood() {
        let gameData = loadGame()
        let amount = 0
        const eventGain = this.getWoodFromEvents(gameData.events)

        // base gain from lumberyard
        const baseGain = this.gainWood(gameData)
    
        amount = baseGain + eventGain

        gameData.resourceGain.wood = baseGain
        gameData.resourceGain.woodEvents = eventGain

        gameData.basicResources.wood += amount
        gameData.basicResources.wood < 0 ? gameData.basicResources.wood = 0 : null

        saveGame(gameData)
    }

    // generates wood from events
    getWoodFromEvents(events) {
        let amount = 0
        for (let event of events) {
            if (event.active && event.type === 'gainWood') amount += event.effect
        }
        return amount
    }

    // calucaltes base gain from lumberyard
    gainWood(gameData) {
        const gain = gameData.buildings[3].amount * gameData.buildings[3].effect
        return gain
    }
}

export class Stone{
    // calculates stone at the beginning of momth
     calculateStone() {
        let gameData = loadGame()
        let amount = 0
        const eventGain = this.getStoneFromEvents(gameData.events)

        // base gain from quarries
        const baseGain = this.gainStone(gameData)

        amount = baseGain + eventGain

        gameData.resourceGain.stone = baseGain
        gameData.resourceGain.stoneEvents = eventGain

        gameData.basicResources.stone += amount
        gameData.basicResources.stone < 0 ? gameData.basicResources.stone = 0 : null

        saveGame(gameData)
    }

    // generates stone from events
    getStoneFromEvents(events) {
        let amount = 0
        for (let event of events) {
            if (event.active && event.type === 'gainStone') amount += event.effect
        }
        return amount
    }

    // calucaltes base gain from quarries
    gainStone(gameData) {
        const gain = gameData.buildings[4].amount * gameData.buildings[4].effect
        return gain
    }
}
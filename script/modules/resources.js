'use strict';
import { printMessage, converThousand } from "./domhelpers.js"

export const month = {
    increaseMonth(gameData) {
        gameData.basicResources.month++
        gameData.general.isNewGame = false
    }
}

export const gold = {
    // calculates gold at the beginning of month
    calculateGold(gameData) {
        let amount = 0
        const tax = gameData.general.tax
        let commerce = gameData.buildings[0].levels[gameData.buildings[0].currentLevel - 1].commerce // gained from higher capital levels. 
        const [eventGainAdd, ] = getResourceFromEvents(gameData.events, 'gainGold')
        const armyUpkeep = this.armyUpkeep(gameData.units)
        let totalIncome = 0
        let totalLoss = 0

        //base income from pop * tax multiplier
        const baseIncome = Math.round(randomResource(gameData.basicResources.pop, 0.075, 0.125) * tax)
        
        // randomize commerce (amount +- 25%)
        if (commerce) commerce = randomResource(commerce, 0.75, 1.25)

        totalIncome = baseIncome + commerce + eventGainAdd
        totalLoss = armyUpkeep
        amount = totalIncome - totalLoss

        gameData.resourceGain.goldTotal = baseIncome + commerce // this is so that the regural gains are separated from the event gains in the overview
        gameData.resourceGain.goldTax = baseIncome
        gameData.resourceGain.goldEvents = eventGainAdd
        gameData.tempData.totalGoldGain = totalIncome
        gameData.tempData.armyUpkeep = armyUpkeep
        gameData.tempData.commerce = commerce
        gameData.basicResources.gold += amount

        if (gameData.basicResources.gold < 0) gameData.basicResources.gold = 0
    },

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

export const pop = {
    // calculates pops at the beginning of the month
    calculatePop(gameData) {
        let amount = 0
        let alert = false
        const pop = gameData.basicResources.pop
        const totalSpace = gameData.tempData.totalSpace 
        const happiness = gameData.tempData.happiness
        const [eventGainAdd, eventGainMutl, eventGainNo] = getResourceFromEvents(gameData.events, null, 'popHappyGainMultiplier', 'popGainRiot')
        gameData.resourceGain.pop = 0

        // base increase from births
        let baseGain = this.increasePop(pop, gameData.general.foodLevel) 

        // apply happiness modifier to basic pop gain
        if (happiness < 20) baseGain = Math.floor(baseGain * 0.5)
        else if (happiness > 80) baseGain = Math.floor(baseGain * 1.5)

        // apply event bonus
        baseGain = Math.floor(baseGain * eventGainMutl)

        // check if any alert is active
        if (gameData.alerts.overpopulation || gameData.alerts.famine || eventGainNo) {
            alert = true
        }
        // checks if any alert or event affecting pop gain is active, if so, no pops are generated. Then checks if there is space, if not, no pops are added
        if (!alert) {

            gameData.resourceGain.pop = baseGain 
            amount = baseGain

            if (amount >= totalSpace - pop) {
                gameData.resourceGain.pop = totalSpace - pop
                gameData.basicResources.pop = totalSpace
            } else {
                gameData.basicResources.pop += amount
                if (gameData.basicResources.pop < 0) gameData.basicResources.pop = 0
            }
        }

        gameData.tempData.popDied = 0 
        gameData.tempData.popLeft = 0 
        
    },

    // Pop increase is between 0.1% - 0.5% per month
    // adds between 2 - 20 pop on the top of the base increase.
    increasePop(pop, foodLevel) {
        const lowPopCompensator = Math.floor(Math.random() * 19 + 2)
        let foodLevelMultiplier = 0

        if (foodLevel < 1) foodLevelMultiplier = 0.75
        if (foodLevel === 1) foodLevelMultiplier = 1
        if (foodLevel > 1) foodLevelMultiplier = 1.25

        const addPop = Math.floor((randomResource(pop, 0.001, 0.005) + lowPopCompensator) * foodLevelMultiplier);
        return addPop
    },

    // checks if max space is reached, if so, shows warning. If more pops than space, triggers overpopulation event
    isMaxPop(gameData) {
        let pop = gameData.basicResources.pop
        let totalSpace = gameData.tempData.totalSpace 
        gameData.alerts.overpopulation = false

        // warning if people have nowhere to live
        if (pop === totalSpace) {
            printMessage('Population capacity reached. Build more housing or conquer more settlements!', 'warning', gameData)
        } else if (pop > totalSpace) {
            // overpopulation
            gameData.alerts.overpopulation = true
            const leftPop = randomResource(gameData.basicResources.pop, 0.05, 0.15) // removes pops 
            gameData.basicResources.pop -= leftPop
            gameData.tempData.popLeft = leftPop 
            printMessage(`Our people have nowhere to live.<span class="text-bold">${converThousand(leftPop)}</span><img class='img-s' src='media/res/pop.png'> left. Build more housing or conquer more settlements!`, 'critical', gameData)
            if (gameData.basicResources.pop <= totalSpace) gameData.alerts.overpopulation = false
        } 
    }
}

export const food = {
    // calculates food at the beginning of momth
     calculateFood(gameData) {
        let amount = 0
        const [eventGainAdd, eventGainMutl] = getResourceFromEvents(gameData.events,'gainFood','foodGainMultiplier')

        // base income from farms
        const baseGain = gainResource(gameData.buildings[2], gameData.general.production)

        // consumtion from pops
        const consumed = this.consumeFood(gameData.basicResources.pop, gameData.general.foodLevel, gameData.general.production)

        amount = Math.floor((baseGain * eventGainMutl)) + eventGainAdd - consumed

        gameData.resourceGain.food = baseGain * eventGainMutl
        gameData.tempData.consumedFood = consumed
        gameData.resourceGain.foodEvents = eventGainAdd

        gameData.basicResources.food += amount
        if (gameData.basicResources.food < 0) gameData.basicResources.food = 0
    },

    // calucale amount of food eaten by pops
    consumeFood(pop, foodLevel, production) {
        let productionModif = 1
        if (production === 1.25) productionModif = 1.5
        let consumedFood = Math.floor((pop / 100 * foodLevel) * productionModif);
        if (consumedFood === 0) consumedFood = 1
        return consumedFood
    },

    // checks if we have enough food, if not, triggers famine event
    checkIfEnoughFood(gameData) {
        const food = gameData.basicResources.food
        const gainedFood = gameData.resourceGain.food
        const consumedFood = gameData.tempData.consumedFood
        gameData.alerts.famine = false
        
        if (((consumedFood - gainedFood) * 15 >= food) && food > 0) {
            // checks if food consumtions is lower than gain, then if food supplies will be depleted in 15 months. If so, triggers warning
            printMessage(`We are running low on food! Increase food production!`, 'warning', gameData)
        } else if (food === 0 && consumedFood > gainedFood) {
            // checks if famine is active at the beginnig of month, if so, kills pops
            gameData.alerts.famine = true
            let diff = (gameData.tempData.consumedFood - gameData.resourceGain.food) * 100
            const deadPop = randomResource(diff, 0.25, 0.75)
            gameData.basicResources.pop -= deadPop
            gameData.tempData.popDied = deadPop 
            printMessage(`Our clan is suffering from famine! <span class="text-bold">${converThousand(deadPop)}</span><img class='img-s' src='media/res/pop.png'> died from starvation! Increase food production! `, 'critical', gameData)
        } else if (food === 0 && consumedFood === gainedFood) {
            // if the food is 0 and the food gain is same as consumption, triggers warning
            gameData.alerts.famine = true
            printMessage(`Our food reserves are empty! Our population will die of starvation. Increase food production! `, 'critical', gameData)
        } 
    }
}

export const wood = {
    // calculates wood at the beginning of momth
     calculateWood(gameData) {
        let amount = 0
        const [eventGainAdd,] = getResourceFromEvents(gameData.events, 'gainWood')
        const baseGain = gainResource(gameData.buildings[3], gameData.general.production)
    
        amount = baseGain + eventGainAdd

        gameData.resourceGain.wood = baseGain
        gameData.resourceGain.woodEvents = eventGainAdd

        gameData.basicResources.wood += amount
        if (gameData.basicResources.wood < 0) gameData.basicResources.wood = 0
    }
}

export const stone = {
    // calculates stone at the beginning of momth
     calculateStone(gameData) {
        let amount = 0
        const [eventGainAdd,] = getResourceFromEvents(gameData.events, 'gainStone')
        const baseGain = gainResource(gameData.buildings[4], gameData.general.production)

        amount = baseGain + eventGainAdd

        gameData.resourceGain.stone = baseGain
        gameData.resourceGain.stoneEvents = eventGainAdd

        gameData.basicResources.stone += amount
        if (gameData.basicResources.stone < 0) gameData.basicResources.stone = 0
    }
}

// calucaltes base gain from resource buildings and adds production modifier based on production level
const gainResource = (building, prod) => {
    return Math.floor(building.amount * building.effect * prod)
}

export const randomResource = (res, min, max) => {
    return Math.floor(Math.random() * (res * max - res * min) + res * min)
}

// generates resource from events
const getResourceFromEvents = (events, add, mult=null, no=null) => {
    let additive = 0
    let multiplicative = 1
    let noGain = false
    for (let event of events) {
        if (event.active && event.type === add) additive += event.effect
        if (event.active && event.type === mult) multiplicative *= event.effect
        if (event.active && event.type === no) noGain = true
    }
    return [additive, multiplicative, noGain]
}
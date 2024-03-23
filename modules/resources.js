import { printMessage } from "./domhelpers.js"

const popText = document.getElementById('popText')

class Resource {
    constructor() {
        this.resource = null
        this.resourceChange = null
    }

    getResource() {
        return this.resource
    }

    setResource(amount) {
        this.resource = amount
    }

    getResourceChange() {
        return this.resourceChange
    }

    spendResource(amount) {
        this.resource -= amount
    }

    addResource(amount) {
        this.resource += amount
    }
}

export class Month extends Resource{
    constructor() {
        super()
    }

    increaseMonth() {
        this.resource++
    }
}

export class Gold extends Resource{
     constructor(){
        super()
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
                name: 'bonus Increase',
                type: 'add',
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

    calculateGold(pop) {
        this.goldModifiers[0].value = this.getGoldFromPop(pop)
        let amount = 0;

        for (let i = 0; i < this.goldModifiers.length; i++) {
            if (this.goldModifiers[i].active) {
                if (this.goldModifiers[i].type === 'add') amount += this.goldModifiers[i].value  
                else if (this.goldModifiers[i].type === 'substract') amount -= this.goldModifiers[i].value
                else if (this.goldModifiers[i].type === 'multiply') amount = Math.round(amount * this.goldModifiers[i].value)
            }
        }
        this.resource += amount
        this.resourceChange = amount
    }

    getGoldFromPop(pop) {
        // each 10 pops generate 1 gold, +- 25%
        const min = Math.floor(pop * 0.075);  
        const max = Math.floor(pop * 0.125);  
        const addGold = Math.floor(Math.random() * (max - min) + min);
        return addGold;
    }
}

export class Pop extends Resource{
    constructor(){
        super()
        this.basicSpace = null
        this.totalSpace = null
    }

    increasePop(alerts) {
        // Pop increase is between 0.1% - 0.5% per month
        const min = Math.floor(this.resource * 0.001);  
        const max = Math.floor(this.resource * 0.005);
        // adds between 2 - 20 pop on the top of the base increase. This is to account for low increase if pop is too low
        const addPop = Math.floor(Math.random() * (max - min) + min) + Math.floor(Math.random() * (21-2) + 2); 

        if (!alerts.alert.overpopulation) {
            if (this.resource + addPop >= this.totalSpace) {
                this.resourceChange = (this.totalSpace - this.resource)
                this.resource = this.totalSpace
            } else {
                this.resource += addPop
                this.resourceChange = addPop
            }
        }

    }

    isMaxPop(alerts, newMonth) {
        alerts.alert.overpopulation = false
        popText.classList.remove('text-red')
        if (this.resource === this.totalSpace) {
            popText.classList.add('text-red')
            printMessage('Population capacity reached. Build more housing!', 'warning')
        } else if ((this.resource > this.totalSpace) && newMonth) {
            alerts.alert.overpopulation = true
            popText.classList.add('text-red')
            const leftPop = this.removePops('overpopulation')
            printMessage(`People have nowhere to live. ${leftPop} people have left. Build more housing!`, 'critical')
            this.resource < this.totalSpace ? popText.classList.remove('text-red') : null
        } else if ((this.resource > this.totalSpace) && !newMonth) {
            alerts.alert.overpopulation = true
            popText.classList.add('text-red')
            printMessage(`People have nowhere to live. Build more housing!`, 'critical')
        }
    }

    removePops(reason) {
        let removedAmount = 0
        if (reason === 'famine') {
            removedAmount = Math.floor(Math.random() * (this.resource * 0.12 - this.resource * 0.08) + this.resource * 0.08)          
        } else if (reason === 'overpopulation') {
            removedAmount = Math.floor(Math.random() * (this.resource * 0.15 - this.resource * 0.05) + this.resource * 0.05)
        }
        this.resource -= removedAmount
        return removedAmount
    }
}

export class Food extends Resource{
    constructor() {
        super()
    }

    gainFood(farms) {
        const gain = farms.amountBuilt * farms.effect
        this.resource += gain
        this.resourceChange = gain
    }

    consumeFood(pop, alerts) {
        const consumedFood = Math.floor(pop.getResource() / 100);
        printMessage(`Our people have consumed <span class='text-bold'>${consumedFood}</span> food.`, 'info')
        this.resource -= consumedFood
        if (this.resource < 0) {
            this.resource = 0
        }
        this.checkIfEnoughFood(pop, true, alerts)
    }

    checkIfEnoughFood(pop, newMonth=true, alerts) {
        const consumedFood = Math.floor(pop.getResource() / 100);
        alerts.alert.famine = false
        if ((consumedFood - this.resourceChange) * 15 >= this.resource && this.resource > 0) {
            printMessage(`We are running low on food! Increase food production!`, 'warning')
        } else if (this.resource === 0 && !newMonth) {
            alerts.alert.famine = true
            printMessage(`Our clan is suffering from famine! Increase food production!`, 'critical')
        } else if (this.resource === 0 && newMonth) {
            alerts.alert.famine = true
            const deadPop = pop.removePops('famine')
            printMessage(`Our clan is suffering from famine! ${deadPop} people has died from starvation! Increase food production! `, 'critical')
        }
    }
}

export class Wood extends Resource{
    constructor() {
        super()
    }
}

export class Stone extends Resource{
    constructor() {
        super()
    }
}
import { printText } from "./domhelpers.js"
import { saveGame } from "./utilities.js"

class Building {
    constructor() {
        this.name = null
        this.amountBuilt = null
        this.isUnique = null
        this.constructionTime = null
        this.isBeingConstructed = null
        this.constructionProgress = null
        this.buildCostGold = null
        this.buildCostWood = null
        this.buildCostStone = null
        this.requiresSpace = null
        this.space = null
        this.effect = null
    }

    initValues(values) {
        this.name = values[0]
        this.amountBuilt = values[1]
        this.isUnique = values[2]
        this.constructionTime = values[3]
        this.isBeingConstructed = values[4]
        this.constructionProgress = values[5]
        this.buildCostGold = values[6]
        this.buildCostWood = values[7]
        this.buildCostStone = values[8]
        this.requiresSpace = values[9]
        this.space = values[10]
        this.effect = values[11]
    }

    checkIfCanBuild({ gold, wood, stone }) {
        let canBuild = true
        let reason = ''

        if (this.isBeingConstructed === true) {
            canBuild = false
            reason = 'Construction already in progress!'
            return [canBuild, reason]
        }

        if (this.buildCostGold > gold.getResource()) {
            canBuild = false
            reason = 'Not enough gold!'
            return [canBuild, reason]
        }

        if (this.buildCostWood > wood.getResource()) {
            canBuild = false
            reason = 'Not enough wood!'
            return [canBuild, reason]
        }

        if (this.buildCostStone > stone.getResource()) {
            canBuild = false
            reason = 'Not enough stone!'
            return [canBuild, reason]
        }

        if (this.amountBuilt === 1 && this.isUnique === true) {
            canBuild = false
            reason = 'We can only have one unique building!'
            return [canBuild, reason]
        }

        if (this.requiresSpace === true && this.space === 0) {
            canBuild = false
            reason = 'No available space for construction!'
            return [canBuild, reason]
        }

        return [canBuild, reason]
    }

    startConstruction(e, args) {
        const checkRes = this.checkIfCanBuild(args)
        
        if (checkRes[0]) {
            e.target.textContent = 'Building in progress'
            e.target.classList.add('btnDisable')
            e.target.disabled = true;

            this.isBeingConstructed = true;

            args.gold.spendResource(this.buildCostGold)
            args.wood.spendResource(this.buildCostWood)
            args.stone.spendResource(this.buildCostStone)

            saveGame(args)
            printText(args)
        } else {
            e.target.parentElement.children[0].textContent = checkRes[1]
            e.target.parentElement.children[0].classList.remove('hidden')
            setTimeout(() => {e.target.parentElement.children[0].classList.add('hidden')}, 5000)
        }
    }

    progressBuild(button) {
        if (this.constructionProgress === (this.constructionTime - 1)) {
            button.textContent = 'Begin construction'
            button.classList.remove('btnDisable')
            button.disabled = false;
            this.isBeingConstructed = false;
            this.constructionProgress = 0;
            this.amountBuilt += 1;
        } else {
            this.constructionProgress += 1
        }
    }

    calculateProgress() {
        return 100 / this.constructionTime * this.constructionProgress
    }

    checkIfBeingBuilt(button, nextMonth) {
        if (this.isBeingConstructed && !nextMonth) {
            button.textContent = 'Building in progress'
            button.classList.add('btnDisable')
            button.disabled = true;
        } else if (this.isBeingConstructed && nextMonth) {
            this.progressBuild(button)
        }
    }
}

export class House extends Building {
    constructor(){
        super()
    }

    totalSpace() {
        return this.effect * this.amountBuilt
    }
}

export class Farm extends Building {
    constructor(){
        super()
    }
}


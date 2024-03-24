export const initData = {
    general: {
        tax: 2
    },
    basicResources: {
        month: 0,
        gold: 500,
        pop: 100,
        food: 50,
        wood: 20,
        stone: 5,
        basicSpace: 1000,
        baseHappiness: 50
    },
    resourceGain: {
        goldTax: 0,
        pop: 0,
        food: 0,
        wood: 0,
        stone: 0
    },
    alerts: {
        famine: false,
        overpopulation: false,
        riot: false
    },
    tempData: {
        houseSpace: 0,
        totalSpace: 0,
        consumedFood: 0,
        happiness: 0, 
        popLeft: 0,
        popDied: 0
    },               
    buildingHouse: {
        name: 'House',
        amount: 0,
        isUnique: false,
        isBeingBuilt: false,
        buildProgress: 0,
        costTime: 2,
        costGold: 250,
        costWood: 5,
        costStone: 0,
        requireSpace: false,
        space: 0,
        effect: 50
    },
    buildingFarm: {
        name: 'Farm',
        amount: 1,
        isUnique: false,
        isBeingBuilt: false,
        buildProgress: 0,
        costTime: 5,
        costGold: 5000,
        costWood: 20,
        costStone: 5,
        requireSpace: true,
        space: 1,
        effect: 10
    },
    buildingLumberyard: {
        name: 'Lumber yard',
        amount: 0,
        isUnique: false,
        isBeingBuilt: false,
        buildProgress: 0,
        costTime: 5,
        costGold: 500,
        costWood: 10,
        costStone: 0,
        requireSpace: true,
        space: 1,
        effect: 5
    },
    buildingQuarry: {
        name: 'Quarry',
        amount: 0,
        isUnique: false,
        isBeingBuilt: false,
        buildProgress: 0,
        costTime: 20,
        costGold: 10000,
        costWood: 100,
        costStone: 20,
        requireSpace: true,
        space: 1,
        effect: 10
    }
}
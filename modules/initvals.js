export const initData = {
    general: {
        tax: 2,
        capitalLevel: 1
    },
    basicResources: {
        month: 0,
        gold: 500,
        pop: 100,
        food: 50,
        wood: 20,
        stone: 5,
        basicSpace: 0,
        baseHappiness: 50
    },
    resourceGain: {
        goldTax: 0,
        goldTotal: 0,
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
        commerce: 0,
        consumedFood: 0,
        happiness: 0, 
        popLeft: 0,
        popDied: 0
    },
    capitalLevels: [
        {
            level: 1,
            space: 1000,
            houses: 20,
            commerce: 0,
            costTime: 0,
            costGold: 0,
            costWood: 0,
            costStone: 0,
            specialUnlock: false
        },
        {
            level: 2,
            space: 2000,
            houses: 50,
            commerce: 100,
            costTime: 20,
            costGold: 20000,
            costWood: 1000,
            costStone: 200,
            specialUnlock: false
        }
    ],
    buildingCapital: {
        name: 'Capital',
        amount: 1,
        isUnique: true,
        isVisible: true,
        isBeingBuilt: false,
        buildProgress: 0,
        requireCapitalLevel: 1,
        costTime: 20,
        costGold: 20000,
        costWood: 1000,
        costStone: 200,
        requireSpace: null,
        space: 0,
        effect: null
    },
    buildingHouse: {
        name: 'House',
        amount: 0,
        isUnique: false,
        isVisible: true,
        isBeingBuilt: false,
        buildProgress: 0,
        requireCapitalLevel: 1,
        costTime: 2,
        costGold: 250,
        costWood: 5,
        costStone: 0,
        requireSpace: true,
        space: 0,
        effect: 100
    },
    buildingFarm: {
        name: 'Farm',
        amount: 1,
        isUnique: false,
        isVisible: true,
        isBeingBuilt: false,
        buildProgress: 0,
        requireCapitalLevel: 1,
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
        isVisible: true,
        isBeingBuilt: false,
        buildProgress: 0,
        requireCapitalLevel: 1,
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
        isVisible: true,
        isBeingBuilt: false,
        buildProgress: 0,
        requireCapitalLevel: 1,
        costTime: 20,
        costGold: 10000,
        costWood: 100,
        costStone: 20,
        requireSpace: true,
        space: 1,
        effect: 10
    }
}
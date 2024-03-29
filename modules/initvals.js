export const initData = {
    general: {
        tax: 2,
        capitalLevel: 1,
        armyStatus: false
    },
    basicResources: {
        month: 0,
        gold: 500,
        pop: 100,
        food: 50,
        wood: 20,
        stone: 5,
        fame: 0,
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
        id: 'buildingCapital',
        name: 'Capital',
        amount: 1,
        isUnique: true,
        isVisible: true,
        isBeingBuilt: false,
        buildProgress: 0,
        requireCapitalLevel: false,
        costTime: 0,
        costGold: 0,
        costWood: 0,
        costStone: 0,
        requireSpace: false,
        space: 0,
        effect: null,
        specialUnlock: null,
    },
    buildingList: [
        'buildingHouse',
        'buildingFarm',
        'buildingLumberyard',
        'buildingQuarry'
    ],
    buildingHouse: {
        id: 'buildingHouse',
        name: 'House',
        buildingType: 'Population',
        amount: 0,
        isUnique: false,
        isVisible: true,
        isBeingBuilt: false,
        buildProgress: 0,
        requireCapitalLevel: null,
        costTime: 2,
        costGold: 250,
        costWood: 5,
        costStone: 0,
        requireSpace: true,
        space: 0,
        maxSpace: 0,
        effect: 100,
        info: 'Increases population capacity by #effect#.'
    },
    buildingFarm: {
        id: 'buildingFarm',
        name: 'Farm',
        buildingType: 'Resource ',
        amount: 1,
        isUnique: false,
        isVisible: true,
        isBeingBuilt: false,
        buildProgress: 0,
        requireCapitalLevel: false,
        costTime: 5,
        costGold: 5000,
        costWood: 20,
        costStone: 5,
        requireSpace: true,
        space: 0,
        maxSpace: 2,
        effect: 10,
        info: 'Produces #effect# units of food per month.'
    },
    buildingLumberyard: {
        id: 'buildingLumberyard',
        name: 'Lumber yard',
        buildingType: 'Resource ',
        amount: 0,
        isUnique: false,
        isVisible: true,
        isBeingBuilt: false,
        buildProgress: 0,
        requireCapitalLevel: false,
        costTime: 5,
        costGold: 500,
        costWood: 10,
        costStone: 0,
        requireSpace: true,
        space: 0,
        maxSpace: 1,
        effect: 5,
        info: 'Produces #effect# units of wood per month.'
    },
    buildingQuarry: {
        id: 'buildingQuarry',
        name: 'Quarry',
        buildingType: 'Resource ',
        amount: 0,
        isUnique: false,
        isVisible: true,
        isBeingBuilt: false,
        buildProgress: 0,
        requireCapitalLevel: false,
        costTime: 20,
        costGold: 10000,
        costWood: 100,
        costStone: 20,
        requireSpace: true,
        space: 0,
        maxSpace: 1,
        effect: 10,
        info: 'Produces #effect# units of stone per month.'
    }
}
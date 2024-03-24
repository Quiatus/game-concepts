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
    resourceChange: {
        gold: 0,
        pop: 0,
        food: 0,
        wood: 0,
        stone: 0
    },
    goldModifiers: {
        base: true,
        tax: true,
    },
    popModifiers: {
        base: true,
    },
    foodModifiers: {
        base: true,
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
        effect: 100
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
        space: 0,
        effect: 10
    }
}
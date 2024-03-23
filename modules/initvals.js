export const initData = {
    basicResources: {
        month: 0,
        gold: 500,
        pop: 100,
        food: 50,
        wood: 20,
        stone: 5,
        basicSpace: 1000
    },
    goldModifiers: {
        1: [true, 0],
        2: [false, 0],
        3: [false, 1.1],
        4: [false, 20]
    },
    alerts: {
        famine: false,
        overpopulation: false
    },
                    
    buildingHouse: ['House', 0, false, 2, false, 0, 250, 5, 0, false, 0, 100],  // Name, amount, unique, time, constructing, progress, gold, wood, stone, require space, space, effect
    buildingFarm: ['Farm', 1, false, 5, false, 0, 5000, 20, 5, true, 0, 5]  
}
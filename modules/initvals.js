export const initData = {
    general: {
        tax: 2,
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
        goldEvents: 0,
        goldTotal: 0,
        pop: 0,
        food: 0,
        foodEvents: 0,
        wood: 0,
        woodEvents: 0,
        stone: 0,
        stoneEvents: 0
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

// === EVENTS ===============================================================================================
    events: [
        {
            name: 'testevent',
            description: ['testevent'],
            type: '',
            rarity: 1,
            unlocked: false,
            active: false,
            timed: true,
            remainingTime: 10,
            effect: 0,
            isRandom: true,
            random: {
                val: 'remainingTime',
                min: 5,
                max: 15
            }
        },
        {
            name: 'gainGoldExplSmall',
            description: [
                'Our scouts have found a small pouch. It contained #effect#.',
                'While found an old merchant cart next to the road. There was some goods left worth #effect#.'
                ],
            type: 'gainGold',
            rarity: 1,
            unlocked: true,
            active: false,
            timed: false,
            effect: 0,
            isRandom: true,
            random: {
                val: 'effect',
                min: 50,
                max: 100
            }
        },
        {
            name: 'gainStoneExplSmall',
            description: [
                'Our scouts have discovered an old mine. We gained #effect#.',
                'We discovered a small quarry. We were able to gain #effect#.'
                ],
            type: 'gainStone',
            rarity: 1,
            unlocked: true,
            active: false,
            timed: false,
            effect: 0,
            isRandom: true,
            random: {
                val: 'effect',
                min: 2,
                max: 5
            }
        },
        {
            name: 'gainWoodExplSmall',
            description: [
                'Our scouts have disovered an abandoned lumber camp. We gained #effect#.',
                'We discovered a ruined settlement. Most of the valuables were already scavanged, but we found some wood. Gained #effect#.'
                ],
            type: 'gainWood',
            rarity: 1,
            unlocked: true,
            active: false,
            timed: false,
            effect: 0,
            isRandom: true,
            random: {
                val: 'effect',
                min: 1,
                max: 10
            }
        },
        {
            name: 'gainFoodExplSmall',
            description: [
                'We have discovered a small camp. Whoever was here had to leave in hurry and left the supplies behind. We gained #effect#.',
                'Our scouts have discovered an old farm. We gained #effect#.'
                ],
            type: 'gainFood',
            rarity: 1,
            unlocked: true,
            active: false,
            timed: false,
            effect: 0,
            isRandom: true,
            random: {
                val: 'effect',
                min: 5,
                max: 10
            }
        },
    ],

// === BUILDINGS ===============================================================================================
    buildingList: [
        'buildingHouse',
        'buildingFarm',
        'buildingLumberyard',
        'buildingQuarry'
    ],
    buildingCapital: {
        id: 'buildingCapital',
        name: 'Capital',
        textColor: 'text-gray',
        amount: 1,
        isUnique: true,
        isVisible: true,
        isBeingBuilt: false,
        isUpgradeable: true,
        currentLevel: 1,
        maxLevel: 2,
        buildProgress: 0,
        requireCapitalLevel: false,
        costTime: 0,
        costGold: 0,
        costWood: 0,
        costStone: 0,
        requireSpace: true,
        space: 1,
        maxSpace: 1,
        effect: null,
        specialUnlock: null,
        levels: [
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
        ]
    },
    buildingHouse: {
        id: 'buildingHouse',
        name: 'House',
        buildingType: 'Population',
        textColor: 'text-purple',
        amount: 0,
        isUnique: false,
        isVisible: true,
        isBeingBuilt: false,
        isUpgradeable: false,
        currentLevel: null,
        maxLevel: null,
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
        textColor: 'text-yellow',
        amount: 1,
        isUnique: false,
        isVisible: true,
        isBeingBuilt: false,
        isUpgradeable: false,
        currentLevel: null,
        maxLevel: null,
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
        textColor: 'text-brown',
        amount: 0,
        isUnique: false,
        isVisible: true,
        isBeingBuilt: false,
        isUpgradeable: false,
        currentLevel: null,
        maxLevel: null,
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
        textColor: 'text-darkgray',
        amount: 0,
        isUnique: false,
        isVisible: true,
        isBeingBuilt: false,
        isUpgradeable: false,
        currentLevel: null,
        maxLevel: null,
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
        info: 'Produces #effect# units of stone per month.',
    }
}
export const initData = {
    general: {
        tax: 2,
        armyStatus: false,
        maxMissions: 6,
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
        riot: false,
        pestilence: false,
        siege: false,
        desertion: false,
        dragonplague: false,
        etherstorm: false
    },
    tempData: {
        houseSpace: 0,
        totalSpace: 0,
        commerce: 0,
        consumedFood: 0,
        happiness: 0, 
        popLeft: 0,
        popDied: 0,
        might: 0,
        activeMissions: 0,
        milPay: 0
    },

// === EVENTS ===============================================================================================
    events: [
        {
            id: 1,
            description: ['Thanks to the favourable weather, our <span class="text-yellow">farms</span> produce <span class="text-green">20%</span> more <img class="img-s" src="media/food.png">'],
            type: 'foodGainMultiplier',
            rarity: 1,
            isMission: false,
            unlocked: false,
            unlockConditions: {
                month: 100,
                fame: 0,
                might: 0,
                special: true  // if false, the special condition was not met, if true, it was met. A specific function will control this
            },
            active: false,
            isTimed: true,
            remainingTime: 0,
            effect: 1.2,
            isRandom: true,
            random: [['remainingTime', 5, 15]]
        },
        {
            id: 2,
            description: ['Our people are happy with our leadership. <img class="img-s" src="media/pop.png"> gain is increased by <span class="text-green">25%</span>.'],
            type: 'popHappyGainMultiplier',
            rarity: 1,
            isMission: false,
            unlocked: false,
            unlockConditions: {
                month: 0,
                fame: 0,
                might: 0,
                special: false  
            },
            active: false,
            isTimed: true,
            remainingTime: 0,
            effect: 1.25,
            isRandom: true,
            random: [['remainingTime', 6, 12]]
        },

        {
            id: 3,
            description: ['A group of refugess has arrived and seeks asylum. Do we want to accept them?'],
            type: 'missionRefugeesSmall',
            rarity: 5,
            isMission: true,
            missionType: 'General',
            isDisplayed: false,
            missionDescription: {
                name: 'Refugees',
                objective: 'Accept refugees',
                description: 'A group of refugess are waiting in front of our gates. If we accept them, they will be added to our population. They also brought some supplies with them.',
                success: 'We welcomed the refugees to our clan!',
                failure: 'We sent the refugees away!'
            },
            rewards: [['pop', 0, 5, 25, 10],['gold', 0, 25, 75, 10],['food', 0, 5, 15, 10],['fame', 0, 20, 20, 1]],
            unlocked: true,
            active: false,
            isTimed: true,
            remainingTime: 0,
            effect: 0,
            isRandom: true,
            random: [['remainingTime', 5, 20]]
        },

        {
            id: 4,
            description: [
                'While exploring woods, our scouts discovered a small, partly buried wooden box. It contained #effect#.',
                'We found an abandoned merchant cart. It looks like whoever attack it, stole most of the goods, but we noticed a few gold pieces scattered around. Gained #effect#.',
                'While crossing a river, our explorers noticed a crate floating in the stream. They were able to pull it out and look inside. It contained #effect#'
                ],
            type: 'gainGold',
            rarity: 1,
            isMission: false,
            unlocked: true,
            active: false,
            isTimed: false,
            effect: 0,
            isRandom: true,
            random: [['effect', 50, 100]]
        },
        {
            id: 5,
            description: [
                'Our scouts have discovered an old quarry. While almost depleted, we were able to found some viable stone. We gained #effect#.',
                'Our scouts discovered a burnt village. We were able to salvage some building materials. Gained #effect#.'
                ],
            type: 'gainStone',
            rarity: 1,
            isMission: false,
            unlocked: true,
            active: false,
            isTimed: false,
            effect: 0,
            isRandom: true,
            random: [['effect', 2, 5]]
        },
        {
            id: 6,
            description: [
                'Our scouts have disovered an abandoned lumber yard. Gained #effect#.',
                'We discovered a ruined settlement. Most of the valuables were already scavanged, but we found some wood. Gained #effect#.'
                ],
            type: 'gainWood',
            rarity: 1,
            isMission: false,
            unlocked: true,
            active: false,
            isTimed: false,
            effect: 0,
            isRandom: true,
            random: [['effect', 1, 10]]
        },
        {
            id: 7,
            description: [
                'We have discovered a small camp. Whoever was here had to leave in hurry and left the supplies behind. We gained #effect#.',
                'Our scouts have discovered an old farm. We gained #effect#.'
                ],
            type: 'gainFood',
            rarity: 1,
            isMission: false,
            unlocked: true,
            active: false,
            isTimed: false,
            effect: 0,
            isRandom: true,
            random: [['effect', 5, 10]]
        },
        {
            id: 8,
            description: [
                'We have discovered a fertile land. We can build a #effect# here.'
                ],
            type: 'gainFarmSpace',
            rarity: 5,
            isMission: false,
            unlocked: true,
            active: false,
            isTimed: false,
            effect: 1,
            isRandom: false,
        },
        {
            id: 9,
            description: [
                'We have discovered a large forest, with wood ideal for construction. We can build a #effect# here.'
                ],
            type: 'gainLumberSpace',
            rarity: 7,
            isMission: false,
            unlocked: true,
            active: false,
            isTimed: false,
            effect: 1,
            isRandom: false,
        },
        {
            id: 10,
            description: [
                'Our scouts have discovered a large stone deposite. We can built a new #effect#.'
                ],
            type: 'gainQuarrySpace',
            rarity: 10,
            isMission: false,
            unlocked: true,
            active: false,
            isTimed: false,
            effect: 1,
            isRandom: false,
        }
    ],

// === BUILDINGS ===============================================================================================
    buildings: [
        {
            id: 'buildingCapital',  // 0
            name: 'Capital',
            textColor: 'text-gray',
            amount: 1,
            isUnique: true,
            isVisible: true,
            isBeingBuilt: false,
            isUpgradeable: true,
            currentLevel: 1,
            maxLevel: 3,
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
                    houses: 4,
                    commerce: 0,
                    militiaRecruit: 10,
                    costTime: 0,
                    costGold: 0,
                    costWood: 0,
                    costStone: 0,
                    specialUnlock: false
                },
                {
                    level: 2,
                    space: 2000,
                    houses: 10,
                    commerce: 100,
                    militiaRecruit: 25,
                    costTime: 20,
                    costGold: 20000,
                    costWood: 1000,
                    costStone: 200,
                    specialUnlock: false
                },
                {
                    level: 3,
                    space: 5000,
                    houses: 25,
                    commerce: 1000,
                    militiaRecruit: 100,
                    costTime: 50,
                    costGold: 100000,
                    costWood: 5000,
                    costStone: 1500,
                    specialUnlock: false
                }
            ]
        },
        {
            id: 'buildingHouse',  // 1
            name: 'Housing district',
            buildingType: 'General',
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
            costTime: 10,
            costGold: 2500,
            costWood: 50,
            costStone: 0,
            requireSpace: true,
            space: 0,
            maxSpace: 0,
            effect: 500,
            info: 'Increases population capacity by #effect#.'
        },
        {
            id: 'buildingFarm',  // 2
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
            maxSpace: 1,
            effect: 10,
            info: 'Produces #effect# units of <span class="text-yellow">food</span> per month.'
        },
        {
            id: 'buildingLumberyard',  // 3
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
            maxSpace: 0,
            effect: 5,
            info: 'Produces #effect# units of <span class="text-brown">wood</span> per month.'
        },
        {
            id: 'buildingQuarry',  // 4
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
            maxSpace: 0,
            effect: 2,
            info: 'Produces #effect# units of <span class="text-darkgray">stone</span> per month.',
        }
    ],
// === UNITS ===============================================================================================
    units: [
        {
            name: 'Militia',
            amount: 10,
            attack: 3,
            defense: 2,
            hp: 5,
            speed: 5, // higher is better
            attackType: 4, // 1 - heavy, 2 - range, 3 - support, 4 - melee
            pay: 0.2,
            might: 7,  // attack + (0.5 * (def + hp)) * (0.5 * speed) * atT coef
            isRecruitable: true,
            recrutpm: 0,
            queue: 0,
            recruitCost: {
                gold: 1,
                pop: 1
            },
            equipment: {
                weapon: null,
                armor: null,
                trinket: null
            },
            element: false,
            magic: false
        },
        {
            name: 'Archer',
            amount: 0,
            attack: 4,
            defense: 1,
            hp: 3,
            speed: 6,
            attackType: 2, 
            pay: 0.5,
            might: 10,
            isRecruitable: false,
            recrutpm: 0,
            queue: 0,
            recruitCost: {
                gold: 1,
                pop: 1
            },
            equipment: {
                weapon: null,
                armor: null,
                trinket: null
            },
            element: false,
            magic: false
            
        }
    ]
        
}
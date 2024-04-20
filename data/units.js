export const unitData = {
    units: [
        {
            name: 'Militia',
            amount: 0,
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
            recruitMessage: 'We trained <span class="text-bold">##amount##</span> milita.',
            recruitCost: {
                gold: 5,
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
            attack: 5,
            defense: 1,
            hp: 3,
            speed: 6,
            attackType: 2, 
            pay: 0.5,
            might: 12,
            isRecruitable: false,
            recrutpm: 0,
            queue: 0,
            recruitMessage: '<span class="text-bold">##amount##</span> new archers arrived from the archery range.',
            recruitCost: {
                gold: 15,
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
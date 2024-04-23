export const tavernData = {
    tavern: [
        {
            name: 'oldMiner',
            active: true,
            isUnlocked: true,
            unlockConditions: null,
            price: ['gold', 5000],
            reward: 'Copper Mine',
            title: 'An old miner',
            dialogue: [
                `You notice an old, shabby-looking man sitting alone in a corner, his mug half-empty. He looks like he missed quite a few meals and you start to wonder if he has any coin to pay for the ale. 
                Knowing how the barkeep deals with freeloaders, you approach the man and sits down at the seat opposite of him.`,
                {
                    id: 1,
                    question: 'Who are you?',
                    answer: 'Old miner',
                    clicked: false,
                    isUnlocked: true,
                    unlocks: [],
                    isEnding: false                 
                }
            ]
        }
    ]
}
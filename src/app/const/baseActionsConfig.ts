export const BASE_ACTIONS = [
    {
        id: "B_1",
        title: "Movement",
        description: "Move your character to a different location.",
        source: "base",
        cost: {
            ap: 1
        },
        effects: [
            { type: "selectDestinationRoom" },
            { type: "movePlayers", payload: { includeSelf: true } }
        ],
        targeting: {
            type: "self"
        }
    },
    {
        id: "B_2",
        title: "Quiet movement",
        description: "Move your character to a different location.",
        source: "base",
        cost: {
            ap: 2
        },
        effects: [
            { type: "selectDestinationRoom" },
            { type: "movePlayers", payload: { includeSelf: true } }
        ],
        targeting: {
            type: "self"
        }
    }
]
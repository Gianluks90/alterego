import { ITEM_TYPE, TARGET_TYPE } from "./effects";

export const BASE_ACTIONS = [
    {
        id: "B_1",
        title: "Movimento",
        description: "Permette di muoversi in una stanza adiacente. Verrà prodotto casualmente del rumore.",
        source: "base",
        tags: ["base", "esplorazione"],
        cost: {
            ap: 1
        },
        effects: [
            { type: "selectDestinationRoom", payload: {allowAdjacentOnly: true } },
            { type: "movePlayers", payload: { playerIds: [], to: "", includeSelf: true } }
        ],
        targeting: {
            type: "self"
        },
        ui: { icon: "directions_run", hotkey: "w" }
    },
    {
        id: "B_2",
        title: "Movimento cauto",
        description: "Permette di muoversi in una stanza adiacente. Verrà prodotto del rumore ridotto.",
        source: "base",
        tags: ["base", "esplorazione"],
        cost: {
            ap: 2
        },
        effects: [
            { type: "selectDestinationRoom", payload: {allowAdjacentOnly: true } },
            { type: "movePlayers", payload: { includeSelf: true } }
        ],
        targeting: {
            type: "self"
        },
        ui: { icon: "directions_walk" }
    },
    {
        id: "B_3",
        title: "Sparare",
        description: "Spara un colpo ad un bersaglio visibile. Non è consentito sparare ad un altro Agente.",
        source: "base",
        tags: ["base", "offensiva"],
        cost: {
            ap: 1
        },
        preconditions: [
            { type: "hasAmmunition" },
            { type: "hasVisibleHostileTarget" }
        ],
        effects: [
            { type: "selectTarget", payload: { filter: TARGET_TYPE.ENEMY } },
            { type: "dealDamage", payload: { amount: 1, to: "" } },
        ],
        targeting: { type: TARGET_TYPE.ENEMY },
        ui: { icon: "target" }
    },
    {
        id: "B_4",
        title: "Attacco in mischia",
        description: "Effettua un attacco in mischia ad un bersaglio visibile. Azione potenzialmente pericolosa. Non è consentito attaccare un altro Agente.",
        source: "base",
        tags: ["base", "offensiva"],
        cost: {
            ap: 1
        },
        preconditions: [
            { type: "hasVisibleHostileTarget" }
        ],
        effects: [
            { type: "selectTarget", payload: { filter: TARGET_TYPE.ENEMY } },
            { type: "dealDamage", payload: { amount: 1, to: "" } },
        ],
        targeting: {
            type: TARGET_TYPE.ENEMY
        },
        ui: { icon: "front_hand" }
    },
    {
        id: "B_5",
        title: "Raccogliere oggetto pesante",
        description: "Raccogli un oggetto pesante da terra. Richiede almeno una mano libera.",
        source: "base",
        tags: ["base", "interazione"],
        cost: {
            ap: 1
        },
        preconditions: [
            { type: "canCarryHeavyObject" },
            { type: "itemOnFloor", payload: { weight: "heavy" } }
        ],
        effects: [
            { type: "selectItemOnFloor", payload: { filter: ITEM_TYPE.HEAVY } },
            { type: "pickUpItem", payload: { playerId: "", itemId: "" } }
        ],
        ui: { icon: "arrow_shape_up_stack" }
    },
    {
        id: "B_6",
        title: "Scambiare",
        description: "Avvia una sessione di scambio con ogni altro Agente nella stanza corrente.",
        source: "base",
        tags: ["base", "interazione"],
        cost: {
            ap: 1
        },
        preconditions: [
            { type: "hasOtherAgentsInRoom" },
            { type: "canTrade" }
        ],
        effects: [
            { type: "initiateTradeSession", payload: { participantIds: [] }}
        ],
        ui: { icon: "partner_exchange" }
    },
    {
        id: "B_7",
        title: "Creare strumento",
        description: "Combina due materiali per creare un nuovo strumento. Gli strumenti combinati verranno consumati",
        source: "base",
        tags: ["base", "crafting"],
        cost: {
            ap: 1
        },
        preconditions: [
            { type: "hasMaterialsToCraftTool" }
        ],
        effects: [
            { type: "craft", payload: { consumes: ["", ""], result: "tool" } }
        ],
        ui: { icon: "build_circle" }
    }
]
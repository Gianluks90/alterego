export const ROOM_ACTIONS = [
    {
        id: "R_01",
        title: "Ricarica le tue armi ad energia",
        description: "Scegli e ricarica un'arma ad energia per il valore di 2 cariche. Non è possibile superare il massimo di cariche dell'arma.",
        source: "room",
        tags: [],
        cost: {
            cards: 2
        },
        preconditions: [
            { type: "hasEnergyWeaponInInventory" }
        ],
        effects: [
            { type: "selectItemFromInventory", payload: { filter: { type: "weapon", subtype: "energy" } } },
            { type: "modifyItemCharges", payload: { itemId: "", amount: 2 } }
        ],
        targeting: {
            type: "self"
        },
        ui: { icon: "battery_charging_50" }
    },
    {
        id: "R_02",
        title: "Lancia un segnale",
        description: "Lancia un segnale a grandissima distanza. Necessario al completamento di alcuni obbiettivi.",
        source: "room",
        tags: [],
        cost: {
            cards: 2
        },
        preconditions: [
            { type: "noSignalEmitted" }
        ],
        effects: [
            { type: "emitSignal", payload: {} }
        ],
        targeting: {
            type: "self"
        },
        ui: { icon: "sensors" }
    },
    {
        id: "R_03",
        title: "Medica le tue ferite",
        description: "Benda tutte le ferite Gravi oppure cura una delle tue ferite Gravi bendate oppure cura tutte le tue ferite leggere.",
        source: "room",
        tags: [],
        cost: {
            cards: 2
        },
        preconditions: [
            { type: "hasInjuries" }
        ],
        effects: [
        { 
            type: "chooseEffect", 
            payload: { 
                options: [
                    { label: "Benda tutte le ferite gravi", type: "heal", payload: { severity: "severe", mode: "bandagingAll" } },
                    { label: "Cura una ferita grave bendata", type: "heal", payload: { severity: "severe", mode: "oneBanded" } },
                    { label: "Cura tutte le ferite leggere", type: "heal", payload: { severity: "light", mode: "all" } }
                ]
            }
        }
    ],
        targeting: {
            type: "self"
        },
        ui: { icon: "medical_services" }
    }
];
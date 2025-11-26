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
    },
    {
        id: "RS_01",
        title: "Controllo delle coordinate",
        description: "Verifica l'attuale destinazione del viaggio. Una volta acquisita l'informazione non è obbligatorio comunicarla al resto dell'equipaggio. Attenzione: per una questione di sicurezza l'informazione non verrà memorizzata.",
        source: "room",
        tags: [],
        cost: {
            cards: 2
        },
        preconditions: [],
        effects: [
            { type: "checkCoordinates", payload: {} }
        ],
        targeting: {
            type: "self"
        },
        ui: { icon: "navigation" }
    },
    {
        id: "RS_02",
        title: "Imposta la destinazione",
        description: "Assegna una nuova destinazione al viaggio. Attenzione: sarà impossibile impostare una nuova destinazione se almeno una delle capsule di ibernazione è in uso.",
        source: "room",
        tags: [],
        cost: {
            cards: 2
        },
        preconditions: [
            { type: "noCryoPodsInUse" }
        ],
        effects: [
            { type: "setDestination", payload: {} }
        ],
        targeting: {
            type: "self"
        },
        ui: { icon: "navigation" }
    },
    {
        id: "RS_03",
        title: "Controllo del motore",
        description: "Verifica lo stato del motore. Una volta acquisita l'informazione non è obbligatorio comunicarla al resto dell'equipaggio. Attenzione: per una questione di sicurezza l'informazione non verrà memorizzata.",
        source: "room",
        tags: [],
        cost: {
            cards: 2
        },
        preconditions: [
        ],
        effects: [
            { type: "checkEngine", payload: {} }
        ],
        targeting: {
            type: "self"
        },
        ui: { icon: "search_gear" }
    },
    {
        id: "RS_04",
        title: "Procedura di ibernazione",
        description: "Se le Capsule di ibernazione sono funzionanti è possibile iniziare la procedura di ibernazione. La procedura di ibernazione, se eseguita con successo, è irreversibile.",
        source: "room",
        tags: [],
        cost: {
            cards: 2
        },
        preconditions: [
            { type: "cryoPodsActivated" }
        ],
        effects: [
            { type: "startCryoProcedure", payload: {} }
        ],
        targeting: {
            type: "self"
        },
        ui: { icon: "ac_unit" }
    },
];
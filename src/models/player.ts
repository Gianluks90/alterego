import { GameAction } from "./gameAction";

export interface Player {
    uid: string;
    order: number;

    name: string;
    surname: string;
    role: string;
    archetype: Archetype;
    company: Company;

    objectives: Objective[];

    actions: {
        deck: Card[];
        discardPile: Card[];
        hand: Card[];
    };
    inventory: Inventory;
    parameters: Parameters;
    actionPoints: number;
    position: {
        roomId: string;
        offsetX: number;
        offsetY: number;
    };

    secretion: boolean;
    signalEmitted: boolean;

    status: 'pending' | 'setup' | 'ready';
}

interface Card {
    id: string;
    actionId: string;
    contaminated: boolean;
}

export interface Company {
    name: string;
    description: string;
}

export interface Objective {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
}

export interface Inventory {
    items: Item[];
    mainHand: Item | null;
    offHand: Item | null;
}

export interface Item {
    id: string;
    name: string;
    description: string;
    type: 'generic' | 'medical' | 'utility' | 'military' | 'crafting';
    heavy: boolean;
    ammo?: number;
    maxAmmo?: number;
    craftingMaterial: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface Parameters {
    health: number;
    heavyWounds: any[];
    contaminationLevel: number;
}

export interface Archetype {
    id: number;
    name: string;
    description: string;
    roles: string[];
    actions: string[];
}

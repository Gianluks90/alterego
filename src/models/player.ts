import { Effect } from "../app/const/effects";

export interface Player {
    uid: string;
    order: number;

    name: string;
    surname: string;
    role: string;
    archetype: Archetype;
    company: string;

    objectives: Objective[];

    actions: {
        deck: Action[];
        discardPile: Action[];
        hand: Action[];
    };
    inventory: Inventory;
    parameters: Parameters;
    actionPoints: number;

    status: 'pending' | 'setup' | 'ready';
}

export interface Objective {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
}

export interface Action {
  id: string; // es: "attacco_base" o uuid per istanze
  title: string;
  description: string; // testo templated
  source: ActionSource; // mano, stanza, oggetto, archetype, global
  tags?: string[]; // es: ["offensiva","mana"]
  cost?: {
    ap?: number;
    useItemId?: string; // esempio
  };
  preconditions?: Precondition[]; // array di funzioni/descrizioni serializzabili
  effects: Effect[]; // lista di effetti atomici
  targeting?: TargetSpec; // come scegliere bersagli
  ui?: { icon?: string; hotkey?: string };
  meta?: Record<string, any>; // estensioni future
}

type ActionSource = "hand" | "room" | "object" | "archetype" | "base" | "event";

interface Precondition {
  type: "hasItem" | "minAP" | "notStatus" | "custom";
  payload?: any;
}

interface TargetSpec {
  type: "self" | "singleAlly" | "singleEnemy" | "area" | "custom";
  range?: number;
  areaOfEffect?: number;
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

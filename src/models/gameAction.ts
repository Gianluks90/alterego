import { Effect } from "../app/types/effects";

export interface GameAction {
  id: string; // es: "attacco_base" o uuid per istanze
  title: string;
  description: string; // testo templated
  source: ActionSource; // mano, stanza, oggetto, archetype, global
  tags?: string[]; // es: ["offensiva","mana"]
  cost: {
    cards: number;
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
import { Timestamp } from "firebase/firestore";
import { Player } from "./player";

export interface Mission {
  id: string;
  name: string;
  password: string;
  createdBy: string;
  createdAt: Timestamp;
  playersLimit: number;
  archetypeIds: number[];
  players: string[];
  playersData: Player[];
  chatLog: MissionChatMessage[];
  status: 'waiting' | 'in_progress' | 'finished';

  phase?: string;
  turnCounter: number;
  fireCounter: number;
  malfunctionCounter: number;
  criogenicChamberStatus: 'active' | 'inactive';
  criogenicChambers: CriogenicChamber[]
  
  turnOwner?: string;
  entities?: Record<string, Entity>;
}

export interface MissionChatMessage {
  senderPlayer: string;
  message: string;
  timestamp: Timestamp;
  class?: string;
}

export interface CriogenicChamber {
  id: string;
  occupiedBy: string | null;
}

export type EntityType = 'player' | 'enemy' | 'item' | 'object' | 'marker';
export interface Entity { 
  id: string; 
  type: EntityType; 
  pos?: [number, number]; 
  meta?: any; 
}
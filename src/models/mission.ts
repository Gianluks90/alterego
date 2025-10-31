import { Timestamp } from "firebase/firestore";
import { Player } from "./player";

export interface Mission {
  id: string;
  name: string;
  password: string;
  createdBy: string;
  createdAt: Timestamp;
  playersLimit: number;
  players: string[];
  playersData: Player[];
  chatLog: MissionChatMessage[];
  status: 'waiting' | 'in_progress' | 'finished';
}

export interface MissionChatMessage {
  senderPlayer: string;
  message: string;
  timestamp: Timestamp;
  class?: string;
}
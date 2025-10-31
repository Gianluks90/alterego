import { Timestamp } from "firebase/firestore";

export interface Game {
  id: string;
  name: string;
  password: string;
  createdBy: string;
  createdAt: Timestamp;
  playersLimit: number;
  players: string[];
  status: 'waiting' | 'in_progress' | 'finished';
}
import { Timestamp } from "firebase/firestore";

export interface AppUser {
    uid: string;
    username: string;
    email: string;
    createdAt: Timestamp;
}
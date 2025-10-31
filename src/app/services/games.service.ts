import { Injectable, signal, WritableSignal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Game } from '../../models/game';
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, onSnapshot, query, setDoc, Timestamp, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  public $games: WritableSignal<Game[] | null> = signal(null);

  constructor(private firebaseService: FirebaseService) { 
  }

  public async getMyGames(userId: string): Promise<any> {
    const colRef = collection(this.firebaseService.database, 'games');
    const q = query(colRef, where('players', 'array-contains', userId));
    const unsub = onSnapshot(q, (snapshot) => {
      const games: Game[] = [];
      snapshot.forEach(doc => {
        games.push({ id: doc.id, ...doc.data() } as Game);
      });
      this.$games.set(games);
    });
  }

  public async createNewGame(gameData: Partial<Game>, userId: string): Promise<any> {
    const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const colRef = doc(this.firebaseService.database, 'games', randomId);
    const data = {
      id: randomId,
      ...gameData,
      createdBy: userId,
      createdAt: Timestamp.now(),
      players: [userId],
      status: 'waiting'
    }
    return await setDoc(colRef, data);
  }

  public async joinGame(gameId: string, userId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'games', gameId);
    return await setDoc(docRef, {
      players: arrayUnion(userId)
    }, { merge: true });
  }

  public async leaveGame(gameId: string, userId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'games', gameId);
    return await setDoc(docRef, {
      players: arrayRemove(userId)
    }, { merge: true });
  }

  public async deleteGame(gameId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'games', gameId);
    await deleteDoc(docRef)
  }
}

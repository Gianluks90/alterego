import { Injectable, signal, WritableSignal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Mission, MissionChatMessage } from '../../models/mission';
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, onSnapshot, query, setDoc, Timestamp, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class MissionService {

  public $missions: WritableSignal<Mission[] | null> = signal(null);
  public $selectedMission: WritableSignal<Mission | null> = signal(null);

  constructor(private firebaseService: FirebaseService) { 
  }

  public async getMyMissions(userId: string): Promise<any> {
    const colRef = collection(this.firebaseService.database, 'missions');
    const q = query(colRef, where('players', 'array-contains', userId));
    const unsub = onSnapshot(q, (snapshot) => {
      const missions: Mission[] = [];
      snapshot.forEach(doc => {
        missions.push({ id: doc.id, ...doc.data() } as Mission);
      });
      this.$missions.set(missions);
    });
  }

  public async getMissionById(missionId: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'missions', missionId);
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const mission = { id: docSnap.id, ...docSnap.data() } as Mission;
        this.$selectedMission.set(mission);
      } else {
        this.$selectedMission.set(null);
      }
    });
  }

  public async createNewMission(missionData: Partial<Mission>, userId: string): Promise<any> {
    const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const colRef = doc(this.firebaseService.database, 'missions', randomId);
    const data = {
      id: randomId,
      ...missionData,
      createdBy: userId,
      createdAt: Timestamp.now(),
      players: [userId],
      playersData: [{
        uid: userId,
        name: '',
        surname: '',
        role: '',
        company: ''
      }],
      chatLog: [],
      status: 'waiting'
    }
    return await setDoc(colRef, data);
  }

  public async joinMission(missionId: string, userId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'missions', missionId);
    return await setDoc(docRef, {
      players: arrayUnion(userId)
    }, { merge: true });
  }

  public async leaveMission(missionId: string, userId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'missions', missionId);
    return await setDoc(docRef, {
      players: arrayRemove(userId)
    }, { merge: true });
  }

  public async deleteMission(missionId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'missions', missionId);
    await deleteDoc(docRef)
  }

  public async newChatLog(logData: MissionChatMessage, missionId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'missions', missionId);
    return await setDoc(docRef, {
      chatLog: arrayUnion(logData)
    }, { merge: true });
  }

  public async emptyChatLogs(missionId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'missions', missionId);
    return await setDoc(docRef, {
      chatLog: []
    }, { merge: true });
  }
}

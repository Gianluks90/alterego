import { Injectable, signal, WritableSignal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Mission, MissionChatMessage } from '../../models/mission';
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, Timestamp, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class MissionService {

  public $missions: WritableSignal<Mission[] | null> = signal(null);
  public $selectedMission: WritableSignal<Mission | null> = signal(null);
  public $selectedPlayerData: WritableSignal<any | null> = signal(null);

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
    const playersDataRef = collection(this.firebaseService.database, 'missions', missionId, 'playersData');

    const unsub = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const playersDataSnap = await getDocs(playersDataRef);
        const playersData = playersDataSnap.docs.map(d => ({ uid: d.id, ...d.data() }));

        const mission = { id: docSnap.id, ...docSnap.data(), playersData } as Mission;
        this.$selectedMission.set(mission);
      } else {
        this.$selectedMission.set(null);
      }
    });
  }

  public async getPlayerData(missionId: string, playerId: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'missions', missionId, 'playersData', playerId);

    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        this.$selectedPlayerData.set({ uid: docSnap.id, ...docSnap.data() });
      } else {
        this.$selectedPlayerData.set(null);
      }
    });
  }

  public async createNewMission(missionData: Partial<Mission>, userId: string): Promise<any> {
    const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const docRef = doc(this.firebaseService.database, 'missions', randomId);
    const dataRef = doc(this.firebaseService.database, 'missions', randomId, 'playersData', userId);

    Promise.all([
      setDoc(docRef, {
        id: randomId,
        ...missionData,
        createdBy: userId,
        createdAt: Timestamp.now(),
        players: [userId],
        chatLog: [],
        status: 'waiting'
      }),

      setDoc(dataRef, {
        uid: userId,
        name: '',
        surname: '',
        role: '',
        company: ''
      })
    ]).catch((error) => {
      console.error('Error creating new mission: ', error);
    });
  }

  public async joinMission(missionId: string, userId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'missions', missionId);
    const dataRef = collection(this.firebaseService.database, 'missions', missionId, 'playersData');

    Promise.all([
      setDoc(docRef, {
        players: arrayUnion(userId),
      }, { merge: true }),

      addDoc(dataRef, {
        uid: userId,
        name: '',
        surname: '',
        role: '',
        company: ''
      })
    ]).catch((error) => {
      console.error('Error joining mission: ', error);
    });
  }

  public async leaveMission(missionId: string, userId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'missions', missionId);
    return await setDoc(docRef, {
      players: arrayRemove(userId)
    }, { merge: true }).catch((error) => {
      console.error('Error leaving mission: ', error);
    });
  }

  public async deleteMission(missionId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'missions', missionId);
    await deleteDoc(docRef).catch((error) => {
      console.error('Error deleting mission: ', error);
    });
  }

  // LOBBY CHAT LOG

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

  // AGENT SETUP

  public async assignPlayerOrder(missionId: string, playerId: string, order: number): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'missions', missionId, 'playersData', playerId);
    return await setDoc(docRef, {
      order: order
    }, { merge: true });
  }

  public async selectCompany(missionId: string, playerId: string, company: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'missions', missionId, 'playersData', playerId);
    return await setDoc(docRef, {
      company: company
    }, { merge: true });
  }
}

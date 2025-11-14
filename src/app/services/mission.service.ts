import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Mission, MissionChatMessage } from '../../models/mission';
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, Timestamp, where } from 'firebase/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MissionService {

  public $missions: WritableSignal<Mission[] | null> = signal(null);
  public $selectedMission: WritableSignal<Mission | null> = signal(null);
  public $selectedPlayerData: WritableSignal<any | null> = signal(null);

  public _lobbyState = computed(() => {
    const mission = this.$selectedMission();
    const player = this.$selectedPlayerData();

    return {
      mission,
      player,
      ready: !!mission && !!player
    };
  });

  constructor(private firebaseService: FirebaseService, private router: Router) {
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
        this.router.navigate(['/missions']);
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
        archetypeIds: [
          1, 2, 3, 4, 5, 6, 7
        ],
        status: 'waiting'
      }),

      setDoc(dataRef, {
        uid: userId,
        name: '',
        surname: '',
        role: '',
        company: '',
        status: 'pending'
      })
    ]).catch((error) => {
      console.error('Error creating new mission: ', error);
    });
  }

  public async joinMission(missionId: string, userId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'missions', missionId.toUpperCase());
    const dataRef = doc(this.firebaseService.database, 'missions', missionId.toUpperCase(), 'playersData', userId);

    Promise.all([
      setDoc(docRef, {
        players: arrayUnion(userId),
      }, { merge: true }),

      setDoc(dataRef, {
        uid: userId,
        name: '',
        surname: '',
        role: '',
        company: '',
        status: 'pending'
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
    const docRef = doc(this.firebaseService.database, 'missions', missionId.toUpperCase());
    await deleteDoc(docRef).catch((error) => {
      console.error('Error deleting mission: ', error);
    });
  }

  public async launchMission(missionId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'missions', missionId);
    return await setDoc(docRef, {
      status: 'in_progress',
      phase: 'init',
      turnOwner: null,
      entities: [],
      startedAt: Timestamp.now()
    }, { merge: true });
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

  public async updatePlayerStatus(missionId: string, playerId: string, status: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'missions', missionId, 'playersData', playerId);
    return await setDoc(docRef, {
      status: status
    }, { merge: true });
  }

  public async assignPlayerOrder(missionId: string, playerId: string, order: number): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'missions', missionId, 'playersData', playerId);
    return await setDoc(docRef, {
      order: order
    }, { merge: true });
  }

  public async completeAgentSetup(missionId: string, playerId: string, data: any): Promise<void> {
    const missionRef = doc(this.firebaseService.database, 'missions', missionId);
    const docRef = doc(this.firebaseService.database, 'missions', missionId, 'playersData', playerId);

    Promise.all([
      await setDoc(docRef, {
        name: data.name,
        surname: data.surname,
        role: data.role,
        archetype: data.archetype,
        company: data.company,

        objectives: [],

        actions: {
          deck: [],
          discardPile: [],
          hand: [],
        },
        inventory: {
          items: [],
          mainHand: null,
          offHand: null
        },
        parameters: {
          health: 3,
          heavyWounds: [],
          contaminationLevel: 0
        },
        actionPoints: 2,

        status: 'ready'
      }, { merge: true }),

      await setDoc(missionRef, {
        archetypeIds: arrayRemove(data.archetype.id)
      }, { merge: true })
    ]).catch((error) => {
      console.error('Error completing agent setup: ', error);
    });
  }
}

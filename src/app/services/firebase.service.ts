import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { addDoc, collection, doc, DocumentData, Firestore, getFirestore, onSnapshot, setDoc, Timestamp } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { FIREBASE_CONFIG } from '../../environment/firebaseConfig';
import { AppUser } from '../../models/appUser';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  public database: Firestore;
  public $user: WritableSignal<AppUser | null> = signal(null);
  public user: AppUser | null = null;

  constructor() {
    const app = initializeApp(FIREBASE_CONFIG);
    this.database = getFirestore(app);

    getAuth().onAuthStateChanged(async user => {
      if (user) {
        await this.getSignalUser();
      } else {
        getAuth().signOut();
      }
    });

    effect(() => {
      this.user = this.$user();
    });
  }

  public async getSignalUser() {
    const authUser = getAuth().currentUser!;
    const docRef = doc(this.database, 'users', authUser.uid);
    const unsub = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const user: DocumentData = doc.data();
        this.$user.set({
          uid: doc.id,
          username: user['username'],
          email: user['email'],
          createdAt: user['createdAt']
        });
      }
    })
  }

  public async checkUser(uid: string): Promise<boolean> {
    const docRef = doc(this.database, 'users', uid);
    return new Promise((resolve, reject) => {
      onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, (error) => {
        reject(error);
      });
    });
  }

  public async registerNewUser(uid: string, username: string, email: string): Promise<void> {
    const docRef = doc(this.database, 'users', uid);
    await setDoc(docRef, {
      username: username,
      email: email,
      createdAt: Timestamp.now()
    }, { merge: true });
  }
}

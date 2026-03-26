import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();

export interface Lead {
  id?: string;
  email: string;
  createdAt: Timestamp;
}

export const saveLead = async (email: string) => {
  try {
    const leadsCollection = collection(db, 'leads');
    await addDoc(leadsCollection, {
      email,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error saving lead:', error);
    throw error;
  }
};

export const subscribeToLeads = (callback: (leads: Lead[]) => void) => {
  const leadsCollection = collection(db, 'leads');
  const q = query(leadsCollection, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const leads: Lead[] = [];
    snapshot.forEach((doc) => {
      leads.push({ id: doc.id, ...doc.data() } as Lead);
    });
    callback(leads);
  }, (error) => {
    console.error('Error subscribing to leads:', error);
  });
};

export const signIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    const firebaseError = error as { code?: string };
    // Fallback to redirect auth so login still works when popup is blocked.
    if (
      firebaseError?.code === 'auth/popup-blocked' ||
      firebaseError?.code === 'auth/cancelled-popup-request' ||
      firebaseError?.code === 'auth/operation-not-supported-in-this-environment'
    ) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export { onAuthStateChanged };
export type { User };

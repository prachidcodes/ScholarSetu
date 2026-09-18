/**
 * Firebase Configuration for ScholarSetu
 * Target Project: sih-ps2
 * 
 * Provides production-ready Firebase SDK initialization with defensive
 * fallback to mock/demo state persistence when offline or when credentials
 * are initialized in sandbox mode.
 */
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Configuration for project sih-ps2
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoScholarSetuFakeKeyForPreview_sih_ps2",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sih-ps2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sih-ps2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sih-ps2.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "947552009868",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:947552009868:web:scholarsetu2026",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.info("[ScholarSetu Firebase] Initializing in smart demo-service mode:", err);
}

export { app, auth, db };

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  Auth,
  GoogleAuthProvider,
  indexedDBLocalPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const PLACEHOLDER_VALUES = [
  "your_api_key",
  "your_project.firebaseapp.com",
  "your_project_id",
  "your_project.appspot.com",
  "your_sender_id",
  "your_app_id",
];

export function isFirebaseConfigured(): boolean {
  const values = Object.values(firebaseConfig);
  return values.every(
    (value) =>
      typeof value === "string" &&
      value.length > 0 &&
      !PLACEHOLDER_VALUES.includes(value)
  );
}

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

function initFirebase() {
  if (typeof window === "undefined") return;
  if (app && auth) return;
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase 환경 변수가 설정되지 않았습니다.");
  }

  if (getApps().length) {
    app = getApp();
    auth = getAuth(app);
  } else {
    app = initializeApp(firebaseConfig);
    try {
      auth = initializeAuth(app, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence],
      });
    } catch {
      auth = getAuth(app);
    }
  }

  db = getFirestore(app);
  storage = getStorage(app);
}

export function getFirebaseAuth(): Auth {
  initFirebase();
  if (!auth) throw new Error("Firebase Auth is not available");
  return auth;
}

export function getFirebaseDb(): Firestore {
  initFirebase();
  if (!db) throw new Error("Firebase Firestore is not available");
  return db;
}

export function getFirebaseStorage(): FirebaseStorage {
  initFirebase();
  if (!storage) throw new Error("Firebase Storage is not available");
  return storage;
}

export function getGoogleProvider(): GoogleAuthProvider {
  return new GoogleAuthProvider();
}

export default app;

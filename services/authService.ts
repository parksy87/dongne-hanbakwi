import {
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { getFirebaseAuth, googleProvider } from "@/lib/firebase";
import { isNativeApp } from "@/lib/native";

export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  const auth = getFirebaseAuth();

  if (isNativeApp()) {
    await signInWithRedirect(auth, googleProvider);
    return null;
  }

  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function completeGoogleRedirectSignIn(): Promise<FirebaseUser | null> {
  if (!isNativeApp()) return null;

  const result = await getRedirectResult(getFirebaseAuth());
  return result?.user ?? null;
}

export async function signOut() {
  await firebaseSignOut(getFirebaseAuth());
}

export function subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

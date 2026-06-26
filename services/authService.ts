import {
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { getFirebaseAuth, getGoogleProvider } from "@/lib/firebase";
import { isNativeApp } from "@/lib/native";
import { resetNativeNavigationStack } from "@/lib/nativeHistory";

export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  const auth = getFirebaseAuth();
  const provider = getGoogleProvider();

  if (isNativeApp()) {
    await signInWithRedirect(auth, provider);
    return null;
  }

  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function completeGoogleRedirectSignIn(): Promise<FirebaseUser | null> {
  if (!isNativeApp()) return null;

  const result = await getRedirectResult(getFirebaseAuth());
  if (result?.user) {
    resetNativeNavigationStack("/");
  }
  return result?.user ?? null;
}

export async function signOut() {
  await firebaseSignOut(getFirebaseAuth());
}

export function subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

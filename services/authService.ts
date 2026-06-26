import {
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { getFirebaseAuth, getGoogleProvider } from "@/lib/firebase";
import { isNativeApp } from "@/lib/native";
import { resetNativeNavigationStack } from "@/lib/nativeHistory";

async function signInWithGoogleNative(): Promise<FirebaseUser> {
  const result = await FirebaseAuthentication.signInWithGoogle();
  const idToken = result.credential?.idToken;

  if (!idToken) {
    throw new Error("Google idToken을 받지 못했습니다.");
  }

  const auth = getFirebaseAuth();
  const credential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(auth, credential);

  resetNativeNavigationStack("/");
  return userCredential.user;
}

export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  if (isNativeApp()) {
    return signInWithGoogleNative();
  }

  const auth = getFirebaseAuth();
  const provider = getGoogleProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOut() {
  if (isNativeApp()) {
    try {
      await FirebaseAuthentication.signOut();
    } catch (error) {
      console.warn("Native sign out failed:", error);
    }
  }
  await firebaseSignOut(getFirebaseAuth());
}

export function subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

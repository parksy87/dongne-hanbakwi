import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";

async function deleteCollectionWhere(
  collectionName: string,
  field: string,
  value: string
) {
  const snap = await getDocs(
    query(collection(getFirebaseDb(), collectionName), where(field, "==", value))
  );
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}

export async function deleteUserAccount(uid: string): Promise<void> {
  await Promise.all([
    deleteCollectionWhere("workouts", "userId", uid),
    deleteCollectionWhere("attendance", "userId", uid),
    deleteCollectionWhere("badges", "userId", uid),
    deleteCollectionWhere("inquiries", "userId", uid),
  ]);
  await deleteDoc(doc(getFirebaseDb(), "users", uid));

  const auth = getFirebaseAuth();
  if (auth.currentUser?.uid === uid) {
    await deleteUser(auth.currentUser);
  }
}

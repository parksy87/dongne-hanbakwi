import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { Announcement } from "@/types";

export async function getActiveAnnouncements(): Promise<Announcement[]> {
  const q = query(
    collection(getFirebaseDb(), "announcements"),
    where("isActive", "==", true),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as Announcement
  );
  return items.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0);
  });
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  const snapshot = await getDocs(
    query(collection(getFirebaseDb(), "announcements"), orderBy("createdAt", "desc"))
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Announcement);
}

export async function createAnnouncement(data: {
  title: string;
  content: string;
  isPinned: boolean;
  isActive: boolean;
  createdBy: string;
}): Promise<string> {
  const ref = await addDoc(collection(getFirebaseDb(), "announcements"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateAnnouncement(
  id: string,
  data: Partial<Pick<Announcement, "title" | "content" | "isPinned" | "isActive">>
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), "announcements", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), "announcements", id));
}

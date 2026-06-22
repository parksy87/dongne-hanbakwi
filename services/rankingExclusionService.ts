import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { RankingExclusion } from "@/types";

export async function getRankingExclusions(): Promise<RankingExclusion[]> {
  const snapshot = await getDocs(collection(getFirebaseDb(), "ranking_exclusions"));
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as RankingExclusion
  );
}

export async function addRankingExclusion(data: {
  userId: string;
  nickname: string;
  reason: string;
  excludedBy: string;
}): Promise<void> {
  const existing = await getRankingExclusions();
  if (existing.some((e) => e.userId === data.userId)) return;

  await addDoc(collection(getFirebaseDb(), "ranking_exclusions"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function removeRankingExclusion(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), "ranking_exclusions", id));
}

export async function getExcludedUserIds(): Promise<Set<string>> {
  const exclusions = await getRankingExclusions();
  return new Set(exclusions.map((e) => e.userId));
}

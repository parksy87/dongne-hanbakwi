import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { Group } from "@/types";

/**
 * 그룹 랭킹(scope: group) 확장용.
 * groups/{groupId}/members/{userId} 구조 — 생성·가입 UI는 추후.
 */
export async function getGroup(groupId: string): Promise<Group | null> {
  const groupDoc = await getDoc(doc(getFirebaseDb(), "groups", groupId));
  if (!groupDoc.exists()) return null;
  return { id: groupDoc.id, ...groupDoc.data() } as Group;
}

export async function getGroupMemberIds(groupId: string): Promise<string[]> {
  const snapshot = await getDocs(
    collection(getFirebaseDb(), "groups", groupId, "members")
  );
  return snapshot.docs.map((d) => d.id);
}

export async function isGroupMember(groupId: string, userId: string): Promise<boolean> {
  const memberDoc = await getDoc(
    doc(getFirebaseDb(), "groups", groupId, "members", userId)
  );
  return memberDoc.exists();
}

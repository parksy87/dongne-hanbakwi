import { collection, getDocs } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { UserRegion } from "@/types";

export function regionsMatch(a: UserRegion, b: UserRegion): boolean {
  if (a.sido !== b.sido || a.sigungu !== b.sigungu) return false;
  if (a.gu || b.gu) return a.gu === b.gu;
  return true;
}

/** 지역 랭킹(scope: region) 필터용 — 소규모 운영 기준 */
export async function getUserIdsByRegion(region: UserRegion): Promise<Set<string>> {
  const snapshot = await getDocs(collection(getFirebaseDb(), "users"));
  const ids = new Set<string>();

  snapshot.docs.forEach((d) => {
    const data = d.data();
    if (data.region && regionsMatch(data.region as UserRegion, region)) {
      ids.add(d.id);
    }
  });

  return ids;
}

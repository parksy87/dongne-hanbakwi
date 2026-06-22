import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { Inquiry } from "@/types";

export async function createInquiry(data: {
  userId: string;
  nickname: string;
  email: string;
  title: string;
  content: string;
}): Promise<string> {
  const docRef = await addDoc(collection(getFirebaseDb(), "inquiries"), {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getInquiry(id: string): Promise<Inquiry | null> {
  const inquiryDoc = await getDoc(doc(getFirebaseDb(), "inquiries", id));
  if (!inquiryDoc.exists()) return null;
  return { id: inquiryDoc.id, ...inquiryDoc.data() } as Inquiry;
}

export async function getUserInquiries(userId: string): Promise<Inquiry[]> {
  const q = query(
    collection(getFirebaseDb(), "inquiries"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Inquiry);
}

export async function deleteInquiry(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), "inquiries", id));
}

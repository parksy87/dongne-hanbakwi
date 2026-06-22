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
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  const inquiries = snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as Inquiry
  );

  return inquiries.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.toMillis?.() ?? 0;
    return bTime - aTime;
  });
}

export async function deleteInquiry(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), "inquiries", id));
}

export async function getAllInquiries(): Promise<Inquiry[]> {
  const snapshot = await getDocs(
    query(collection(getFirebaseDb(), "inquiries"), orderBy("createdAt", "desc"))
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Inquiry);
}

export async function getPendingInquiries(): Promise<Inquiry[]> {
  const q = query(
    collection(getFirebaseDb(), "inquiries"),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Inquiry);
}

export async function answerInquiry(
  id: string,
  answer: string
): Promise<void> {
  const { updateDoc, serverTimestamp: ts } = await import("firebase/firestore");
  await updateDoc(doc(getFirebaseDb(), "inquiries", id), {
    status: "answered",
    answer,
    answeredAt: ts(),
  });
}

import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const uid = "3izITLXPL5QlFTJSVgVplOfmvZz1";
const email = "psyr7805@gmail.com";

initializeApp({
  credential: applicationDefault(),
  projectId: "dongne-hanbakwi",
});

const db = getFirestore();

await db.doc(`admins/${uid}`).set({
  email,
  role: "admin",
  createdAt: Timestamp.now(),
});

console.log(`Admin registered: ${email} (${uid})`);

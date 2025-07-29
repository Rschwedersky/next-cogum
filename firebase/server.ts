import { initializeApp, cert, getApps } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { Firestore, getFirestore } from "firebase-admin/firestore";

let auth: Auth, firestore: Firestore;

if (!getApps().length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;
  const credentials = {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: privateKey,
  };

  const app = initializeApp({
    credential: cert(credentials),
  });
  auth = getAuth(app);
  firestore = getFirestore(app);
} else {
  auth = getAuth();
  firestore = getFirestore();
}

export { auth, firestore };


import {  initializeApp ,ServiceAccount, cert, getApps } from "firebase-admin/app";
import serviceAccount from "./serviceAccount.json"
import { Firestore, getFirestore } from "firebase-admin/firestore";

let firestore:Firestore|undefined = undefined;

const currentApps = getApps();
if(currentApps.length <= 0) {
    const app = initializeApp({
        credential: cert(serviceAccount as ServiceAccount)
    });
    firestore = getFirestore(app);
} 
else {
    firestore = getFirestore(currentApps[0]);
}

export {firestore};
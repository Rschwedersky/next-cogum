
import { getApps, initializeApp } from "firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

// Get firebase config from firebase project settings
const firebaseConfig = {
    apiKey: "AIzaSyD4FYqwJvdzD8z-fUn7O4hU5Dhn6y17adM",
    authDomain: "cogum-react.firebaseapp.com",
    projectId: "cogum-react",
    storageBucket: "cogum-react.appspot.com",
    messagingSenderId: "523382008243",
    appId: "1:523382008243:web:f82e83270c00eaf62203c6",
    measurementId: "G-N2Q8RSCSE2"
  };

const currentApps = getApps();

let auth: Auth | undefined = undefined;
let db: Firestore | undefined = undefined;

if (currentApps.length <= 0) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    if (
        process.env.NEXT_PUBLIC_APP_ENV === "emulator" &&
        process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH
    ) {
        connectAuthEmulator(
            auth,
            `http://${process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH}`
        );
    }
} else {
    auth = getAuth(currentApps[0]);
    db = getFirestore(currentApps[0]);
    if (
        process.env.NEXT_PUBLIC_APP_ENV === "emulator" &&
        process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH
    ) {
        connectAuthEmulator(
            auth,
            `http://${process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH}`
        );
    }
}

export { auth, db};

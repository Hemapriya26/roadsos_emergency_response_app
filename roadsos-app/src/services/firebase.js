import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDNFf6M56k1wAY_g54ZU936kQMvcaQFevU",
  authDomain: "roadsos-fc103.firebaseapp.com",
  projectId: "roadsos-fc103",
  storageBucket: "roadsos-fc103.firebasestorage.app",
  messagingSenderId: "599043892013",
  appId: "1:599043892013:web:e65c7e7bd82f9c299029a4",
  measurementId: "G-2L5RZRSQSF"
};
let app, db, auth;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.warn("Firebase initialization failed. Continuing in offline mode.", error);
}
export { db, auth };

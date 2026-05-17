import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

console.log("[Startup] Checking Firebase Environment Variables in Production:");
console.log("VITE_FIREBASE_API_KEY:", import.meta.env.VITE_FIREBASE_API_KEY ? "DEFINED" : "UNDEFINED");
console.log("VITE_FIREBASE_AUTH_DOMAIN:", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? "DEFINED" : "UNDEFINED");
console.log("VITE_FIREBASE_PROJECT_ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID ? "DEFINED" : "UNDEFINED");
console.log("VITE_FIREBASE_STORAGE_BUCKET:", import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? "DEFINED" : "UNDEFINED");
console.log("VITE_FIREBASE_MESSAGING_SENDER_ID:", import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? "DEFINED" : "UNDEFINED");
console.log("VITE_FIREBASE_APP_ID:", import.meta.env.VITE_FIREBASE_APP_ID ? "DEFINED" : "UNDEFINED");
console.log("VITE_FIREBASE_MEASUREMENT_ID:", import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ? "DEFINED" : "UNDEFINED");

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDNFf6M56k1wAY_g54ZU936kQMvcaQFevU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "roadsos-fc103.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "roadsos-fc103",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "roadsos-fc103.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "599043892013",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:599043892013:web:e65c7e7bd82f9c299029a4",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-2L5RZRSQSF"
};

let app = null;
let db = null;
let auth = null;

try {
  console.log("[Startup] Initializing Firebase with config keys...");
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log("[Startup] Firebase initialized successfully.");
} catch (error) {
  console.error("[Startup] Firebase initialization critical failure:", error);
  console.warn("[Startup] App continuing in standalone/offline mock fallback mode.");
}

export { db, auth };

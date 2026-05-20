import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

console.log("[Startup] Checking Firebase Environment Variables:");

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
  console.warn(
    `[Firebase Configuration Warning]: The following required environment variables are missing:\n` +
    `  ${missingVars.join('\n  ')}\n` +
    `ROADSoS is starting in Standalone / OFFLINE mode with local fallbacks.`
  );
} else {
  console.log("[Startup] All required Firebase environment variables are defined.");
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app = null;
let db = null;
let auth = null;

const canInitialize = missingVars.length === 0;

if (canInitialize) {
  try {
    console.log("[Startup] Initializing Firebase with Vite environment variables...");
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("[Startup] Firebase initialized successfully.");
  } catch (error) {
    console.error("[Startup] Firebase initialization critical failure:", error);
    console.warn("[Startup] App continuing in standalone/offline mock fallback mode.");
  }
} else {
  console.log("[Startup] Firebase initialization skipped due to missing credentials.");
}

export { db, auth };

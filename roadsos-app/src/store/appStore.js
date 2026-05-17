import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { signInAnonymously } from 'firebase/auth';

console.log("[Startup] Zustand initialized.");

// Helper to wrap a promise in a timeout
const withTimeout = (promise, ms) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout after ${ms}ms`));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
};

const useAppStore = create(
  persist(
    (set, get) => ({
      // Location State
      location: { lat: null, lng: null, timestamp: null, error: null },
      setLocation: (lat, lng) => set({ location: { lat, lng, timestamp: Date.now(), error: null } }),
      setLocationError: (error) => set((state) => ({ location: { ...state.location, error } })),

      // Nearby Services Cache
      nearbyServices: [],
      setNearbyServices: (services) => set({ nearbyServices: services, lastServicesFetch: Date.now() }),
      updateServicePhone: (id, phone) => set((state) => ({
        nearbyServices: state.nearbyServices.map(s => s.id === id ? { ...s, phone } : s)
      })),
      lastServicesFetch: null,

      // Contacts State
      contacts: [
        { id: '1', name: 'Mom', phone: '+91 7845213853', initial: 'M', color: 'bg-primary-container/20 text-primary' }
      ],
      
      // SOS Message Template
      sosTemplate: 'EMERGENCY: I need urgent roadside assistance. My live location is attached below.',
      setSosTemplate: (msg) => set({ sosTemplate: msg }),
      
      // PWA Install State
      deferredPrompt: null,
      setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
      clearDeferredPrompt: () => set({ deferredPrompt: null }),
      
      // Load contacts from Firestore if available
      syncContactsFromFirebase: async () => {
        console.log("[Startup] syncContactsFromFirebase started");
        try {
          if (!auth || !db) {
            console.log("[Startup] Firebase auth or db not available, using offline/local mode.");
            return;
          }
          
          if (!auth.currentUser) {
            console.log("[Startup] Resolving auth state anonymously...");
            // Use 5 second timeout to prevent infinite hanging
            await withTimeout(signInAnonymously(auth), 5000);
            console.log("[Startup] Auth state resolved anonymously.");
          } else {
            console.log("[Startup] Auth already resolved, user is anonymous:", auth.currentUser.uid);
          }
          
          const uid = auth.currentUser.uid;
          const contactsRef = collection(db, `users/${uid}/contacts`);
          const snapshot = await getDocs(contactsRef);
          
          if (!snapshot.empty) {
            const firebaseContacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            set({ contacts: firebaseContacts });
          }
        } catch (error) {
          console.warn("Failed to sync from Firebase. Using local contacts.", error);
        }
      },

      addContact: async (contact) => {
        // Update local state first for immediate UI feedback
        const newContact = { ...contact, id: contact.id || Date.now().toString() };
        set((state) => ({ contacts: [...state.contacts, newContact] }));
        
        // Attempt to sync to Firestore
        try {
          if (auth?.currentUser && db) {
            const uid = auth.currentUser.uid;
            await setDoc(doc(db, `users/${uid}/contacts`, newContact.id), newContact);
          }
        } catch (error) {
          console.warn("Failed to save contact to Firebase. Saved locally.", error);
        }
      },

      removeContact: async (id) => {
        // Update local state first
        set((state) => ({ contacts: state.contacts.filter(c => c.id !== id) }));
        
        // Attempt to remove from Firestore
        try {
          if (auth?.currentUser && db) {
            const uid = auth.currentUser.uid;
            await deleteDoc(doc(db, `users/${uid}/contacts`, id));
          }
        } catch (error) {
          console.warn("Failed to remove contact from Firebase. Removed locally.", error);
        }
      },

      // Settings
      settings: {
        gpsTracking: true,
        offlineMode: false,
        smsFallback: true,
        isLoggedIn: false
      },
      updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } }))
    }),
    {
      name: 'roadsos-storage-v2', // name of item in localStorage
      partialize: (state) => ({ contacts: state.contacts, settings: state.settings, sosTemplate: state.sosTemplate }), // only persist contacts, settings, and sosTemplate
    }
  )
);

export default useAppStore;

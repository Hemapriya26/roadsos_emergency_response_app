import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useAppStore from './store/appStore';
import Home from './pages/Home';
import SOSActivation from './pages/SOSActivation';
import EmergencyContacts from './pages/EmergencyContacts';
import NearbyServices from './pages/NearbyServices';
import Settings from './pages/Settings';
import AccidentDetection from './pages/AccidentDetection';
import 'leaflet/dist/leaflet.css';

function App() {
  console.log("[Startup] App rendering...");
  const { setLocation, setLocationError, settings } = useAppStore();

  useEffect(() => {
    console.log("[Startup] App component mounted.");
    
    let watchId;
    if (settings.gpsTracking) {
      if (navigator.geolocation) {
        console.log("[Startup] GPS initialization started.");
        try {
          watchId = navigator.geolocation.watchPosition(
            (position) => {
              console.log(`[Startup] GPS coordinates received: ${position.coords.latitude}, ${position.coords.longitude}`);
              setLocation(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
              console.warn("[Startup] GPS acquisition failed or was denied:", error.message);
              setLocationError(error.message);
            },
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
          );
          console.log("[Startup] GPS watchPosition successfully registered. watchId:", watchId);
        } catch (e) {
          console.error("[Startup] GPS watchPosition failed during registration:", e);
          setLocationError(e.message);
        }
      } else {
        console.warn("[Startup] Geolocation API is not supported by this browser.");
        setLocationError("Geolocation not supported");
      }
    } else {
      console.log("[Startup] GPS tracking is disabled in app settings.");
    }

    // Sync from Firebase
    console.log("[Startup] Triggering Firebase contacts synchronization...");
    const { syncContactsFromFirebase } = useAppStore.getState();
    syncContactsFromFirebase();

    return () => {
      if (watchId) {
        console.log("[Startup] Clearing GPS watchId:", watchId);
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [settings.gpsTracking, setLocation, setLocationError]);

  console.log("[Startup] Router initializing routes.");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sos" element={<SOSActivation />} />
        <Route path="/contacts" element={<EmergencyContacts />} />
        <Route path="/nearby" element={<NearbyServices />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/accident-alert" element={<AccidentDetection />} />
      </Routes>
    </Router>
  );
}

export default App;

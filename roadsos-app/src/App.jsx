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
  const { setLocation, setLocationError, settings } = useAppStore();

  useEffect(() => {
    let watchId;
    if (settings.gpsTracking && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Location error:", error.message);
          setLocationError(error.message);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }

    // Sync from Firebase
    const { syncContactsFromFirebase } = useAppStore.getState();
    syncContactsFromFirebase();

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [settings.gpsTracking, setLocation, setLocationError]);

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

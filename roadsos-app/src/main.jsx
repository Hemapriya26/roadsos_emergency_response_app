import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import useAppStore from './store/appStore.js';
import ErrorBoundary from './components/ErrorBoundary.jsx';

console.log("[Startup] App startup reached.");

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[Service Worker] Registered successfully with scope:', registration.scope);
        
        // Force update check on load to clear stale routes
        registration.update();
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[Service Worker] New version available! Reloading...');
              // Optional: You could show a UI prompt here instead of forcing reload
            }
          });
        });
      })
      .catch((error) => {
        console.error('[Service Worker] Registration failed:', error);
      });
  });
}

// Capture PWA Installation prompt event safely
window.addEventListener('beforeinstallprompt', (e) => {
  try {
    e.preventDefault();
    console.log('[PWA] Captured beforeinstallprompt event.');
    const store = useAppStore.getState();
    if (store && typeof store.setDeferredPrompt === 'function') {
      store.setDeferredPrompt(e);
    } else {
      console.warn('[PWA] setDeferredPrompt is not defined on the store.');
    }
  } catch (error) {
    console.error('[PWA] Error in beforeinstallprompt listener:', error);
  }
});

console.log("[Startup] Rendering root component wrapped in ErrorBoundary (StrictMode removed).");
ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);

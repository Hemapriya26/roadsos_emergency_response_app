import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import useAppStore from './store/appStore.js';
import ErrorBoundary from './components/ErrorBoundary.jsx';

console.log("[Startup] App startup reached.");

// Register Service Worker (Temporarily isolated/disabled for production debugging)
console.log("[Startup] Service worker registration is temporarily disabled for isolation.");
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[Service Worker] Registered successfully with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('[Service Worker] Registration failed:', error);
      });
  });
}
*/

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

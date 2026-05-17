import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';

const TopBar = ({ hideHome = false, hideUser = false }) => {
  const navigate = useNavigate();
  const { deferredPrompt, clearDeferredPrompt } = useAppStore();

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Install choice outcome: ${outcome}`);
    clearDeferredPrompt();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile h-[64px] bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl shadow-sm dark:shadow-none transition-colors duration-200 ease-in-out">
      <div className="flex items-center gap-3">
        {!hideUser && (
          <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary">person</span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-headline-lg-mobile text-headline-lg-mobile font-black tracking-tighter text-primary dark:text-primary-fixed-dim">ROADSoS</span>
          {!hideUser && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-md text-label-md text-on-surface-variant">GPS Active</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {deferredPrompt && (
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary-fixed-dim rounded-full transition-all text-label-md font-label-md animate-bounce"
            style={{ animationDuration: '3s' }}
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Install App
          </button>
        )}
        {!hideHome && (
          <button 
            onClick={() => navigate('/')}
            aria-label="Emergency Home" 
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-surface-container-high/50 dark:hover:bg-surface-container-highest/50 transition-colors duration-200 ease-in-out text-primary dark:text-primary-fixed-dim"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>emergency_home</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default TopBar;

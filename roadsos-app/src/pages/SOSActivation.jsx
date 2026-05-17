import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import useAppStore from '../store/appStore';

const SOSActivation = () => {
  const navigate = useNavigate();
  const [state, setState] = useState('activation'); // 'activation', 'sending', 'active'
  const [countdown, setCountdown] = useState(10);
  const { location, contacts, settings, sosTemplate } = useAppStore();

  useEffect(() => {
    let timer;
    if (state === 'activation' && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (state === 'activation' && countdown === 0) {
      triggerSOS();
    }
    return () => clearTimeout(timer);
  }, [state, countdown]);

  const triggerSOS = () => {
    setState('sending');
    
    // Simulate slight delay for UX
    setTimeout(() => {
      setState('active');
      
      // Native SMS Intent Logic
      if (contacts.length > 0) {
        console.log("Emergency contacts at trigger time:", contacts);
        // Collect all phone numbers, joined by comma for Android, semi-colon for iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const separator = isIOS ? ';' : ',';
        const phoneNumbers = contacts.map(c => c.phone.replace(/[^0-9+]/g, '')).join(separator);
        
        let message = sosTemplate || "EMERGENCY: I need urgent roadside assistance. My live location is attached below.";
        if (location.lat && location.lng) {
          message += `\nLive Location: https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
        } else {
          message += `\nUnable to fetch exact GPS location at this moment.`;
        }
        
        const encodedMessage = encodeURIComponent(message);
        
        // This will attempt to open the native messaging app
        window.location.href = `sms:${phoneNumbers}?body=${encodedMessage}`;
      }
    }, 1500);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <TopBar hideHome hideUser />

      <main className="w-full max-w-md mx-auto px-margin-mobile flex-grow flex flex-col items-center justify-center relative z-10 py-12">
        {state === 'activation' && (
          <div className="w-full flex flex-col items-center justify-center space-y-12">
            <div className="text-center space-y-baseline">
              <h1 className="font-headline-xl text-headline-xl text-error flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[40px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                EMERGENCY
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Are you in an emergency?</p>
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center my-8">
              <div className="absolute inset-0 rounded-full border-4 border-error/40 pulse-ring-1"></div>
              <div className="absolute inset-0 rounded-full border-4 border-error/30 pulse-ring-2"></div>
              <div className="absolute inset-0 rounded-full border-4 border-error/20 pulse-ring-3"></div>
              
              <div className="w-48 h-48 bg-error rounded-full flex flex-col items-center justify-center shadow-[0_8px_24px_rgba(186,26,26,0.3)] z-10 relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4"></circle>
                  <circle 
                    className="transition-all duration-1000" 
                    cx="50" cy="50" r="48" fill="none" 
                    stroke="#ffffff" strokeWidth="4"
                    strokeDasharray="301.59" 
                    strokeDashoffset={301.59 - (countdown / 10) * 301.59}
                  ></circle>
                </svg>
                <span className="font-headline-xl text-[64px] leading-none text-on-error font-black tracking-tighter">{countdown}</span>
                <span className="font-label-md text-label-md text-error-container uppercase tracking-wider mt-1">Seconds</span>
              </div>
            </div>

            <div className="w-full text-center space-y-baseline">
              <p className="font-body-md text-body-md text-tertiary">Alerting services and emergency contacts automatically...</p>
              <button 
                onClick={handleCancel}
                className="w-full h-touch-target-min bg-surface-container-highest text-on-surface font-label-xl text-label-xl rounded-full border border-outline/20 shadow-sm mt-8 active:scale-95 transition-transform"
              >
                Cancel Alert
              </button>
            </div>
          </div>
        )}

        {state === 'sending' && (
          <div className="w-full flex flex-col items-center justify-center space-y-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="progress-spinner w-24 h-24 text-primary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="absolute material-symbols-outlined text-[40px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>cell_tower</span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Dispatching Alert via SMS...</h2>
          </div>
        )}

        {state === 'active' && (
          <div className="w-full flex flex-col space-y-6">
            <div className="flex items-center gap-4 bg-error-container text-on-error-container p-4 rounded-xl border border-error/20">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <div>
                <h3 className="font-label-xl text-label-xl">SMS App Opened</h3>
                <p className="font-body-md text-body-md opacity-90">Please confirm sending the message in your SMS app.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full mt-4">
              <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline/20 shadow-sm flex items-center gap-4 relative overflow-hidden">
                <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">my_location</span>
                </div>
                <div className="flex-grow z-10">
                  <h4 className="font-label-xl text-label-xl text-on-surface">{location.lat ? 'Live Location Active' : 'Waiting for GPS...'}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {location.lat ? 'Sharing precise GPS data.' : 'Ensure Location Services are ON.'}
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline/20 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container-highest text-on-surface rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-label-xl text-label-xl text-on-surface">Contacts Queued</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">{contacts.length} emergency contacts pre-filled.</p>
                </div>
                <span className="material-symbols-outlined text-primary">check</span>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <button 
                onClick={handleCancel}
                className="w-full h-touch-target-min bg-surface-container-lowest text-error font-label-xl text-label-xl rounded-full border border-error/30 shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">close</span>
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SOSActivation;

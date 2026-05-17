import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AccidentDetection = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(29);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto trigger SOS when countdown reaches 0
      navigate('/sos');
    }
  }, [countdown, navigate]);

  return (
    <div className="bg-surface-bright text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container relative">
      <main className="flex-grow flex flex-col justify-center items-center px-margin-mobile pt-[64px] pb-safe-bottom-zone relative z-10">
        
        {/* Urgent Visual Indicator */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-hidden pointer-events-none">
          <div className="w-[300px] h-[300px] rounded-full bg-error-container/40 absolute animate-pulse"></div>
          <div className="w-[450px] h-[450px] rounded-full bg-error-container/20 absolute animate-pulse delay-75"></div>
          <div className="w-[600px] h-[600px] rounded-full bg-error-container/10 absolute animate-pulse delay-150"></div>
        </div>

        {/* Alert Content Box */}
        <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-[0_8px_32px_rgba(186,26,26,0.15)] border border-error-container overflow-hidden flex flex-col items-center text-center">
          
          <div className="w-full bg-error py-8 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-on-error rounded-full flex items-center justify-center shadow-md mb-4">
              <span aria-hidden="true" className="material-symbols-outlined text-error text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-error px-4">Possible Accident Detected</h1>
          </div>

          <div className="p-8 w-full flex flex-col items-center">
            <p className="font-body-lg text-body-lg text-on-surface mb-6">Are you safe? We noticed a sudden impact or rapid deceleration.</p>
            
            <div className="mb-8 flex flex-col items-center">
              <span className="text-[64px] leading-[72px] font-[900] tracking-[-0.04em] text-error">{countdown}</span>
              <span className="font-label-xl text-label-xl text-error uppercase tracking-wider">Seconds</span>
            </div>

            <div className="w-full bg-surface-container-low rounded-xl p-4 mb-8 flex items-start gap-4 border border-surface-dim">
              <span aria-hidden="true" className="material-symbols-outlined text-tertiary mt-1">info</span>
              <p className="font-body-md text-body-md text-tertiary text-left">If you do not respond before the timer ends, an SOS signal will be automatically sent to emergency services with your location.</p>
            </div>

            <div className="w-full flex flex-col gap-4">
              <button 
                onClick={() => navigate('/')}
                className="w-full h-16 bg-surface-container-highest text-on-surface font-label-xl text-label-xl rounded-2xl border border-surface-dim shadow-sm flex items-center justify-center gap-2 hover:bg-surface-dim transition-colors active:scale-95"
              >
                <span aria-hidden="true" className="material-symbols-outlined">check_circle</span>
                I'm Safe, Cancel SOS
              </button>

              <button 
                onClick={() => navigate('/sos')}
                className="w-full h-16 bg-primary text-on-primary font-label-xl text-label-xl rounded-2xl shadow-[0_4px_12px_rgba(175,16,26,0.3)] flex items-center justify-center gap-2 hover:bg-surface-tint transition-colors active:scale-95"
              >
                <span aria-hidden="true" className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>emergency_home</span>
                Send SOS Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccidentDetection;

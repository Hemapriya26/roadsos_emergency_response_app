import React from 'react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import useAppStore from '../store/appStore';

const Settings = () => {
  const { settings, updateSettings } = useAppStore();

  const Toggle = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className={`w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer 
        ${checked ? "bg-primary after:translate-x-full after:border-white" : ""} 
        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}>
      </div>
    </label>
  );

  return (
    <div className="bg-background text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <TopBar hideUser />

      <main className="flex-grow pt-[80px] pb-safe-bottom-zone px-margin-mobile md:px-8 max-w-3xl mx-auto w-full flex flex-col gap-baseline">
        <div className="mb-6">
          <h1 className="font-headline-xl text-headline-xl text-on-background mb-2">Settings</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage your emergency preferences and application behavior.</p>
        </div>

        <section className="bg-surface-container-lowest rounded-xl p-1 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-surface-variant mb-6">
          <h2 className="font-label-xl text-label-xl text-on-background p-4 pb-2 border-b border-surface-variant">App Preferences</h2>
          <div className="divide-y divide-surface-variant">
            <div className="flex items-center justify-between p-4 min-h-[56px]">
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant">my_location</span>
                <div>
                  <div className="font-label-xl text-label-xl text-on-background">Live GPS Tracking</div>
                  <div className="font-body-md text-body-md text-on-surface-variant">Allow background location updates</div>
                </div>
              </div>
              <Toggle checked={settings.gpsTracking} onChange={() => updateSettings({ gpsTracking: !settings.gpsTracking })} />
            </div>

            <div className="flex items-center justify-between p-4 min-h-[56px]">
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant">wifi_off</span>
                <div>
                  <div className="font-label-xl text-label-xl text-on-background">Force Offline Mode</div>
                  <div className="font-body-md text-body-md text-on-surface-variant">Disable network requests to save battery</div>
                </div>
              </div>
              <Toggle checked={settings.offlineMode} onChange={() => updateSettings({ offlineMode: !settings.offlineMode })} />
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-xl p-1 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-surface-variant mb-6">
          <h2 className="font-label-xl text-label-xl text-on-background p-4 pb-2 border-b border-surface-variant">Emergency Features</h2>
          <div className="divide-y divide-surface-variant">
            <div className="flex items-center justify-between p-4 min-h-[56px]">
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant">sms_failed</span>
                <div>
                  <div className="font-label-xl text-label-xl text-on-background">SMS Fallback</div>
                  <div className="font-body-md text-body-md text-on-surface-variant">Send native SMS if cloud dispatch fails</div>
                </div>
              </div>
              <Toggle checked={settings.smsFallback} onChange={() => updateSettings({ smsFallback: !settings.smsFallback })} />
            </div>
          </div>
        </section>

        {/* Placeholder for Firebase Auth later */}
        <button className="w-full h-touch-target-min bg-surface-container-lowest border border-primary text-primary rounded-lg font-label-xl text-label-xl flex items-center justify-center gap-2 hover:bg-primary-container/30 transition-colors active:scale-[0.98] mt-auto mb-2">
          <span aria-hidden="true" className="material-symbols-outlined">login</span>
          Sign in to Firebase
        </button>

      </main>

      <BottomNav />
    </div>
  );
};

export default Settings;

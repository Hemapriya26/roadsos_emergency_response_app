import React from 'react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import useAppStore from '../store/appStore';

const Settings = () => {
  const { settings, updateSettings } = useAppStore();

  const Toggle = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className={`w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer 
        ${checked ? "bg-primary after:translate-x-full after:border-white" : ""} 
        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}>
      </div>
    </label>
  );

  return (
    <div className="bg-background text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container min-h-[100dvh] flex flex-col pb-[env(safe-area-inset-bottom)]">
      <TopBar hideUser />

      <main className="flex-grow pt-[72px] pb-[96px] px-4 md:px-8 max-w-3xl mx-auto w-full flex flex-col gap-4 overflow-y-auto">
        <div className="mb-2">
          <h1 className="font-headline-xl text-headline-xl text-on-background mb-1">Settings</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage your emergency preferences.</p>
        </div>

        <section className="bg-surface-container-lowest rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-surface-variant">
          <h2 className="font-label-lg text-label-lg text-on-background px-4 py-3 border-b border-surface-variant bg-surface-container-low rounded-t-xl">App Preferences</h2>
          <div className="divide-y divide-surface-variant">
            <div className="flex items-center justify-between p-3 min-h-[56px] gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span aria-hidden="true" className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-full flex-shrink-0">my_location</span>
                <div className="min-w-0">
                  <div className="font-label-md text-label-md text-on-background truncate">Live GPS Tracking</div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant leading-tight mt-0.5">Allow background location updates</div>
                </div>
              </div>
              <Toggle checked={settings.gpsTracking} onChange={() => updateSettings({ gpsTracking: !settings.gpsTracking })} />
            </div>

            <div className="flex items-center justify-between p-3 min-h-[56px] gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span aria-hidden="true" className="material-symbols-outlined text-secondary bg-surface-container-high p-2 rounded-full flex-shrink-0">wifi_off</span>
                <div className="min-w-0">
                  <div className="font-label-md text-label-md text-on-background truncate">Force Offline Mode</div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant leading-tight mt-0.5">Disable network to save battery</div>
                </div>
              </div>
              <Toggle checked={settings.offlineMode} onChange={() => updateSettings({ offlineMode: !settings.offlineMode })} />
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-surface-variant">
          <h2 className="font-label-lg text-label-lg text-on-background px-4 py-3 border-b border-surface-variant bg-surface-container-low rounded-t-xl">Emergency Features</h2>
          <div className="divide-y divide-surface-variant">
            <div className="flex items-center justify-between p-3 min-h-[56px] gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span aria-hidden="true" className="material-symbols-outlined text-error bg-error/10 p-2 rounded-full flex-shrink-0">sms_failed</span>
                <div className="min-w-0">
                  <div className="font-label-md text-label-md text-on-background truncate">SMS Fallback</div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant leading-tight mt-0.5">Send native SMS if dispatch fails</div>
                </div>
              </div>
              <Toggle checked={settings.smsFallback} onChange={() => updateSettings({ smsFallback: !settings.smsFallback })} />
            </div>
          </div>
        </section>

        {/* Placeholder for Firebase Auth later */}
        <div className="mt-4 pb-4">
            <button className="w-full min-h-[48px] bg-surface-container-lowest border border-primary text-primary rounded-xl font-label-md flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors active:scale-[0.98]">
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">login</span>
            Sign in to Firebase
            </button>
        </div>

      </main>

      <BottomNav />
    </div>
  );
};

export default Settings;

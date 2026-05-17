import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import useAppStore from '../store/appStore';

const NearbyServices = () => {
  const routeLocation = useLocation();
  const initialFilter = routeLocation.state?.defaultFilter || 'All';
  const [filter, setFilter] = useState(initialFilter);
  const { nearbyServices, updateServicePhone } = useAppStore();

  useEffect(() => {
    // For each service loaded that doesn't have a phone, scrape/resolve it in the background
    nearbyServices.forEach(async (service) => {
      if (!service.phone) {
        try {
          const res = await fetch(`/api/fetch-phone?name=${encodeURIComponent(service.name)}&website=${encodeURIComponent(service.website || '')}`);
          const data = await res.json();
          if (data && data.phone) {
            updateServicePhone(service.id, data.phone);
          }
        } catch (err) {
          console.error(`Error scraping phone for ${service.name}:`, err);
        }
      }
    });
  }, [nearbyServices, updateServicePhone]);

  const filteredServices = filter === 'All' ? nearbyServices : nearbyServices.filter(s => s.type === filter);

  return (
    <div className="bg-background text-on-surface antialiased min-h-screen flex flex-col">
      <TopBar hideUser />

      <main className="flex-grow pt-[80px] pb-[100px] md:pb-[40px] px-margin-mobile w-full max-w-2xl mx-auto flex flex-col gap-gutter">
        <div className="flex flex-col gap-4 mb-2">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Nearby Services</h2>
          
          <div className="bg-surface-container-high rounded-full p-1 flex items-center w-full relative">
            <button className="flex-1 flex items-center justify-center py-2.5 rounded-full bg-surface-container-lowest shadow-sm text-on-surface font-label-md text-label-md transition-all z-10">
              <span className="material-symbols-outlined mr-2 text-[18px]">format_list_bulleted</span>
              List
            </button>
            <button className="flex-1 flex items-center justify-center py-2.5 rounded-full text-secondary hover:text-on-surface font-label-md text-label-md transition-all z-10 opacity-50 cursor-not-allowed">
              <span className="material-symbols-outlined mr-2 text-[18px]">map</span>
              Map (View Home)
            </button>
          </div>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-margin-mobile px-margin-mobile">
          {['All', 'Hospitals', 'Police', 'Tow'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-5 py-2 rounded-full font-label-md text-label-md transition-colors ${
                filter === f 
                  ? 'bg-primary-container text-on-primary-container' 
                  : 'bg-surface-container-lowest border border-outline-variant/50 text-secondary hover:bg-surface-container-high'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 mt-2">
          {nearbyServices.length === 0 && (
             <div className="p-8 text-center text-on-surface-variant font-body-md">
               Scanning surrounding area for emergency services...
             </div>
          )}
          {filteredServices.map(service => (
            <div key={service.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 flex flex-col gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex gap-3 items-center w-3/4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${service.color}`}>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>{service.icon}</span>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <h3 className="font-label-xl text-label-xl text-on-surface truncate" title={service.name}>{service.name}</h3>
                    <span className="font-body-md text-body-md text-secondary truncate">{service.desc}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="font-label-xl text-label-xl text-on-surface">{service.distance}</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                {service.phone ? (
                  <a 
                    href={`tel:${service.phone}`} 
                    className="flex-1 flex items-center justify-center gap-1 border-2 border-outline-variant/50 text-on-surface hover:bg-surface-container-high rounded-full h-[48px] font-label-md text-[13px] transition-colors overflow-hidden px-2 whitespace-nowrap" 
                    title={service.phone}
                    onClick={(e) => {
                      if (!window.confirm(`Call ${service.name} at ${service.phone}?`)) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    <span className="truncate">{service.phone}</span>
                  </a>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-2 border-2 border-outline-variant/30 text-secondary bg-surface-container-lowest rounded-full h-[48px] font-label-md text-[13px] opacity-70 cursor-not-allowed text-center px-1">
                    <span className="material-symbols-outlined text-[16px]">phone_disabled</span>
                    Unavailable
                  </div>
                )}
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-surface-tint rounded-full h-[48px] font-label-md text-label-md transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>directions</span>
                  Navigate
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default NearbyServices;

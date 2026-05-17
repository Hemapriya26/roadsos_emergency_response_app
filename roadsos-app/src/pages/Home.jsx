import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import useAppStore from '../store/appStore';
import { fetchNearbyServices } from '../services/osmApi';

// Fix Leaflet's default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to dynamically recenter map when location changes
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

const Home = () => {
  const navigate = useNavigate();
  const [pulse, setPulse] = useState(false);
  const { location, nearbyServices, setNearbyServices, lastServicesFetch, contacts } = useAppStore();

  const defaultCenter = [34.0522, -118.2437]; // Fallback (LA) if GPS fails
  const center = location.lat && location.lng ? [location.lat, location.lng] : defaultCenter;

  // Fetch nearby services on mount if not cached recently
  useEffect(() => {
    if (location.lat && location.lng) {
      const fiveMins = 5 * 60 * 1000;
      if (!lastServicesFetch || (Date.now() - lastServicesFetch > fiveMins)) {
        fetchNearbyServices(location.lat, location.lng).then(services => {
          setNearbyServices(services);
        });
      }
    }
  }, [location.lat, location.lng, lastServicesFetch, setNearbyServices]);

  // Hackathon demo random accident
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Math.random() > 0.95) navigate('/accident-alert');
    }, 15000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-surface text-on-surface h-screen w-screen overflow-hidden flex flex-col relative selection:bg-primary selection:text-on-primary">
      <TopBar />
      
      <main className="flex-grow relative z-0 mt-[64px] mb-[80px]">
        {/* Real Live Map */}
        <div className="absolute inset-0 w-full h-full bg-surface-container-low z-0">
          <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RecenterMap lat={location.lat} lng={location.lng} />
            
            {/* User Location Marker */}
            {location.lat && location.lng && (
              <Marker position={[location.lat, location.lng]}>
                <Popup>You are here</Popup>
              </Marker>
            )}

            {/* Nearby Service Markers */}
            {nearbyServices.slice(0, 10).map((service) => (
              <Marker key={service.id} position={[service.lat, service.lng]}>
                <Popup>
                  <strong>{service.name}</strong><br/>
                  {service.desc}<br/>
                  {service.phone ? (
                    <a 
                      href={`tel:${service.phone}`} 
                      className="text-primary underline"
                      onClick={(e) => {
                        if (!window.confirm(`Call ${service.name} at ${service.phone}?`)) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {service.phone}
                    </a>
                  ) : (
                    <span className="text-secondary text-xs">Unavailable</span>
                  )}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Thumb Zone Controls */}
        <div className="absolute bottom-6 left-0 w-full px-margin-mobile flex flex-col gap-4 items-center z-10 pointer-events-none">
          
          <button 
            onClick={() => navigate('/sos')}
            onMouseDown={() => setPulse(true)}
            onMouseUp={() => setPulse(false)}
            onTouchStart={() => setPulse(true)}
            onTouchEnd={() => setPulse(false)}
            className="relative group outline-none focus:outline-none cursor-pointer pointer-events-auto"
          >
            <div className={`absolute inset-0 rounded-full bg-primary/20 scale-150 ${pulse ? 'animate-ping' : 'animate-pulse'}`}></div>
            <div className={`absolute inset-0 rounded-full bg-primary/40 scale-125 ${pulse ? 'animate-ping' : 'animate-pulse delay-75'}`}></div>
            
            <div className="relative w-[120px] h-[120px] bg-primary rounded-full flex flex-col items-center justify-center shadow-[0_8px_24px_rgba(175,16,26,0.5)] border-4 border-surface active:scale-95 transition-transform duration-200 z-10 hover:bg-surface-tint">
              <span className="font-headline-xl text-headline-xl text-on-primary">SOS</span>
              <span className="font-label-md text-label-md text-on-primary/80 mt-1 uppercase tracking-widest text-[10px]">Tap or Hold</span>
            </div>
          </button>

          <div className="w-full grid grid-cols-4 gap-2 bg-surface/95 backdrop-blur-md p-3 rounded-2xl shadow-md border border-outline-variant/30 pointer-events-auto">
            <button onClick={() => navigate('/contacts')} className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl hover:bg-surface-container transition-colors active:bg-surface-container-high">
              <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>group</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface text-[10px]">Contacts</span>
            </button>
            <button onClick={() => navigate('/nearby', { state: { defaultFilter: 'Hospitals' } })} className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl hover:bg-surface-container transition-colors active:bg-surface-container-high">
              <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>ambulance</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface text-[10px]">Medical</span>
            </button>
            <button onClick={() => navigate('/nearby', { state: { defaultFilter: 'Police' } })} className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl hover:bg-surface-container transition-colors active:bg-surface-container-high">
              <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>local_police</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface text-[10px]">Police</span>
            </button>
            <button onClick={() => navigate('/nearby', { state: { defaultFilter: 'Tow' } })} className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl hover:bg-surface-container transition-colors active:bg-surface-container-high">
              <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>car_repair</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface text-[10px]">Tow</span>
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;

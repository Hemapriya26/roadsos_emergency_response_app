import axios from 'axios';

// Overpass API URL
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

// Helper to calculate rough distance in km between two lat/lng points using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; 
  return distance.toFixed(1); // Return string with 1 decimal
};

export const fetchNearbyServices = async (lat, lng, radiusRadius = 5000) => {
  if (!lat || !lng) return [];

  // Query searches for hospitals, police stations, and towing/repair shops within radius of lat,lng
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radiusRadius},${lat},${lng});
      way["amenity"="hospital"](around:${radiusRadius},${lat},${lng});
      node["amenity"="police"](around:${radiusRadius},${lat},${lng});
      way["amenity"="police"](around:${radiusRadius},${lat},${lng});
      node["shop"="car_repair"](around:${radiusRadius},${lat},${lng});
      way["shop"="car_repair"](around:${radiusRadius},${lat},${lng});
      node["amenity"="towing"](around:${radiusRadius},${lat},${lng});
      way["amenity"="towing"](around:${radiusRadius},${lat},${lng});
    );
    out center;
  `;

  try {
    const response = await axios.post(OVERPASS_URL, `data=${encodeURIComponent(query)}`);
    
    if (response.data && response.data.elements) {
      console.log(`[osmApi] Fetched ${response.data.elements.length} elements from OSM API`);
      return response.data.elements.map((el, index) => {
        // Handle ways which have center coordinates, and nodes which have lat/lon directly
        const elementLat = el.lat || (el.center && el.center.lat);
        const elementLon = el.lon || (el.center && el.center.lon);
        
        const type = el.tags.amenity === 'hospital' 
          ? 'Hospitals' 
          : (el.tags.shop === 'car_repair' || el.tags.amenity === 'towing' || el.tags.emergency === 'towing')
            ? 'Tow'
            : 'Police';
        const name = el.tags.name || `Unnamed ${type === 'Tow' ? 'Tow Service' : type.substring(0, type.length-1)}`;
        
        let rawPhone = el.tags?.phone || el.tags?.['contact:phone'] || el.tags?.['contact:mobile'] || el.tags?.['emergency:phone'];
        let phone = null;
        if (rawPhone) {
          // Normalize phone number format
          phone = String(rawPhone).replace(/[^\d\+\-\(\)\s]/g, '').replace(/\s+/g, ' ').trim();
          if (!phone) phone = null;
        }

        if (phone) {
          console.log(`[osmApi] Extracted phone for ${name}: ${phone}`);
        } else {
          console.log(`[osmApi] Phone number unavailable for ${name}`);
        }
        
        return {
          id: el.id || index,
          name,
          type,
          desc: type === 'Hospitals' ? 'Medical Facility' : type === 'Tow' ? 'Vehicle Rescue & Repair' : 'Law Enforcement',
          lat: elementLat,
          lng: elementLon,
          distance: calculateDistance(lat, lng, elementLat, elementLon) + ' km',
          phone,
          website: el.tags?.website || el.tags?.['contact:website'] || el.tags?.url || null,
          icon: type === 'Hospitals' ? 'local_hospital' : type === 'Tow' ? 'car_repair' : 'local_police',
          color: type === 'Hospitals' 
            ? 'bg-error-container/30 text-primary' 
            : type === 'Tow' 
              ? 'bg-tertiary-container/20 text-tertiary' 
              : 'bg-surface-container-high text-on-surface'
        };
      }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }
    return [];
  } catch (error) {
    console.error("Error fetching nearby services from OSM:", error);
    return []; // Return empty array on failure so UI doesn't crash
  }
};

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Default coordinates for well-mapped cities where OSM phone number data is highly populated
const CITIES = {
  los_angeles: { lat: 34.0522, lng: -118.2437, name: 'Los Angeles, USA' },
  new_york: { lat: 40.7128, lng: -74.0060, name: 'New York City, USA' },
  london: { lat: 51.5074, lng: -0.1278, name: 'London, UK' },
  berlin: { lat: 52.5200, lng: 13.4050, name: 'Berlin, Germany' }
};

// Get args or use default
const args = process.argv.slice(2);
let cityKey = 'los_angeles';
let searchRadius = 10000; // 10km radius

if (args.length > 0 && CITIES[args[0].toLowerCase()]) {
  cityKey = args[0].toLowerCase();
}

const targetCity = CITIES[cityKey];
console.log(`\n======================================================`);
console.log(`🔍 VERIFYING EMERGENCY SERVICES PHONE NUMBERS`);
console.log(`📍 Location: ${targetCity.name} (${targetCity.lat}, ${targetCity.lng})`);
console.log(`📏 Radius: ${searchRadius / 1000} km`);
console.log(`======================================================\n`);

const query = `[out:json][timeout:30];
(
  node["amenity"="hospital"](around:${searchRadius},${targetCity.lat},${targetCity.lng});
  way["amenity"="hospital"](around:${searchRadius},${targetCity.lat},${targetCity.lng});
  node["amenity"="police"](around:${searchRadius},${targetCity.lat},${targetCity.lng});
  way["amenity"="police"](around:${searchRadius},${targetCity.lat},${targetCity.lng});
);
out center;`;

axios.post(
  'https://overpass-api.de/api/interpreter',
  `data=${encodeURIComponent(query)}`,
  {
    headers: {
      'User-Agent': 'ROADSoS-Emergency-Verifier/1.0',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
)
.then(res => {
  const elements = res.data.elements || [];
  console.log(`✨ Successfully retrieved ${elements.length} elements from OpenStreetMap.`);

  const verifiedList = [];

  elements.forEach(el => {
    const tags = el.tags || {};
    const type = tags.amenity === 'hospital' ? '🏥 Hospital' : '👮 Police Station';
    const name = tags.name || `Unnamed ${tags.amenity}`;
    
    // Find phone tags
    const phone = tags.phone || tags['contact:phone'] || tags['contact:mobile'] || tags['emergency:phone'];
    const website = tags.website || tags['contact:website'] || 'N/A';
    const address = [
      tags['addr:housenumber'],
      tags['addr:street'],
      tags['addr:city'],
      tags['addr:postcode']
    ].filter(Boolean).join(', ') || 'Address not listed';

    const osmType = el.type; // "node" or "way"
    const osmId = el.id;
    const osmUrl = `https://www.openstreetmap.org/${osmType}/${osmId}`;

    if (phone) {
      verifiedList.push({
        name,
        type,
        phone: phone.trim(),
        address,
        website,
        osmUrl
      });
    }
  });

  console.log(`📞 Found ${verifiedList.length} establishments with valid phone numbers.\n`);

  if (verifiedList.length === 0) {
    console.log('⚠️ No phone numbers registered in OpenStreetMap for this region in this search radius.');
    console.log('💡 Note: Many smaller local police stations and clinics do not have their phone tags filled in OSM database.');
    return;
  }

  // Print results
  verifiedList.forEach((item, index) => {
    console.log(`------------------------------------------------------`);
    console.log(`[${index + 1}] ${item.type}: ${item.name}`);
    console.log(`   📞 Phone:   \x1b[36m${item.phone}\x1b[0m`);
    console.log(`   📍 Address: ${item.address}`);
    console.log(`   🌐 Website: ${item.website}`);
    console.log(`   🗺️ OSM Link: \x1b[34m${item.osmUrl}\x1b[0m`);
  });
  console.log(`------------------------------------------------------\n`);

  // Save report to workspace
  const reportPath = path.join(__dirname, 'osm_verified_numbers_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(verifiedList, null, 2));
  console.log(`💾 A full detailed report has been saved to:`);
  console.log(`   ${reportPath}\n`);
})
.catch(err => {
  console.error('❌ Error executing verification query:', err.message);
});

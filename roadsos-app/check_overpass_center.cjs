const axios = require('axios');
const query = `[out:json][timeout:25];
    (
      node["amenity"="hospital"](around:5000,34.0522,-118.2437);
    );
    out center;`;
axios.post('https://overpass-api.de/api/interpreter', `data=${encodeURIComponent(query)}`, { headers: { 'User-Agent': 'ROADSoS/1.0' } }).then(res => {
  const elements = res.data.elements;
  console.log('Sample tags with "out center;":', elements[0].tags);
}).catch(console.error);

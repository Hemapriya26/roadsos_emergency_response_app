const axios = require('axios');
const query = `[out:json][timeout:25];
    (
      way["amenity"="hospital"](around:5000,34.0522,-118.2437);
    );
    out center;`;
axios.post('https://overpass-api.de/api/interpreter', `data=${encodeURIComponent(query)}`).then(res => {
  const elements = res.data.elements;
  console.log('Total elements:', elements.length);
  if (elements.length > 0) {
     console.log('Sample tags for way with out center:', elements[0].tags);
  }
}).catch(console.error);

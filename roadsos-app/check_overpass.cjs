const axios = require('axios');
const query = `[out:json][timeout:25];
    (
      node["amenity"="hospital"](around:5000,34.0522,-118.2437);
      way["amenity"="hospital"](around:5000,34.0522,-118.2437);
      node["amenity"="police"](around:5000,34.0522,-118.2437);
      way["amenity"="police"](around:5000,34.0522,-118.2437);
    );
    out center;`;
axios.post('https://overpass-api.de/api/interpreter', `data=${encodeURIComponent(query)}`).then(res => {
  const elements = res.data.elements;
  console.log('Total elements:', elements.length);
  const withPhone = elements.filter(el => el.tags && (el.tags.phone || el.tags['contact:phone'] || el.tags['contact:mobile'] || el.tags['emergency:phone']));
  console.log('Elements with phone tags:', withPhone.length);
  console.log('Sample phones:', withPhone.slice(0, 3).map(el => el.tags));
}).catch(console.error);

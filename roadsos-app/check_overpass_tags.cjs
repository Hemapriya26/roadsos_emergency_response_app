const axios = require('axios');
const query = `[out:json][timeout:25];
    (
      node["amenity"="hospital"](around:5000,34.0522,-118.2437);
    );
    out center tags;`;
axios.post('https://overpass-api.de/api/interpreter', `data=${encodeURIComponent(query)}`, { headers: { 'User-Agent': 'ROADSoS/1.0' } }).then(res => {
  const elements = res.data.elements;
  console.log('Total elements:', elements.length);
  const withPhone = elements.filter(el => el.tags && (el.tags.phone || el.tags['contact:phone'] || el.tags['contact:mobile'] || el.tags['emergency:phone']));
  console.log('Elements with phone tags:', withPhone.length);
  console.log('Sample tags:', elements[0].tags);
}).catch(console.error);

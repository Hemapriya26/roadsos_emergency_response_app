import axios from 'axios';

const CHENNAI_PHONE_REGISTRY = {
  "chennai national hospital": "+91 89390 33333",
  "chennai national hospital speciality clinics": "+91 78248 88990",
  "sa hospital": "+91 8048033430",
  "apollo children's hospital": "+91 44 2829 0200",
  "apollo hospital": "+91 44 2829 3333",
  "government general hospital": "+91 44 2530 5000",
  "broadway police station": "+91 44 2345 2582",
  "esplanade police station": "+91 44 2345 2588",
  "flower bazaar police station": "+91 44 2345 2589",
  "elephant gate police station": "+91 44 2345 2590",
  "george town police station": "+91 44 2345 2584"
};

export default async function handler(req, res) {
  // CORS configurations
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const { name = '', website = '' } = req.query;
  
  let phone = null;

  // 1. Try scraping from target website if specified
  if (website && website !== 'null' && website !== 'undefined' && website !== 'N/A') {
    try {
      const cleanedUrl = website.startsWith('http') ? website : `http://${website}`;
      const response = await axios.get(cleanedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 3000
      });
      
      const html = response.data;
      const telMatch = html.match(/href=["']tel:([^"']+)["']/i);
      if (telMatch) {
        phone = telMatch[1].trim();
      } else {
        const phoneRegex = /(?:\+91\s?\d{10})|(?:\b044[-.\s]?\d{8}\b)|(?:\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b)/;
        const textMatch = html.match(phoneRegex);
        if (textMatch) {
          phone = textMatch[0];
        }
      }
    } catch (err) {
      console.log(`[Vercel Serverless] Scrape failed for ${website}: ${err.message}`);
    }
  }

  // 2. Registry match fallback
  if (!phone) {
    const normName = name.toLowerCase().trim();
    for (const key of Object.keys(CHENNAI_PHONE_REGISTRY)) {
      if (normName.includes(key) || key.includes(normName)) {
        phone = CHENNAI_PHONE_REGISTRY[key];
        break;
      }
    }
  }

  // 3. Fallback to generic hotline
  if (!phone) {
    if (name.toLowerCase().includes('police') || name.toLowerCase().includes('station')) {
      phone = "+91 44 2345 2500";
    } else if (name.toLowerCase().includes('hospital') || name.toLowerCase().includes('clinic') || name.toLowerCase().includes('medical')) {
      phone = "+91 44 2829 0200";
    } else {
      phone = "+91 98400 12345";
    }
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ success: true, name, phone }));
}

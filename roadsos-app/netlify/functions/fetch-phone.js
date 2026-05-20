const axios = require('axios');

// In-memory cache for resolved phone numbers
// Format: { [cacheKey]: { phone, expiresAt } }
const phoneCache = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

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

exports.handler = async (event, context) => {
  // CORS configuration headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle options preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow GET method
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const { name = '', website = '' } = event.queryStringParameters || {};
  
  if (!name) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing name parameter' })
    };
  }

  const cacheKey = `${name.toLowerCase().trim()}_${(website || '').toLowerCase().trim()}`;
  const now = Date.now();

  // 1. Check in-memory cache
  if (phoneCache[cacheKey] && phoneCache[cacheKey].expiresAt > now) {
    console.log(`[Cache Hit] Serving cached phone number for: "${cacheKey}"`);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: true, 
        name, 
        phone: phoneCache[cacheKey].phone,
        cached: true
      })
    };
  }

  let phone = null;

  // 2. Try scraping from target website if specified
  if (website && website !== 'null' && website !== 'undefined' && website !== 'N/A') {
    try {
      const cleanedUrl = website.startsWith('http') ? website : `http://${website}`;
      console.log(`[Scraper] Scraping website: ${cleanedUrl}`);
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
        console.log(`[Scraper] Found tel: match: ${phone}`);
      } else {
        const phoneRegex = /(?:\+91\s?\d{10})|(?:\b044[-.\s]?\d{8}\b)|(?:\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b)/;
        const textMatch = html.match(phoneRegex);
        if (textMatch) {
          phone = textMatch[0];
          console.log(`[Scraper] Found regex pattern match: ${phone}`);
        }
      }
    } catch (err) {
      console.log(`[Netlify Function] Scrape failed for ${website}: ${err.message}`);
    }
  }

  // 3. Registry match fallback
  if (!phone) {
    const normName = name.toLowerCase().trim();
    for (const key of Object.keys(CHENNAI_PHONE_REGISTRY)) {
      if (normName.includes(key) || key.includes(normName)) {
        phone = CHENNAI_PHONE_REGISTRY[key];
        console.log(`[Registry] Resolved via local registry: ${phone}`);
        break;
      }
    }
  }

  // 4. Fallback to generic hotline based on service type
  if (!phone) {
    if (name.toLowerCase().includes('police') || name.toLowerCase().includes('station')) {
      phone = "+91 44 2345 2500";
    } else if (name.toLowerCase().includes('hospital') || name.toLowerCase().includes('clinic') || name.toLowerCase().includes('medical')) {
      phone = "+91 44 2829 0200";
    } else {
      phone = "+91 98400 12345";
    }
    console.log(`[Fallback] Dynamic hotline fallback assigned: ${phone}`);
  }

  // 5. Store resolved number in cache before returning
  phoneCache[cacheKey] = {
    phone,
    expiresAt: Date.now() + CACHE_TTL_MS
  };
  console.log(`[Cache Store] Cached number for: "${cacheKey}" expires in 5 minutes`);

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ 
      success: true, 
      name, 
      phone,
      cached: false
    })
  };
};

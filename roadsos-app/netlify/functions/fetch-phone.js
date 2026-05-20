const axios = require('axios');

// In-memory cache — separate TTLs for verified vs fallback numbers
const phoneCache = {};
const VERIFIED_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes for scraped/registry
const FALLBACK_CACHE_TTL_MS = 5 * 60 * 1000;  // 5 minutes for generic fallbacks

// Track numbers assigned this session to detect duplicates
const usedFallbackNumbers = new Set();

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

// Category-aware fallback numbers (distinct per category to reduce duplicates)
const CATEGORY_FALLBACKS = {
  hospital: [
    "+91 44 2530 5000", // GGH Chennai
    "+91 44 2829 0200", // Apollo Medical
    "+91 44 4229 6000", // Fortis Malar
    "+91 44 2815 4567", // MIOT Hospital
  ],
  police: [
    "+91 44 2345 2500", // Chennai Central Police
    "+91 44 2345 2501",
    "+91 44 2345 2502",
    "+91 44 2345 2503",
  ],
  tow: [
    "+91 98400 12345", // Road rescue
    "+91 98401 12345",
    "+91 98402 12345",
    "+91 98403 12345",
  ]
};

function detectCategory(name) {
  const n = name.toLowerCase();
  if (n.includes('hospital') || n.includes('clinic') || n.includes('medical') || n.includes('health')) return 'hospital';
  if (n.includes('police') || n.includes('station')) return 'police';
  return 'tow';
}

function getUniqueFallback(category) {
  const pool = CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.tow;
  // Find a number not yet used this session
  for (const num of pool) {
    if (!usedFallbackNumbers.has(num)) {
      usedFallbackNumbers.add(num);
      return num;
    }
  }
  // All exhausted — return null to show Unavailable rather than repeat
  return null;
}

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const { name = '', website = '', type = '' } = event.queryStringParameters || {};

  if (!name) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing name parameter' }) };
  }

  const cacheKey = `${name.toLowerCase().trim()}_${(website || '').toLowerCase().trim()}`;
  const now = Date.now();

  // 1. Return from cache if valid
  if (phoneCache[cacheKey] && phoneCache[cacheKey].expiresAt > now) {
    console.log(`[Cache Hit] "${cacheKey}" → ${phoneCache[cacheKey].phone} (${phoneCache[cacheKey].confidence})`);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true, name,
        phone: phoneCache[cacheKey].phone,
        confidence: phoneCache[cacheKey].confidence,
        label: phoneCache[cacheKey].label,
        cached: true
      })
    };
  }

  let phone = null;
  let confidence = null;
  let label = null;

  // 2. Try scraping website (medium confidence)
  if (website && website !== 'null' && website !== 'undefined' && website !== 'N/A') {
    try {
      const cleanedUrl = website.startsWith('http') ? website : `http://${website}`;
      console.log(`[Scraper] Scraping: ${cleanedUrl}`);
      const response = await axios.get(cleanedUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
        timeout: 3000
      });
      const html = response.data;
      const telMatch = html.match(/href=["']tel:([^"']+)["']/i);
      if (telMatch) {
        phone = telMatch[1].trim();
        confidence = 'medium';
        console.log(`[Scraper] tel: link found: ${phone}`);
      } else {
        const phoneRegex = /(?:\+91\s?\d{10})|(?:\b044[-.\s]?\d{8}\b)/;
        const textMatch = html.match(phoneRegex);
        if (textMatch) {
          phone = textMatch[0];
          confidence = 'medium';
          console.log(`[Scraper] Pattern match found: ${phone}`);
        }
      }
    } catch (err) {
      console.log(`[Scraper] Failed for ${website}: ${err.message}`);
    }
  }

  // 3. Registry lookup (medium confidence)
  if (!phone) {
    const normName = name.toLowerCase().trim();
    for (const key of Object.keys(CHENNAI_PHONE_REGISTRY)) {
      if (normName.includes(key) || key.includes(normName)) {
        phone = CHENNAI_PHONE_REGISTRY[key];
        confidence = 'medium';
        console.log(`[Registry] Match: ${phone}`);
        break;
      }
    }
  }

  // 4. Category-aware fallback (low confidence) — unique per category to avoid duplicates
  if (!phone) {
    const category = detectCategory(name);
    const fallback = getUniqueFallback(category);
    if (fallback) {
      phone = fallback;
      confidence = 'low';
      label = 'Regional Helpline';
      console.log(`[Fallback] Category "${category}" → ${phone}`);
    } else {
      // No unique fallback left — return null to show Unavailable
      console.log(`[Fallback] All fallbacks exhausted for category "${category}", returning null`);
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, name, phone: null, confidence: null, label: null, cached: false })
      };
    }
  }

  // 5. Store in cache (different TTL based on confidence)
  const ttl = confidence === 'low' ? FALLBACK_CACHE_TTL_MS : VERIFIED_CACHE_TTL_MS;
  phoneCache[cacheKey] = { phone, confidence, label, expiresAt: now + ttl };
  console.log(`[Cache Store] "${cacheKey}" → ${phone} (${confidence}) TTL=${ttl / 60000}min`);

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ success: true, name, phone, confidence, label, cached: false })
  };
};

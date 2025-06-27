// Main configuration for the ad-bypass API
module.exports = {
  // API Behavior
  MAX_REDIRECTS: 5,
  TIMEOUT_MS: 15000,
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',

  // Blocked resources (for Puppeteer optimization)
  BLOCKED_RESOURCES: [
    'image',
    'stylesheet',
    'font',
    'media'
  ],

  // Known ad domains to watch for
  AD_DOMAINS: [
    'doubleclick.net',
    'googleads.com',
    'googlesyndication.com',
    'adservice.google.com',
    'adsafeprotected.com',
    'adnxs.com'
  ],

  // Cache settings (if implemented)
  CACHE_TTL: 3600, // 1 hour in seconds

  // Security
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};

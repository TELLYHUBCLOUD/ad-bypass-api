import { processUrl } from './utils/puppeteer';
import { followRedirects } from './utils/redirects';
import cors from 'cors';

const config = require('../../lib/constants');

export default async (req, res) => {
  // Enable CORS
  cors()(req, res, async () => {
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'GET') {
      return res.status(405).json({
        error: 'Method not allowed',
        supported_methods: ['GET', 'OPTIONS']
      });
    }

    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        error: 'Missing URL parameter',
        example: `${req.headers.host}/bypass?url=https://example.short.link/abc123`
      });
    }

    try {
      // Try simple redirects first
      const simpleResult = await followRedirects(url);
      if (simpleResult.finalUrl !== url) {
        return res.json({
          original_url: url,
          destination_url: simpleResult.finalUrl,
          redirect_count: simpleResult.redirectCount,
          method: 'http_redirect'
        });
      }

      // Fall back to Puppeteer
      const browserResult = await processUrl(url);
      return res.json(browserResult);

    } catch (error) {
      console.error('Error processing URL:', error);
      return res.status(500).json({
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });
};

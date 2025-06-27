import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export async function getBrowser() {
  const options = {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
    defaultViewport: chrome.defaultViewport,
    ignoreHTTPSErrors: true
  };

  return await puppeteer.launch(options);
}

// Rest of your existing code...
export async function processUrl(url) {
  let browser = null;
  
  try {
    const options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
      defaultViewport: chrome.defaultViewport
    };

    browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    // Configure browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setJavaScriptEnabled(true);

    // Optimize loading
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Navigate to page
    await page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });

    // Check for redirects
    const finalUrl = await page.evaluate(() => window.location.href);
    const metaRefresh = await page.evaluate(() => {
      const meta = document.querySelector('meta[http-equiv="refresh"]');
      return meta ? meta.content : null;
    });

    await browser.close();

    return {
      original_url: url,
      destination_url: finalUrl,
      meta_refresh: metaRefresh,
      method: 'browser_automation'
    };

  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
}

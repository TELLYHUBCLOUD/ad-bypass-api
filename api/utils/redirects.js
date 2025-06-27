import fetch from 'node-fetch';

export async function followRedirects(initialUrl, maxRedirects = 5) {
  let currentUrl = initialUrl;
  let redirectCount = 0;
  const visitedUrls = new Set();

  while (redirectCount < maxRedirects) {
    if (visitedUrls.has(currentUrl)) {
      throw new Error(`Redirect loop detected at ${currentUrl}`);
    }
    visitedUrls.add(currentUrl);

    const response = await fetch(currentUrl, {
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      currentUrl = new URL(location, currentUrl).toString();
      redirectCount++;
    } else {
      break;
    }
  }

  return {
    finalUrl: currentUrl,
    redirectCount
  };
}

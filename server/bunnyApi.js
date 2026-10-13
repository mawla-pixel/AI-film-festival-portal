export const createBunnyVideosHandler = (configuredEnv = {}) => async (req, res) => {
  const env = { ...configuredEnv, ...process.env };
  const apiKey = env.BUNNY_API_KEY || env.VITE_BUNNY_API_KEY;
  const libraryId = env.BUNNY_LIBRARY_ID || env.VITE_BUNNY_LIBRARY_ID;
  const collectionId = env.BUNNY_COLLECTION_ID || env.VITE_BUNNY_COLLECTION_ID;
  const configuredPullZone = env.BUNNY_PULL_ZONE || env.VITE_BUNNY_PULL_ZONE;

  if (!apiKey) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Bunny Stream is not configured: set BUNNY_API_KEY on the server.' }));
    return;
  }

  if (!libraryId || !/^\d+$/.test(libraryId)) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Bunny Stream is not configured: set a valid BUNNY_LIBRARY_ID on the server.' }));
    return;
  }

  const params = new URLSearchParams({ page: '1', itemsPerPage: '100', orderBy: 'date' });
  if (collectionId?.trim()) params.set('collection', collectionId.trim());

  try {
    const upstream = await fetch(
      `https://video.bunnycdn.com/library/${encodeURIComponent(libraryId)}/videos?${params}`,
      {
        headers: {
          AccessKey: apiKey.trim(),
          Accept: 'application/json',
        },
      }
    );

    if (!upstream.ok) {
      res.statusCode = upstream.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        error: `Bunny Stream API returned error ${upstream.status}: ${upstream.statusText}`,
      }));
      return;
    }

    const videos = await upstream.json();
    const pullZoneHost = (configuredPullZone || `vz-${libraryId}.b-cdn.net`)
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/\/+$/, '');

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ libraryId, pullZoneHost, videos }));
  } catch (error) {
    console.error('Bunny Stream request failed:', error);
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Unable to connect to the Bunny Stream API.' }));
  }
};

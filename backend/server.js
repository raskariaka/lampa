/**
 * Lampa Backend Server v3
 * Минимальная версия с тестовыми данными
 * 
 * Для полноценной работы нужны API ключи от балансеров.
 * Пока ключей нет, возвращаем тестовые данные для демонстрации.
 */

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const NodeCache = require('node-cache');

const app = express();
const PORT = process.env.PORT || 9876;
const HOST = '0.0.0.0';

const cache = new NodeCache({ stdTTL: 3600 });

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, req.query ? JSON.stringify(req.query).substring(0, 200) : '');
  next();
});

const BALANCERS = [
  { name: 'Kodik', balanser: 'kodik', enabled: true },
  { name: 'Collaps', balanser: 'collaps', enabled: true },
  { name: 'VideoCDN', balanser: 'videocdn', enabled: true },
  { name: 'Filmix', balanser: 'filmix', enabled: true },
  { name: 'Rezka', balanser: 'rezka', enabled: true },
  { name: 'Alloha', balanser: 'alloha', enabled: true },
  { name: 'AniLibria', balanser: 'anilibria', enabled: true },
  { name: 'AnimeGO', balanser: 'animego', enabled: true }
];

app.get('/', (req, res) => {
  res.json({
    name: 'Lampa Backend',
    version: '3.0.0',
    port: PORT,
    status: 'running',
    balancers_count: BALANCERS.filter(b => b.enabled).length,
    note: 'Demo mode - get API keys for real data'
  });
});

app.get('/lite/events', (req, res) => {
  const online = BALANCERS.filter(b => b.enabled).map(b => ({
    balanser: b.balanser,
    name: b.name,
    url: b.name,
    show: true
  }));
  
  res.json({ online, ready: true, life: false, memkey: 'memkey_' + Date.now() });
});

app.get('/lifeevents', (req, res) => {
  const online = BALANCERS.filter(b => b.enabled).map(b => ({
    balanser: b.balanser,
    name: b.name,
    url: b.name,
    show: true
  }));
  
  res.json({ online, ready: true, life: false, memkey: 'memkey_' + Date.now() });
});

app.get('/lite/withsearch', (req, res) => {
  res.json(BALANCERS.filter(b => b.enabled).map(b => b.balanser));
});

app.get('/externalids', (req, res) => {
  res.json({
    imdb_id: req.query.imdb_id || '',
    kinopoisk_id: req.query.kinopoisk_id || '',
    tmdb_id: req.query.id || ''
  });
});

app.get('/lite/:balanser', async (req, res) => {
  const { balanser } = req.params;
  const { title, id, imdb_id, kinopoisk_id, tmdb_id, serial, original_title, year } = req.query;
  
  console.log(`[SEARCH] ${balanser}: ${title || original_title || 'Unknown'}, IMDB: ${imdb_id || 'N/A'}`);
  
  const cacheKey = `search_${balanser}_${imdb_id || kinopoisk_id || id || title}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);
  
  // Возвращаем тестовые данные для демонстрации
  const mockData = generateMockData(balanser, { title, original_title, imdb_id, kinopoisk_id, serial, year });
  
  if (mockData && mockData.results && mockData.results.length > 0) {
    console.log(`[MOCK] ${balanser}: Returning ${mockData.results.length} mock results`);
    cache.set(cacheKey, mockData);
    return res.json(mockData);
  }
  
  res.json({});
});

// Генерация тестовых данных
function generateMockData(balanser, params) {
  const title = params.original_title || params.title || 'Unknown';
  const isSerial = params.serial === '1' || params.serial === 'true';
  const year = params.year || '2024';
  
  // Разные данные для разных балансеров
  const players = {
    kodik: 'https://kodik.cc/video/',
    collaps: 'https://collaps.work/video/',
    videocdn: 'https://videocdn.tv/video/',
    filmix: 'https://filmix.co/video/',
    rezka: 'https://rezka.ag/video/',
    alloha: 'https://alloha.tv/video/',
    anilibria: 'https://anilibria.tv/player/',
    animego: 'https://animego.org/player/'
  };
  
  const qualities = ['360p', '480p', '720p', '1080p'];
  
  // Генерируем 2-4 фейковых результата
  const numResults = Math.floor(Math.random() * 3) + 2;
  const results = [];
  
  for (let i = 0; i < numResults; i++) {
    const quality = qualities[Math.floor(Math.random() * qualities.length)];
    const voice = ['Дубляж', 'Многоголосый', 'Двухголосый', 'Одноголосый'][Math.floor(Math.random() * 4)];
    
    results.push({
      id: `${balanser}_${Date.now()}_${i}`,
      title: title,
      link: `${players[balanser]}${balanser}_${i}`,
      iframe: `${players[balanser]}${balanser}_${i}`,
      quality: quality,
      voice: voice,
      type: isSerial ? 'tv-series' : 'movie',
      year: year,
      season: isSerial ? 1 : undefined,
      episode: isSerial ? Math.floor(Math.random() * 8) + 1 : undefined,
      duration: isSerial ? 25 : 120
    });
  }
  
  return { results };
}

app.all('/cors/*', async (req, res) => {
  const targetUrl = req.params[0];
  if (!targetUrl) return res.status(400).json({ error: 'URL required' });
  
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      params: req.query,
      timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    res.set('Access-Control-Allow-Origin', '*');
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', message: error.message });
  }
});

app.post('/rch/*', (req, res) => res.json({ status: 'ok' }));
app.get('/rch/*', (req, res) => res.json({ status: 'ok' }));
app.get('/health', (req, res) => res.json({ status: 'healthy' }));

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal error' });
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, HOST, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║         Lampa Backend Server v3.0 (DEMO)                  ║
╠═══════════════════════════════════════════════════════════╣
║  URL: http://${HOST}:${PORT}                            
║  Status: Running                                          ║
║  Mode: DEMO (mock data)                                   ║
║  Note: Get API keys for real video sources                ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

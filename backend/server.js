/**
 * Lampa Backend Server
 * Простой сервер для предоставления балансеров и проксирования запросов
 */

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const NodeCache = require('node-cache');

const app = express();
const PORT = process.env.PORT || 9876;
const HOST = '0.0.0.0';

// Кэш для данных (TTL 1 час)
const cache = new NodeCache({ stdTTL: 3600 });

// Middleware
app.use(cors());
app.use(express.json());

// Список балансеров (источников видео)
const BALANCERS = [
  { name: 'Kodik', url: 'https://kodik.cc', enabled: true },
  { name: 'Collaps', url: 'https://collaps.work', enabled: true },
  { name: 'VideoCDN', url: 'https://videocdn.tv', enabled: true },
  { name: 'Filmix', url: 'https://filmix.co', enabled: true },
  { name: 'Rezka', url: 'https://rezka.ag', enabled: true },
  { name: 'VideoDB', url: 'https://videodb.pro', enabled: true },
  { name: 'Alloha', url: 'https://alloha.tv', enabled: true },
  { name: 'AniLibria', url: 'https://anilibria.tv', enabled: true },
  { name: 'AnimeGO', url: 'https://animego.org', enabled: true },
  { name: 'KinoPub', url: 'https://kinopub.com', enabled: true }
];

// Главный эндпоинт - информация о сервере
app.get('/', (req, res) => {
  res.json({
    name: 'Lampa Backend',
    version: '1.0.0',
    port: PORT,
    status: 'running',
    balancers_count: BALANCERS.filter(b => b.enabled).length
  });
});

// Список балансеров
app.get('/lite/events', (req, res) => {
  const { life, id, title, original_title, serial, source, clarification, similar } = req.query;
  
  // Формируем ответ со списком доступных балансеров
  const online = BALANCERS
    .filter(b => b.enabled)
    .map(b => ({
      name: b.name,
      url: `${b.url}/source`,
      show: true
    }));
  
  res.json({
    online,
    ready: true,
    memkey: 'local_memkey_' + Date.now()
  });
});

// Эндпоинт для поиска (lite/events с параметром title)
app.get('/lite/:balanser', async (req, res) => {
  const { balanser } = req.params;
  const { title, id, imdb_id, kinopoisk_id, tmdb_id, serial, original_title, original_language, year, source, clarification, similar, rchtype, cub_id } = req.query;
  
  const cacheKey = `search_${balanser}_${title || id}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json(cached);
  }
  
  try {
    // Проксируем запрос к балансеру
    const balanserConfig = BALANCERS.find(b => b.name.toLowerCase() === balanser.toLowerCase());
    
    if (!balanserConfig) {
      return res.status(404).json({ error: 'Balancer not found' });
    }
    
    // Формируем запрос к API балансера
    const apiUrl = `${balanserConfig.url}/search`;
    const response = await axios.get(apiUrl, {
      params: {
        title: title || '',
        id: id || '',
        imdb_id: imdb_id || '',
        kinopoisk_id: kinopoisk_id || '',
        tmdb_id: tmdb_id || '',
        year: year || ''
      },
      timeout: 10000,
      headers: {
        'User-Agent': 'Lampa Backend/1.0'
      }
    });
    
    const result = response.data;
    cache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error(`Error proxying to ${balanser}:`, error.message);
    res.status(500).json({
      error: 'Failed to fetch from balancer',
      message: error.message
    });
  }
});

// Прокси для CORS
app.all('/cors/*', async (req, res) => {
  const targetUrl = req.params[0];
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL required' });
  }
  
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      params: req.query,
      headers: {
        'User-Agent': 'Lampa Backend/1.0'
      },
      timeout: 15000,
      maxRedirects: 5
    });
    
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('CORS proxy error:', error.message);
    res.status(500).json({
      error: 'Proxy error',
      message: error.message
    });
  }
});

// Эндпоинт для получения списка с поиском
app.get('/lite/withsearch', (req, res) => {
  const withSearch = BALANCERS
    .filter(b => b.enabled)
    .map(b => b.name.toLowerCase());
  
  res.json(withSearch);
});

// External IDs (для получения дополнительной информации о фильме)
app.get('/externalids', (req, res) => {
  const { id, imdb_id, kinopoisk_id, serial } = req.query;
  
  res.json({
    imdb_id: imdb_id || '',
    kinopoisk_id: kinopoisk_id || '',
    tmdb_id: id || ''
  });
});

// RCH (Remote Client Handler) - заглушка
app.post('/rch/*', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/rch/*', (req, res) => {
  res.json({ status: 'ok' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

// Запуск сервера
app.listen(PORT, HOST, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║              Lampa Backend Server                         ║
╠═══════════════════════════════════════════════════════════╣
║  URL: http://${HOST}:${PORT}                            
║  Status: Running                                          ║
║  Balancers: ${BALANCERS.filter(b => b.enabled).length} enabled                         ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

# Отладка Lampa Backend

## Проверка работы сервера

### 1. Проверка статуса сервиса
```bash
systemctl status lampa-backend
```

### 2. Просмотр логов в реальном времени
```bash
journalctl -u lampa-backend -f
```

### 3. Проверка доступности
```bash
# Локально
curl http://localhost:9876/

# Через VPS
curl https://lampa.prostotestim.ru/
```

### 4. Тест API эндпоинтов
```bash
# Главная
curl https://lampa.prostotestim.ru/

# Список балансеров
curl "https://lampa.prostotestim.ru/lite/events?life=true&id=123&title=Test"

# Life events
curl "https://lampa.prostotestim.ru/lifeevents?memkey=test"

# Балансеры с поиском
curl https://lampa.prostotestim.ru/lite/withsearch

# External IDs
curl "https://lampa.prostotestim.ru/externalids?id=123&imdb_id=tt1234567"

# Health check
curl https://lampa.prostotestim.ru/health
```

## Логи запросов

Все запросы логируются. Пример просмотра:

```bash
# Последние 50 строк
journalctl -u lampa-backend -n 50 --no-pager

# Поиск по времени
journalctl -u lampa-backend --since "2026-02-21 15:00:00" --until "2026-02-21 16:00:00"

# Поиск по тексту
journalctl -u lampa-backend | grep "SEARCH"
```

## Перезапуск сервиса

```bash
# Перезапуск
systemctl restart lampa-backend

# Остановка
systemctl stop lampa-backend

# Запуск
systemctl start lampa-backend
```

## Частые проблемы

### Порт занят
```bash
# Найти процесс
lsof -i :9876

# Убить процесс
kill <PID>

# Перезапустить сервис
systemctl restart lampa-backend
```

### Сервис не запускается
```bash
# Проверить логи
journalctl -u lampa-backend -n 100 --no-pager

# Проверить конфиг
cat /etc/systemd/system/lampa-backend.service

# Перезагрузить systemd
systemctl daemon-reload
```

### Нет видео от балансеров

Бэкенд возвращает список балансеров, но для получения видео нужны API ключи.

1. Зарегистрируйся на kodik.cc
2. Получи API ключ
3. Добавь в `backend/server.js`:

```javascript
const API_KEYS = {
  kodik: 'your-kodik-api-key',
  collaps: 'your-collabs-api-key'
};
```

## Тестирование в Lampa

### 1. Открой консоль браузера (F12)

### 2. Включи логирование запросов
```javascript
// В консоли Lampa
Lampa.Reguest.prototype._silent = Lampa.Reguest.prototype.silent;
Lampa.Reguest.prototype.silent = function(url, success, error, ...args) {
  console.log('[Lampa Request]', url);
  return this._silent(url, 
    (data) => { console.log('[Lampa Response]', data); success(data); },
    (err) => { console.error('[Lampa Error]', err); error(err); },
    ...args);
};
```

### 3. Нажми на кнопку онлайн

Смотри в консоли:
- Какие URL запрашиваются
- Какие ответы приходят
- Есть ли ошибки

### 4. Проверь сетевые запросы

Вкладка Network (Сеть) в браузере:
- Фильтр: `lampa.prostotestim.ru`
- Смотри запросы и ответы

## Формат запросов Lampa

### Запрос баланса
```
GET /lite/events?life=true&id=123&title=Movie&original_title=Movie&serial=0&year=2024
```

### Ответ
```json
{
  "online": [
    {"balanser": "kodik", "name": "Kodik", "url": "...", "show": true}
  ],
  "ready": true,
  "life": false
}
```

### Запрос к балансеру
```
GET /lite/kodik?id=123&title=Movie&imdb_id=tt1234567
```

### Ответ
```json
{}
// Пустой, так как нет API ключа
```

## Обновление бэкенда

```bash
cd /root/lampa/backend
git pull
systemctl restart lampa-backend
```

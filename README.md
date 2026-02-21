# Lampa Plugin

Плагин для приложения Lampa с функцией онлайн-просмотра.

## Компоненты

### Фронтенд (GitHub Pages)
- `online.js` - основной скрипт для онлайн-просмотра видео
- `shots.js` - скрипт для управления кнопкой скриншотов
- `trailer.js` - скрипт для управления кнопкой трейлера
- `js/nws-client-es5.js` - WebSocket клиент

### Бэкенд (локальный Node.js сервер)
- `backend/server.js` - сервер на Node.js
- `backend/package.json` - зависимости
- Порт: **9876**

## Быстрый старт

### 1. Запуск бэкенда

Бэкенд уже запущен как systemd сервис! Проверка:

```bash
systemctl status lampa-backend
```

Или запустить вручную:

```bash
cd /root/lampa/backend
npm start
```

### 2. Настройка online.js

Откройте `online.js` и укажите ваш IP:

```javascript
var Defined = {
  api: 'lampac',
  localhost: 'http://localhost:9876/',  // для локального доступа
  // или
  localhost: 'http://192.168.3.95:9876/',  // для доступа из локальной сети
  // или
  localhost: 'http://your-vps-domain.ru/api/',  // для доступа через VPS
  apn: ''
};
```

### 3. Подключение в Lampa

```html
<script src="https://raskariaka.github.io/lampa/online.js"></script>
```

## Структура проекта

```
lampa/
├── backend/
│   ├── server.js               # Node.js сервер
│   ├── package.json            # Зависимости
│   └── install-service.sh      # Установка systemd сервиса
├── js/
│   └── nws-client-es5.js       # WebSocket клиент
├── online.js                   # Основной скрипт онлайн-просмотра
├── shots.js                    # Скрипт скриншотов
├── trailer.js                  # Скрипт трейлеров
├── README.md                   # Эта документация
└── BACKEND_SETUP.md            # Подробная инструкция
```

## Особенности

- ✅ Локальный бэкенд на Node.js - полный контроль над данными
- ✅ Независимость от сторонних серверов (кроме балансеров)
- ✅ Локальное кеширование для быстрой работы
- ✅ Поддержка WebSocket (RCH) для обхода CORS
- ✅ Все зависимости в проекте
- ✅ Автозапуск через systemd

## Документация

Подробная инструкция по настройке: [BACKEND_SETUP.md](BACKEND_SETUP.md)

## Балансеры (источники видео)

Сервер поддерживает следующие источники:
- Kodik
- Collaps
- VideoCDN
- Filmix
- Rezka
- VideoDB
- Alloha
- AniLibria
- AnimeGO
- KinoPub

## Доступ через VPS

Для доступа извне через VPS с Nginx reverse proxy:

1. Настройте SSH туннель или WireGuard
2. На VPS настройте Nginx proxy_pass на ваш сервер
3. Обновите `online.js` с URL вашего VPS

См. подробную инструкцию в [BACKEND_SETUP.md](BACKEND_SETUP.md).

## API эндпоинты

- `GET /` - информация о сервере
- `GET /lite/events` - список балансеров
- `GET /lite/:balanser` - поиск фильмов
- `GET /lite/withsearch` - балансеры с поиском
- `GET /externalids` - внешние ID фильмов
- `GET /health` - проверка здоровья


# Lampa Plugin

Плагин для приложения Lampa с функцией онлайн-просмотра.

## Компоненты

### Фронтенд (GitHub Pages)
- `online.js` - основной скрипт для онлайн-просмотра видео
- `shots.js` - скрипт для управления кнопкой скриншотов
- `trailer.js` - скрипт для управления кнопкой трейлера
- `js/nws-client-es5.js` - WebSocket клиент

### Бэкенд (локальный Lampac)
- `docker-compose.yml` - конфигурация Docker для запуска Lampac
- `lampac-config.yml` - шаблон конфигурации Lampac
- Порт: **9876**

## Быстрый старт

### 1. Запуск бэкенда

```bash
cd /root/lampa
docker compose up -d
```

### 2. Настройка online.js

Откройте `online.js` и замените `YOUR_SERVER_IP` на ваш IP или домен:

```javascript
var Defined = {
  api: 'lampac',
  localhost: 'http://YOUR_SERVER_IP:9876/',
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
├── docker-compose.yml          # Docker конфигурация бэкенда
├── lampac-config.yml           # Шаблон конфигурации Lampac
├── lampac-data/                # Данные Lampac (создаётся автоматически)
├── js/
│   └── nws-client-es5.js       # WebSocket клиент
├── online.js                   # Основной скрипт онлайн-просмотра
├── shots.js                    # Скрипт скриншотов
├── trailer.js                  # Скрипт трейлеров
├── README.md                   # Эта документация
└── BACKEND_SETUP.md            # Подробная инструкция по настройке
```

## Особенности

- ✅ Локальный бэкенд - полный контроль над данными
- ✅ Независимость от сторонних серверов (кроме балансеров)
- ✅ Локальное кеширование для быстрой работы
- ✅ Поддержка WebSocket (RCH) для обхода CORS
- ✅ Все зависимости в проекте

## Документация

Подробная инструкция по развёртыванию и настройке: [BACKEND_SETUP.md](BACKEND_SETUP.md)

## Балансеры (источники видео)

Lampac автоматически подключает популярные источники:
- kodik.cc
- collabs.work
- videocdn.tv
- filmix.co
- rezka.ag
- videodb
- и другие

Для некоторых источников требуется получить API ключи (см. BACKEND_SETUP.md).

## Доступ через VPS

Для доступа извне используйте SSH туннель или WireGuard + Nginx reverse proxy.

См. подробную инструкцию в [BACKEND_SETUP.md](BACKEND_SETUP.md).


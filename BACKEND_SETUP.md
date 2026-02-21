# Lampac Backend - Инструкция по развёртыванию

## Быстрый старт

### 1. Запуск Lampac

```bash
cd /root/lampa
docker compose up -d
```

Или если нет docker compose:
```bash
docker run -d -p 9876:8080 --restart unless-stopped --name lampac -v /root/lampa/lampac-data:/app/data dimagol/lampac
```

### 2. Проверка работы

```bash
curl http://localhost:9876/
```

Должен вернуться HTML с информацией о сервере.

### 3. Настройка online.js

Откройте файл `online.js` и замените `YOUR_SERVER_IP` на:
- **Локально:** `localhost` или `127.0.0.1`
- **Для доступа из сети:** Ваш внешний IP или домен

```javascript
var Defined = {
  api: 'lampac',
  localhost: 'http://YOUR_SERVER_IP:9876/',
  apn: ''
};
```

### 4. Настройка доступа через VPS

#### На твоей машине (где запущен Lampac):

**Вариант A: SSH туннель**
```bash
# Постоянный туннель через autossh
apt install autossh
autossh -M 0 -N -R 9876:localhost:9876 user@your-vps-ip -o ServerAliveInterval=60 -o ServerAliveCountMax=3
```

**Вариант B: WireGuard** (рекомендуется для постоянного использования)
```bash
# Установить WireGuard
apt install wireguard

# Сгенерировать ключи
wg genkey | tee /etc/wireguard/private.key | wg pubkey > /etc/wireguard/public.key

# Настроить интерфейс /etc/wireguard/wg0.conf
# (см. документацию WireGuard)
```

#### На VPS (Nginx конфигурация):

```nginx
server {
    listen 80;
    server_name your-domain.ru;

    # Для HTTPS раскомментируйте и настройте SSL
    # listen 443 ssl http2;
    # ssl_certificate /etc/letsencrypt/live/your-domain.ru/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/your-domain.ru/privkey.pem;

    location /api/ {
        # Для SSH туннеля
        proxy_pass http://127.0.0.1:9876/;
        
        # Для WireGuard (если Lampac на 10.0.0.2)
        # proxy_pass http://10.0.0.2:9876/;
        
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Для WebSocket (RCH)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Таймауты
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Отключаем буферизацию для стриминга
        proxy_buffering off;
        proxy_cache off;
    }
}
```

После настройки Nginx:
```bash
nginx -t && nginx -s reload
```

### 5. Обновление online.js для работы через VPS

В файле `online.js` укажите адрес вашего VPS:

```javascript
var Defined = {
  api: 'lampac',
  localhost: 'https://your-vps-domain.ru/api/',
  apn: ''
};
```

### 6. Получение HTTPS сертификата (рекомендуется)

```bash
# На VPS
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.ru
```

---

## Управление Lampac

### Просмотр логов
```bash
docker logs -f lampac
```

### Перезапуск
```bash
docker restart lampac
```

### Остановка
```bash
docker stop lampac
```

### Обновление
```bash
docker pull dimagol/lampac
docker restart lampac
```

### Удаление
```bash
docker stop lampac && docker rm lampac
```

---

## Структура проекта

```
lampa/
├── docker-compose.yml          # Docker конфигурация
├── lampac-config.yml           # Шаблон конфигурации Lampac
├── lampac-data/                # Данные Lampac (создаётся автоматически)
│   ├── lampac.db               # База данных
│   └── cache/                  # Кэш
├── js/
│   └── nws-client-es5.js       # WebSocket клиент
├── online.js                   # Основной скрипт (требует настройки IP)
├── shots.js                    # Скрипт скриншотов
├── trailer.js                  # Скрипт трейлеров
└── README.md                   # Документация
```

---

## Настройка балансеров (источников видео)

Lampac автоматически подключает популярные источники:
- kodik.cc
- collabs.work
- videocdn.tv
- filmix.co
- rezka.ag
- videodb
- и другие

Для некоторых источников требуется получить API ключи:

### Kodik
1. Зарегистрируйтесь на https://kodik.cc/
2. Получите API ключ в личном кабинете
3. Добавьте в конфиг Lampac:
```yaml
sources:
  kodik:
    enabled: true
    api_key: "your-kodik-api-key"
```

### Collabs
1. Зарегистрируйтесь на https://collabs.work/
2. Получите API ключ
3. Добавьте в конфиг:
```yaml
sources:
  collabs:
    enabled: true
    api_key: "your-collabs-api-key"
```

---

## Решение проблем

### Lampac не запускается
```bash
docker logs lampac
# Проверьте, не занят ли порт 9876
netstat -tlnp | grep 9876
```

### Нет видео от балансеров
1. Проверьте логи Lampac
2. Убедитесь, что у источников есть API ключи
3. Проверьте доступность источников:
```bash
curl https://kodik.cc/
curl https://collabs.work/
```

### CORS ошибки в браузере
Убедитесь, что в конфиге Lampac включён CORS:
```yaml
cors:
  enabled: true
  origins:
    - "*"
```

### WebSocket не подключается
Проверьте, что Nginx правильно настроен для WebSocket:
```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

---

## Безопасность

### Ограничение доступа по API ключу

1. В конфиге Lampac:
```yaml
security:
  api_key: "your-secret-api-key"
```

2. В `online.js` добавьте заголовок:
```javascript
headers: {'X-API-Key': 'your-secret-api-key'}
```

### Ограничение доступа по IP

В Nginx на VPS:
```nginx
location /api/ {
    allow 1.2.3.4;  # Разрешить только твой IP
    deny all;
    proxy_pass http://127.0.0.1:9876/;
}
```

---

## Мониторинг

### Статус контейнера
```bash
docker stats lampac
```

### Использование ресурсов
```bash
docker inspect lampac | grep -A 20 State
```

### Логи в реальном времени
```bash
docker logs -f lampac --tail 100
```

---

## Полезные ссылки

- Lampac GitHub: https://github.com/Dimagol/lampac
- Lampac Docker Hub: https://hub.docker.com/r/dimagol/lampac
- Документация Lampac: https://github.com/Dimagol/lampac/wiki
- Балансеры API: https://github.com/Dimagol/lampac#sources

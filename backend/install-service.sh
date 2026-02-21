#!/bin/bash
# Скрипт установки systemd сервиса для Lampa Backend

cat > /etc/systemd/system/lampa-backend.service << 'EOF'
[Unit]
Description=Lampa Backend Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/lampa/backend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=PORT=9876
Environment=NODE_ENV=production

# для доступа извне (все интерфейсы)
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

# Перезагружаем systemd и запускаем сервис
systemctl daemon-reload
systemctl enable lampa-backend
systemctl restart lampa-backend

echo "Lampa Backend сервис установлен и запущен!"
systemctl status lampa-backend

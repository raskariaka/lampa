(function() {
    'use strict';

    // Имя ключа для хранения
    var storage_key = 'hide_shots_enabled';
    var interval_id = null;

    // Функции ES5
    function hideShots() {
        var buttons = document.querySelectorAll('.card__shots');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.display = 'none';
        }
    }

    function showShots() {
        var buttons = document.querySelectorAll('.card__shots');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.display = '';
        }
    }

    function applyFlag(enabled) {
        try {
            if (interval_id) clearInterval(interval_id);
            if (enabled) {
                hideShots();
                interval_id = setInterval(function() {
                    try {
                        hideShots();
                    } catch(e) {}
                }, 1000);
            } else {
                showShots();
            }
        } catch(e) {}
    }

    function safeInit() {
        try {
            if (!window.Lampa || !Lampa.Settings || !Lampa.Storage) {
                // Если ещё не готово, пробуем через 500 мс
                setTimeout(safeInit, 500);
                return;
            }

            var enabled = Lampa.Storage.get(storage_key, false);

            // Добавляем пункт в меню
            try {
                Lampa.Settings.add({
                    title: 'Удалять Shots',
                    type: 'toggle',
                    default: false,
                    onChange: function(value) {
                        try {
                            Lampa.Storage.set(storage_key, value);
                            applyFlag(value);
                        } catch(e) {}
                    }
                });
            } catch(e) {}

            // Применяем текущее значение
            applyFlag(enabled);

            console.log('[HideShots] plugin loaded');
        } catch(e) {
            console.error('[HideShots] init error', e);
        }
    }

    // Ждём lampa:ready
    if (window.Lampa) {
        setTimeout(safeInit, 500);
    } else {
        document.addEventListener('lampa:ready', function() {
            setTimeout(safeInit, 500);
        });
    }

})();

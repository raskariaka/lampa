(function() {
    'use strict';

    var storage_key = 'plugin_shots_enabled';
    var interval_id = null;

    // Скрыть кнопки
    function hideShots() {
        var buttons = document.querySelectorAll('.card__shots');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.display = 'none';
        }
    }

    // Показать кнопки
    function showShots() {
        var buttons = document.querySelectorAll('.card__shots');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.display = '';
        }
    }

    // Применить текущий флаг
    function applyFlag(enabled) {
        if (interval_id) clearInterval(interval_id);

        if (enabled) {
            hideShots();
            interval_id = setInterval(function() {
                try { hideShots(); } catch(e) {}
            }, 500);
            console.log('[Shots] hidden');
        } else {
            showShots();
            console.log('[Shots] visible');
        }
    }

    // Инициализация настроек
    function initSettings() {
        try {
            if (!window.Lampa || !Lampa.Settings || !Lampa.Storage) {
                setTimeout(initSettings, 500);
                return;
            }

            // Состояние
            var enabled = Lampa.Storage.get(storage_key, false);

            // Новый пункт в основном меню Настроек
            Lampa.Settings.add({
                title: 'Shots',
                type: 'select',
                default: enabled ? 'Да' : 'Нет',
                options: ['Да','Нет'],
                onChange: function(value) {
                    var flag = value === 'Да';
                    Lampa.Storage.set(storage_key, flag);
                    applyFlag(flag);
                }
            });

            // Применяем текущее значение
            applyFlag(enabled);

            console.log('[Shots] plugin loaded');
        } catch(e) {
            console.error('[Shots] init error', e);
        }
    }

    // Ждём Lampa
    if (window.Lampa) {
        setTimeout(initSettings, 500);
    } else {
        document.addEventListener('lampa:ready', function() {
            setTimeout(initSettings, 500);
        });
    }

})();

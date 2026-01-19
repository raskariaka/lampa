(function() {
    'use strict';

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
        if (interval_id) {
            clearInterval(interval_id);
            interval_id = null;
        }

        if (enabled) {
            hideShots();
            interval_id = setInterval(function() {
                if (document.querySelectorAll('.card__shots').length > 0) {
                    hideShots();
                }
            }, 500);
            console.log('[HideShots] Shots hidden');
        } else {
            showShots();
            console.log('[HideShots] Shots visible');
        }
    }

    function init() {
        if (!window.Lampa || !Lampa.Settings || !Lampa.Storage) return;

        var enabled = Lampa.Storage.get(storage_key, false);

        // Добавляем пункт в меню Расширений
        Lampa.Settings.add({
            title: 'Удалять Shots',
            type: 'toggle',
            default: false,
            onChange: function(value) {
                Lampa.Storage.set(storage_key, value);
                applyFlag(value);
            }
        });

        // Применяем текущее значение
        applyFlag(enabled);

        console.log('[HideShots] plugin loaded');
    }

    // Ждём полной загрузки Lampa
    if (window.Lampa) {
        setTimeout(init, 500); // небольшая задержка, чтобы все модули Lampa успели инициализироваться
    } else {
        document.addEventListener('lampa:ready', function() {
            setTimeout(init, 500);
        });
    }

})();

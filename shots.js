(function() {
    'use strict';

    var storage_key = 'hide_shots_enabled';
    var interval_id = null;

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
        if (interval_id) clearInterval(interval_id);

        if (enabled) {
            hideShots();
            interval_id = setInterval(hideShots, 500); // отслеживаем новые карточки
            console.log('[HideShots] Shots hidden');
        } else {
            showShots();
            console.log('[HideShots] Shots visible');
        }
    }

    function init() {
        if (!window.Lampa || !Lampa.Settings) return;

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

    if (window.Lampa) {
        init();
    } else {
        document.addEventListener('lampa:ready', init);
    }

})();

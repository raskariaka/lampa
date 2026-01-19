(function() {
    'use strict';

    var STORAGE_KEY = 'plugin_shots_enabled';
    var observer = null;

    // Функция удаления кнопок Shots
    function removeShotsButtons() {
        var els = document.querySelectorAll('.card__shots');
        for (var i = 0; i < els.length; i++) {
            if (els[i] && els[i].parentNode) {
                els[i].parentNode.removeChild(els[i]);
            }
        }
    }

    // Следим за динамически подгружаемыми карточками
    function startObserver(enabled) {
        if (observer) observer.disconnect();

        observer = new MutationObserver(function() {
            if (enabled) removeShotsButtons();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Применяем флаг
    function applyFlag(enabled) {
        window.plugin_shots_ready = !enabled; // true → показываем, false → скрываем
        if (enabled) removeShotsButtons();
        startObserver(enabled);
        console.log('[Shots Settings] applied hideShots=' + enabled);
    }

    // Инициализация плагина
    function init() {
        try {
            if (!window.Lampa || !Lampa.Settings || !Lampa.Storage) {
                setTimeout(init, 300);
                return;
            }

            // Читаем текущее значение
            var enabled = Lampa.Storage.get(STORAGE_KEY, false);
            applyFlag(enabled);

            // Добавляем пункт в Настройки с иконкой ⚡
            Lampa.Settings.add({
                title: 'Shots',
                component: 'settings', // добавляем в главное меню Настроек
                param: {
                    name: 'Удалить Shots',
                    type: 'toggle',
                    default: false,
                    icon: '⚡'
                },
                onChange: function(value) {
                    Lampa.Storage.set(STORAGE_KEY, value);
                    applyFlag(value);
                }
            });

            console.log('[Shots Settings] plugin loaded');
        } catch(e) {
            console.error('[Shots Settings] init error', e);
        }
    }

    if (window.Lampa) {
        setTimeout(init, 300);
    } else {
        document.addEventListener('lampa:ready', init);
    }

})();

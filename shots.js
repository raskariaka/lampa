(function() {
    'use strict';

    var STORAGE_KEY = 'hide_shots_enabled';
    var observer = null;

    // функция удаления Shots кнопок
    function removeShotsButtons() {
        var els = document.querySelectorAll('.card__shots');
        for (var i = 0; i < els.length; i++) {
            if (els[i] && els[i].parentNode) {
                els[i].parentNode.removeChild(els[i]);
            }
        }
    }

    // отслеживание DOM на новые карточки
    function startObserver(enabled) {
        if (observer) observer.disconnect();

        observer = new MutationObserver(function() {
            if (enabled) {
                removeShotsButtons();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // установка и применение флага
    function applySetting(enabled) {
        window.plugin_shots_ready = !enabled;
        if (enabled) removeShotsButtons();
        startObserver(enabled);
        console.log('[Shots UI] applied hideShots=' + enabled);
    }

    function initPlugin() {
        try {
            // проверяем API
            if (!window.Lampa || !Lampa.SettingsApi || !Lampa.Storage) {
                setTimeout(initPlugin, 300);
                return;
            }

            // читаем сохраненное
            var enabled = Lampa.Storage.get(STORAGE_KEY, false);
            applySetting(enabled);

            // регистрируем пункт настроек
            Lampa.SettingsApi.addParam({
                component: 'extensions',
                param: {
                    name: 'Удалить Shots',
                    type: 'toggle',
                    default: false
                },
                onChange: function(value) {
                    Lampa.Storage.set(STORAGE_KEY, value);
                    applySetting(value);
                }
            });

            console.log('[Shots UI] plugin loaded');

        } catch(e) {
            console.error('[Shots UI] init error', e);
        }
    }

    if (window.Lampa) {
        setTimeout(initPlugin, 300);
    } else {
        document.addEventListener('lampa:ready', initPlugin);
    }

})();

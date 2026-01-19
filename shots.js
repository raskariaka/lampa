(function() {
    'use strict';

    var storage_key = 'plugin_shots_enabled';
    var observer = null;

    // Скрытие/показ кнопок Shots
    function updateShots(enabled) {
        var buttons = document.querySelectorAll('.card__shots');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.display = enabled ? 'none' : '';
        }
    }

    // Следим за динамически подгружаемыми карточками
    function observeShots(enabled) {
        if(observer) observer.disconnect();

        observer = new MutationObserver(function(){
            updateShots(enabled);
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Установка флага для кнопок
    function applyFlag(enabled) {
        updateShots(enabled);
        observeShots(enabled);
        window.plugin_shots_ready = !enabled; // true → показываем, false → скрываем
        console.log('[Shots] plugin_shots_ready =', window.plugin_shots_ready);
    }

    // Инициализация настроек
    function init() {
        try {
            if (!window.Lampa || !Lampa.SettingsApi || !Lampa.Storage) {
                setTimeout(init, 500);
                return;
            }

            // Получаем текущее состояние
            var enabled = Lampa.Storage.get(storage_key, false);
            applyFlag(enabled);

            // Добавляем пункт в главное меню Настроек
            Lampa.SettingsApi.addParam({
                component: 'main', // Главное меню
                param: {
                    name: 'Shots',
                    type: 'toggle',
                    default: false
                },
                onChange: function(value) {
                    Lampa.Storage.set(storage_key, value);
                    applyFlag(value);
                }
            });

            console.log('[Shots] plugin loaded');
        } catch(e) {
            console.error('[Shots] init error', e);
        }
    }

    if (window.Lampa) {
        setTimeout(init, 500);
    } else {
        document.addEventListener('lampa:ready', function(){
            setTimeout(init, 500);
        });
    }

})();

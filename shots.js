(function() {
    'use strict';

    var storage_key = 'plugin_shots_enabled';
    var observer = null;

    // Удаляем кнопки Shots из DOM
    function removeShots() {
        var buttons = document.querySelectorAll('.card__shots');
        for (var i = 0; i < buttons.length; i++) {
            var btn = buttons[i];
            if (btn && btn.parentNode) {
                btn.parentNode.removeChild(btn);
            }
        }
    }

    // Следим за новыми карточками
    function observeShots(enabled) {
        if(observer) observer.disconnect();

        observer = new MutationObserver(function(){
            if(enabled) removeShots();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Применяем флаг
    function applyFlag(enabled) {
        window.plugin_shots_ready = !enabled; // true → показываем, false → скрываем
        if(enabled) removeShots();
        observeShots(enabled);
        console.log('[Shots] plugin_shots_ready =', window.plugin_shots_ready);
    }

    // Инициализация плагина
    function init() {
        try {
            if(!window.Lampa || !Lampa.SettingsApi || !Lampa.Storage){
                setTimeout(init, 500);
                return;
            }

            // Получаем текущее значение
            var enabled = Lampa.Storage.get(storage_key, false);
            applyFlag(enabled);

            // Добавляем пункт в главное меню Настроек с иконкой ⚡
            Lampa.SettingsApi.addParam({
                component: 'main',
                param: {
                    name: 'Shots',
                    type: 'toggle',
                    icon: '⚡',
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

    if(window.Lampa){
        setTimeout(init, 500);
    } else {
        document.addEventListener('lampa:ready', function(){
            setTimeout(init, 500);
        });
    }

})();

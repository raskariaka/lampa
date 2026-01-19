(function () {
    'use strict';

    var plugin_name = 'Shots';
    var storage_key = 'shots_ready_enabled';

    function set_flag(value) {
        window.plugin_shots_ready = value === true;
        console.log('[ShotsReady]', 'plugin_shots_ready =', window.plugin_shots_ready);
    }

    function init() {
        // Загружаем сохранённое значение
        var enabled = Lampa.Storage.get(storage_key, false);

        set_flag(enabled);

        // Регистрируем настройку
        Lampa.SettingsApi.addParam({
            component: 'extensions',
            param: {
                name: plugin_name,
                type: 'toggle',
                default: false
            },
            onChange: function (value) {
                Lampa.Storage.set(storage_key, value);
                set_flag(value);
            }
        });
    }

    // Официальное ожидание запуска LAMPA
    if (window.Lampa) {
        init();
    } else {
        document.addEventListener('lampa:ready', init);
    }

})();

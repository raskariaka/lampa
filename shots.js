(function () {
    'use strict';

    var plugin_name = 'Shots Ready';
    var storage_key = 'shots_ready_enabled';

    function set_flag(value) {
        window.plugin_shots_ready = value === true;
        console.log('[ShotsReady]', window.plugin_shots_ready);
    }

    function init() {
        var enabled = Lampa.Storage.get(storage_key, false);

        set_flag(enabled);

        Lampa.Settings.add({
            title: plugin_name,
            type: 'toggle',
            default: false,
            onChange: function (value) {
                Lampa.Storage.set(storage_key, value);
                set_flag(value);
            }
        });
    }

    if (window.Lampa && Lampa.Settings) {
        init();
    } else {
        document.addEventListener('lampa:ready', init);
    }

})();

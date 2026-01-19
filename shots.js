(function () {
    'use strict';

    function init() {
        window.plugin_shots_ready = true;
        console.log('[ShotsReady] plugin_shots_ready = false');
    }

    if (window.Lampa) {
        init();
    } else {
        document.addEventListener('lampa:ready', init);
    }

})();

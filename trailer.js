(function() {
    'use strict';
    function start() {
        if (window.remove_trailer_button) return;
        window.remove_trailer_button = true;
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                setTimeout(function() {
                    // Удаляем кнопку трейлеров
                    $('.trailer-view-button').remove();
                }, 100);
            }
        });
    }
    if (window.appready) {
        start();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') start();
        });
    }
})();

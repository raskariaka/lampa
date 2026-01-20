(function() {
    'use strict';
    function start() {
        if (window.remove_trailer_button) return;
        window.remove_trailer_button = true;
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                setTimeout(function() {
                    // Пробуем несколько возможных селекторов для трейлеров
                    var selectors = [
                        '.trailer-view-button',           // Основной селектор из LAMPA
                        '[data-action="trailer"]',       // По data-атрибуту
                        '.action-trailer',               // Альтернативный класс
                        '.trailer-button'                // Еще один возможный вариант
                    ];
                    
                    selectors.forEach(function(selector) {
                        $(selector).remove();
                    });
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

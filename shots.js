(function() {
    'use strict';

    function patchCard() {
        if (!window.Lampa || !Lampa.Card) return;

        // Сохраняем оригинальный метод добавления действий
        var originalAddAction = Lampa.Card.addAction;

        // Патчим метод, чтобы блокировать Shots
        Lampa.Card.addAction = function(params) {
            if (params && params.name === 'shots') {
                console.log('[HideShots] blocked Shots button');
                return; // не добавляем кнопку
            }
            return originalAddAction.apply(this, arguments);
        };

        console.log('[HideShots] plugin loaded');
    }

    // Если Lampa уже инициализирована
    if (window.Lampa) {
        patchCard();
    } else {
        // Ждём полной инициализации Lampa
        document.addEventListener('lampa:ready', patchCard);
    }

})();

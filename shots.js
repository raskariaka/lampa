(function() {
    'use strict';

    // Функция для патча Lampa.Card
    function patchCard() {
        if (!window.Lampa || !Lampa.Card) return;

        // Сохраняем оригинальный метод добавления действий
        var originalAddAction = Lampa.Card.prototype.addAction;

        Lampa.Card.prototype.addAction = function(action) {
            // Если это кнопка Shots, не добавляем её
            if (action && action.id === 'shots') {
                return;
            }

            // Вызов оригинального метода для остальных действий
            return originalAddAction.call(this, action);
        };

        console.log('[Shots Patch] Card.addAction patched: Shots button removed');
    }

    // Инициализация плагина
    function init() {
        if (window.Lampa && Lampa.Card) {
            patchCard();
        } else {
            document.addEventListener('lampa:ready', patchCard);
        }
    }

    init();

})();

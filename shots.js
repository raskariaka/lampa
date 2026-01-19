(function() {
    'use strict';

    var observer = null;

    // Функция удаления всех кнопок Shots
    function removeShotsButtons() {
        var buttons = document.querySelectorAll('.card__shots');
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i] && buttons[i].parentNode) {
                buttons[i].parentNode.removeChild(buttons[i]);
            }
        }
    }

    // Наблюдение за динамически подгружаемыми карточками
    function startObserver() {
        if (observer) observer.disconnect();

        observer = new MutationObserver(function() {
            removeShotsButtons();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Инициализация
    function init() {
        try {
            // Удаляем кнопки сразу после загрузки
            removeShotsButtons();

            // Запускаем наблюдение за новыми карточками
            startObserver();

            console.log('[Shots Remove] plugin loaded: all Shots buttons removed');
        } catch(e) {
            console.error('[Shots Remove] init error', e);
        }
    }

    if (window.Lampa) {
        setTimeout(init, 300);
    } else {
        document.addEventListener('lampa:ready', init);
    }

})();

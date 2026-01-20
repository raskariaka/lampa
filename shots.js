(function() {
    'use strict';

    // Функция, которая ищет и удаляет кнопку Shots
    function removeShotsButtons() {
        // Ищем элементы, которые выглядят как действие "shots"
        var btns = document.querySelectorAll('[data-action="shots"]');

        for (var i = 0; i < btns.length; i++) {
            var el = btns[i];

            // Дополнительно проверяем текст или aria-label, если нужно
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }
    }

    // Начать наблюдение за DOM
    function startObserver() {
        var observer = new MutationObserver(function() {
            removeShotsButtons();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Инициализация
    function init() {
        try {
            removeShotsButtons();
            startObserver();
            console.log('[ShotsRemover] initialized');
        } catch (e) {
            console.error('[ShotsRemover] init error', e);
        }
    }

    if (window.Lampa) {
        setTimeout(init, 500);
    } else {
        document.addEventListener('lampa:ready', init);
    }
})();

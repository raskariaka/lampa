(function() {
    'use strict';

    // Функция удаления кнопки Shots
    function removeShotsButtons() {
        // Пробуем несколько возможных селекторов
        var selectors = [
            '.shots-view-button',           // основной класс из remove-shots.js
            '[data-action="shots"]',        // ваш исходный селектор
            '.button-shots',                // возможный альтернативный класс
            '.action-shots'
        ];

        selectors.forEach(function(selector) {
            document.querySelectorAll(selector).forEach(function(el) {
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                    console.log('[RemoveShots] Удален элемент с селектором:', selector);
                }
            });
        });
    }

    // Основная функция запуска плагина
    function startPlugin() {
        // Защита от повторной инициализации
        if (window.remove_shots_plugin_loaded) return;
        window.remove_shots_plugin_loaded = true;

        // Способ 1: Слушаем событие загрузки карточки фильма (как в remove-shots.js)
        if (Lampa.Listener) {
            Lampa.Listener.follow('full', function(e) {
                if (e.type === 'complite' || e.type === 'complete') {
                    setTimeout(removeShotsButtons, 100);
                }
            });
            console.log('[RemoveShots] Используется Lampa.Listener');
        }

        // Способ 2: Наблюдатель за DOM как fallback
        var observer = new MutationObserver(function() {
            removeShotsButtons();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Первый запуск сразу после загрузки
        setTimeout(removeShotsButtons, 500);
    }

    // Регистрация плагина в системе LAMPA
    if (window.Lampa && Lampa.Plugins) {
        Lampa.Plugins.add({
            name: 'Remove Shots Button',
            description: 'Убирает кнопку Shots (нарезки) из карточки фильма',
            version: '1.0.0',
            start: startPlugin
        });
        console.log('[RemoveShots] Плагин зарегистрирован через Lampa.Plugins');
    } else {
        // Если Lampa.Plugins нет, инициализируем напрямую
        if (window.Lampa) {
            setTimeout(startPlugin, 500);
        } else {
            document.addEventListener('lampa:ready', startPlugin);
        }
    }
})();

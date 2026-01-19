(function() {
    'use strict';

    function hideShotsButtons() {
        var buttons = document.querySelectorAll('.card__shots'); // класс кнопки Shots
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.display = 'none';
        }
    }

    function init() {
        // Сразу скрываем уже существующие кнопки
        hideShotsButtons();

        // Следим за новыми карточками каждые 500 мс
        setInterval(hideShotsButtons, 500);

        console.log('[HideShots] plugin loaded');
    }

    if (window.Lampa) {
        init();
    } else {
        document.addEventListener('lampa:ready', init);
    }

})();

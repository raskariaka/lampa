(function() {
    'use strict';
    function start() {
        if (window.remove_trailer_button_correct) return;
        window.remove_trailer_button_correct = true;
        
        // Точный селектор из DevTools
        var correctSelector = 'div.full-start__button.selector.view--trailer';
        
        function removeTrailerButton() {
            var trailerButton = document.querySelector(correctSelector);
            if (trailerButton && trailerButton.parentNode) {
                trailerButton.parentNode.removeChild(trailerButton);
                console.log('[RemoveTrailer] Кнопка трейлера успешно удалена');
                return true;
            }
            return false;
        }
        
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                // Несколько попыток с интервалами
                setTimeout(removeTrailerButton, 100);
                setTimeout(removeTrailerButton, 500);
                setTimeout(removeTrailerButton, 1000);
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

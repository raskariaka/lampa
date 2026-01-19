(function() {
    'use strict';

    var storage_key = 'plugin_shots_enabled';

    function setShotsFlag(enabled){
        window.plugin_shots_ready = !enabled; // true → показываем, false → скрываем
        console.log('[Shots] plugin_shots_ready =', window.plugin_shots_ready);
    }

    function init(){
        try{
            if(!window.Lampa || !Lampa.SettingsApi || !Lampa.Storage){
                setTimeout(init, 500);
                return;
            }

            // Сохраняем текущее значение
            var enabled = Lampa.Storage.get(storage_key, false);
            setShotsFlag(enabled);

            // Добавляем пункт в главное меню Настроек
            Lampa.SettingsApi.addParam({
                component: 'main', // добавляем в главное меню
                param: {
                    name: 'Shots',
                    type: 'toggle',
                    default: false
                },
                onChange: function(value){
                    Lampa.Storage.set(storage_key, value);
                    setShotsFlag(value);
                }
            });

            console.log('[Shots] plugin loaded');
        }catch(e){
            console.error('[Shots] init error', e);
        }
    }

    if(window.Lampa){
        setTimeout(init, 500);
    }else{
        document.addEventListener('lampa:ready', init);
    }

})();

// ==UserScript==
// @name         iamiphone
// @namespace    Violentmonkey Scripts
// @version      1
// @description  
// @match        *://*thetreasury*
// @grant        none
// @icon        
// @downloadURL  https://github.com/aastankeev/simple/raw/main/BL.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/BL.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
    'use strict';

    // Изменение User-Agent на мобильный
    Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36',
        configurable: true,
    });

    // Функция для изменения параметра tgWebAppPlatform на "android" для всех iframe
    function updateIframes() {
        document.querySelectorAll('iframe').forEach(el => {
            if (el.src.includes("tgWebAppPlatform")) {
                // Меняем параметр tgWebAppPlatform на "android"
                el.src = el.src.replace(/(tgWebAppPlatform=)[^&]+/, "$1android");
                console.log("Измененный src:", el.src);
            }
        });
    }

    // Запуск функции для всех iframe на текущей странице
    updateIframes();

    // Добавляем MutationObserver для отслеживания новых iframe
    const observer = new MutationObserver(updateIframes);
    observer.observe(document.body, { childList: true, subtree: true });

    // Остановка через 30 секунд
    setTimeout(() => {
        observer.disconnect();  // Отключаем observer
        console.log("Выполнение остановлено через 30 секунд");
    }, 30000);
})();

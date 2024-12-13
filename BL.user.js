// ==UserScript==
// @name         Bums launcher
// @namespace    Violentmonkey Scripts
// @version      6
// @description  30 сек / додумался как сделать тока для бомжа
// @match        *://*web.telegram.org/k/#?tgaddr=tg%3A%2F%2Fresolve%3Fdomain%3Dbums%26appname%3Dapp%26startapp%3Dref_kRO2nQAi*
// @grant        none
// @icon         https://app.bums.bot/favicon.ico
// @downloadURL https://github.com/aastankeev/simple/raw/main/BL.user.js
// @updateURL   https://github.com/aastankeev/simple/raw/main/BL.user.js
// @homepage    https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
    'use strict';

    // Функция для изменения параметра tgWebAppPlatform на "android" для всех iframe
    function updateIframes() {
        document.querySelectorAll('iframe').forEach(el => {
            if (el.src.includes("tgWebAppPlatform")) {
                // Меняем параметр tgWebAppPlatform на "android"
                el.src = el.src.replace(/(tgWebAppPlatform=)[^&]+/, "$1android");
            }
        });
    }

    // Запуск функции для всех iframe на текущей странице
    updateIframes();

    // Добавляем MutationObserver для отслеживания новых iframe
    const observer = new MutationObserver(updateIframes);
    observer.observe(document.body, { childList: true, subtree: true });

    // Остановка через 5 секунд
    setTimeout(() => {
        observer.disconnect();  // Отключаем observer
        console.log("Выполнение остановлено через 30 секунд");
    }, 30000);

})();


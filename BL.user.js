// ==UserScript==
// @name         Bums launcher
// @namespace    Violentmonkey Scripts
// @version      1
// @description  Скрипт для работы с приложением Bums Bot
// @match        *://*web.telegram.org/k/*
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
                // Удаляем вывод в консоль
                // console.log('-='.repeat(50));
                // console.log("Use this address in your browser:", el.src);
                // console.log('-='.repeat(50));
            }
        });
    }

    // Запуск функции для всех iframe на текущей странице
    updateIframes();

    // Добавляем MutationObserver для отслеживания новых iframe
    const observer = new MutationObserver(updateIframes);
    observer.observe(document.body, { childList: true, subtree: true });

// Запускаем функцию
upgradeFirstTabSkills();

})();


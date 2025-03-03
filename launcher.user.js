// ==UserScript==
// @name        launche
// @namespace   Violentmonkey Scripts
// @version     16
// @description добавлен перезапуск поиска launche кнопки если она не нажалась\ переход на телеграм версию A теперь кнопка конфирм
// @downloadURL https://github.com/aastankeev/simple/raw/main/launcher.user.js
// @updateURL   https://github.com/aastankeev/simple/raw/main/launcher.user.js
// @homepage    https://github.com/aastankeev/simple
// @icon        https://telegram.org/favicon.ico
// @match       *://*web.telegram.org/*
// @grant       none
// @author      lab404
// ==/UserScript==

(function() {
    'use strict';

    // Функция для поиска и клика по элементу
    function clickPopupButton() {
        // Ищем элемент по селектору
        const button = document.querySelector('.popup-button.btn.primary.rp');

        // Если элемент найден, кликаем по нему
        if (button) {
            button.click();
        }
    }

    // Запускаем функцию каждые 500 миллисекунд (0.5 секунды)
    setInterval(clickPopupButton, 500);
})();

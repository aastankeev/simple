// ==UserScript==
// @name         telegram apps center
// @namespace    http://tampermonkey.net/
// @version      4
// @description
// @author
// @match        *://*tappscenter.org/*
// @grant        none
// @icon         https://tappscenter.org/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/tac.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/tac.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function () {
    'use strict';

    // Флаг для отслеживания появления элемента
    let elementFound = false;

    // Функция для проверки наличия элемента каждые 1 секунду
    const interval = setInterval(() => {
        const element = document.querySelector('.StreaksBanner_root__k2yVY .StreaksBanner_panel__iNkBw .styles_tapHighLight__adwkg.StreaksBanner_panelInner__rqKQg.styles_rippleContainer__y7gWh');
        if (element) {
            element.click(); // Клик по элементу
            elementFound = true;
            clearInterval(interval); // Остановка проверки
            console.log('Элемент найден и клик выполнен.');
        } else {
            console.log('Элемент не найден, повторная проверка...');
        }
    }, 1000);

    // Опционально: остановить таймер через определенное время, если элемент не найден
    setTimeout(() => {
        if (!elementFound) {
            clearInterval(interval);
            console.log('Элемент не найден за заданное время.');
        }
    }, 60000); // 60 секунд на поиск
})();

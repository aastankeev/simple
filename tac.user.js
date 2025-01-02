// ==UserScript==
// @name         telegram apps center
// @namespace    http://tampermonkey.net/
// @version      3
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

    // Функция для проверки наличия элемента каждые 5 секунд
    const interval = setInterval(() => {
        const element = document.querySelector('.styles_tapHighLight__adwkg.StreaksBanner_panelInner__rqKQg.styles_rippleContainer__y7gWh');
        if (element) {
            element.click(); // Клик по элементу
            elementFound = true;
            clearInterval(interval); // Остановка проверки
            console.log('Элемент найден и клик выполнен.');
        }
    }, 1000);
})();

// ==UserScript==
// @name         telegram apps center
// @namespace    http://tampermonkey.net/
// @version      1
// @description
// @author       
// @match        https://web.telegram.org/k/#?tgaddr=tg%3A%2F%2Fresolve%3Fdomain%3Dtapps%26appname%3Dapp%26startapp%3Dref_1_26704
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
    }, 5000);

    // Опционально: остановить таймер через определенное время, если элемент не найден
    setTimeout(() => {
        if (!elementFound) {
            clearInterval(interval);
            console.log('Элемент не найден за заданное время.');
        }
    }, 60000); // 60 секунд на поиск
})();

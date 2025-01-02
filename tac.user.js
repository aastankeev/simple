// ==UserScript==
// @name         telegram apps center
// @namespace    http://tampermonkey.net/
// @version      5
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

    let elementFound = false;
    let openButtonClicked = false;

    const interval = setInterval(() => {
        const element = document.querySelector('.StreaksBanner_root__k2yVY .StreaksBanner_panel__iNkBw .styles_tapHighLight__adwkg.StreaksBanner_panelInner__rqKQg.styles_rippleContainer__y7gWh');
        if (element) {
            element.click(); // Клик по элементу
            elementFound = true;
            clearInterval(interval); // Остановка проверки
            console.log('Элемент найден и клик выполнен.');

            // Переход к следующему действию после клика
            findOpenButton();
        } else {
            console.log('Элемент не найден, повторная проверка...');
        }
    }, 1000);

    // Функция для поиска кнопки "Открыть"
    function findOpenButton() {
        if (!openButtonClicked) {
            const openButton = Array.from(document.querySelectorAll('span')).find(span => span.textContent.trim() === 'Открыть');
            if (openButton) {
                const delay = Math.floor(Math.random() * 4000) + 2000; // Задержка от 2 до 5 секунд
                console.log(`Ожидаем ${delay / 1000} секунд...`);

                setTimeout(() => {
                    openButton.click();
                    openButtonClicked = true; // Устанавливаем флаг
                    console.log('Кнопка "Открыть" кликнута.');

                    // Начинаем повторять действия каждые 5 секунд
                    setInterval(() => {
                        const repeatButton = Array.from(document.querySelectorAll('span')).find(span => span.textContent.trim() === 'Открыть');
                        if (repeatButton) {
                            repeatButton.click();
                            console.log('Кнопка "Открыть" повторно кликнута.');
                        } else {
                            console.log('Кнопка "Открыть" не найдена для повторного клика.');
                        }
                    }, 5000); // Повторение каждую 5 секунд
                }, delay);
            } else {
                console.log('Кнопка "Открыть" не найдена.');
            }
        } else {
            console.log('Кнопка "Открыть" уже была кликнута.');
        }
    }
})();



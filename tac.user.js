// ==UserScript==
// @name         telegram apps center
// @namespace    http://tampermonkey.net/
// @version      7
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
        // Обновленный селектор для "тапки"
        const element = document.querySelector('div#root > main._main_1mga0_1 > div > div > section._root_1xgdu_1 > div._panel_1xgdu_18._panelClickable_1xgdu_28 > div._tapHighLight_1kuuw_17._panelInner_1xgdu_25._rippleContainer_1kuuw_1 > h1._font-weight-bold_obdc4_2._h1_obdc4_22._title_1xgdu_33');
        if (element) {
            element.click(); // Клик по элементу (открытие "тапки")
            elementFound = true;
            clearInterval(interval); // Остановка проверки
            console.log('Элемент "тапки" найден и клик выполнен.');

            // Переход к следующему действию после клика
            findOpenButton();
        } else {
            console.log('Элемент "тапки" не найден, повторная проверка...');
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
                            console.log('Кнопка "Открыть" не найдена для повторного клика. Завершаем работу.');
                            clearInterval(repeatInterval); // Останавливаем повторяющийся процесс
                             console.log('Работа скрипта остановлена.');
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

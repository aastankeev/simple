// ==UserScript==
// @name         telegram apps center
// @namespace    http://tampermonkey.net/
// @version      9
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

    let diamondLeagueClicked = false;
    let openButtonClicked = false;

    // Сначала ждем появления ссылки Diamond League и кликаем по ней
    const diamondLeagueInterval = setInterval(() => {
        const diamondLink = document.querySelector('a.navbar__search-voting-control.navbar__search-voting-control--league[href="/twa/streaks"]');
        if (diamondLink) {
            clearInterval(diamondLeagueInterval);
            diamondLeagueClicked = true;
            diamondLink.click();
            console.log('Клик по ссылке Diamond League выполнен.');

            // После клика начинаем искать кнопку "Открыть" с задержкой
            setTimeout(() => {
                findOpenButton();
            }, 2000); // Задержка для загрузки интерфейса
        }
    }, 1000);

    function findOpenButton() {
        if (!openButtonClicked) {
            const openButton = Array.from(document.querySelectorAll('span')).find(span => span.textContent.trim() === 'Открыть');
            if (openButton) {
                const delay = Math.floor(Math.random() * 4000) + 2000;
                console.log(`Ожидаем ${delay / 1000} секунд...`);

                setTimeout(() => {
                    openButton.click();
                    openButtonClicked = true;
                    console.log('Кнопка "Открыть" кликнута.');

                    const repeatInterval = setInterval(() => {
                        const repeatButton = Array.from(document.querySelectorAll('span')).find(span => span.textContent.trim() === 'Открыть');
                        if (repeatButton) {
                            repeatButton.click();
                            console.log('Кнопка "Открыть" повторно кликнута.');
                        } else {
                            console.log('Кнопка "Открыть" не найдена для повторного клика. Завершаем работу.');
                            clearInterval(repeatInterval);
                            console.log('Работа скрипта остановлена.');
                        }
                    }, 5000);
                }, delay);
            } else {
                console.log('Кнопка "Открыть" не найдена.');
            }
        } else {
            console.log('Кнопка "Открыть" уже была кликнута.');
        }
    }
})();

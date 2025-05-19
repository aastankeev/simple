// ==UserScript==
// @name         telegram apps center
// @namespace    http://tampermonkey.net/
// @version      8
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

    // Функция для клика по навбару лиги
    function clickNavbarLeagueLink() {
        const observer = new MutationObserver((mutations, obs) => {
            const link = document.querySelector('a.navbar__search-voting-control--league[href="/twa/streaks"]');
            if (link) {
                link.click();
                console.log('Навигация Diamond League кликнута');
                obs.disconnect(); // Останавливаем наблюдение после клика
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    const interval = setInterval(() => {
        const element = document.querySelector('div#root > main._main_1mga0_1 > div > div > section._root_1xgdu_1 > div._panel_1xgdu_18._panelClickable_1xgdu_28 > div._tapHighLight_1kuuw_17._panelInner_1xgdu_25._rippleContainer_1kuuw_1 > h1._font-weight-bold_obdc4_2._h1_obdc4_22._title_1xgdu_33');
        if (element) {
            element.click();
            elementFound = true;
            clearInterval(interval);
            console.log('Элемент "тапки" найден и клик выполнен.');

            // Запускаем поиск кнопки "Открыть" и навбара
            findOpenButton();
            
            // Запускаем проверку для навбара через 3 секунды
            setTimeout(clickNavbarLeagueLink, 3000);
            
            // Повторяем проверку навбара каждые 5 секунд
            setInterval(clickNavbarLeagueLink, 5000);
        }
    }, 1000);

    // Остальной код функции findOpenButton() остается без изменений
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

                    setInterval(() => {
                        const repeatButton = Array.from(document.querySelectorAll('span')).find(span => span.textContent.trim() === 'Открыть');
                        if (repeatButton) {
                            repeatButton.click();
                            console.log('Кнопка "Открыть" повторно кликнута.');
                        }
                    }, 5000);
                }, delay);
            }
        }
    }
})();

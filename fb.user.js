// ==UserScript==
// @name         findbtc
// @namespace    Violentmonkey Scripts
// @version      3
// @description  Ожидание кнопки "Бонусы" и нажатие на рекламу
// @match        https://web.telegram.org/k/#?tgaddr=tg%3A%2F%2Fresolve%3Fdomain%3Dbtctma_bot%26appname%3Dapp%26startapp%3D707981986
// @grant        none
// @icon         https://cdn-icons-png.flaticon.com/128/5128/5128439.png
// @downloadURL  https://github.com/aastankeev/simple/raw/main/fb.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/fb.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

// ==UserScript==
// @name         Авто-бонус и реклама
// @namespace    Violentmonkey Scripts
// @version      1.2
// @description  Ожидание кнопки "Бонусы" и нажатие на рекламу
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let bonusClicked = false;

    function checkButton(selector, callback) {
        console.log(`Проверяем наличие кнопки: ${selector}`);
        const button = document.querySelector(selector);
        if (button && !bonusClicked) {
            console.log(`Кнопка найдена: ${selector}`);
            bonusClicked = true;
            callback(button);
        }
    }

    function waitForButton(selector, callback) {
        console.log(`Ожидание кнопки: ${selector}`);
        
        // Проверяем кнопку каждые 500 мс, если observer не сработал
        const interval = setInterval(() => checkButton(selector, callback), 500);
        
        const observer = new MutationObserver(() => {
            checkButton(selector, (button) => {
                clearInterval(interval);
                observer.disconnect();
                callback(button);
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    waitForButton('button.Touch.css-10ilq54.e2vyh741', (bonusButton) => {
        console.log('Нажимаем кнопку "Бонусы"');
        bonusButton.click();
        
        setTimeout(() => {
            console.log('Ищем кнопку "Смотреть рекламу"');
            const adButton = document.querySelector('button.Touch.css-l56sm2.e1hualo72');
            if (adButton) {
                console.log('Нажимаем кнопку "Смотреть рекламу"');
                adButton.click();
            } else {
                console.error('Кнопка "Смотреть рекламу" не найдена');
            }
        }, Math.random() * 2000 + 1000); // 1-3 секунды
    });
})();

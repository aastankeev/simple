// ==UserScript==
// @name         findbtc
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Ожидание кнопки "Бонусы" и нажатие на рекламу
// @match        https://web.telegram.org/k/#?tgaddr=tg%3A%2F%2Fresolve%3Fdomain%3Dbtctma_bot%26appname%3Dapp%26startapp%3D707981986
// @grant        none
// @icon         https://iconduck.com/icons/82093/bitcoin-cryptocurrency
// @downloadURL  https://github.com/aastankeev/simple/raw/main/fb.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/fb.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
    'use strict';

    function waitForButton(selector, callback) {
        const observer = new MutationObserver(() => {
            const button = document.querySelector(selector);
            if (button) {
                observer.disconnect();
                callback(button);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    waitForButton('button.Touch.css-10ilq54.e2vyh741', (bonusButton) => {
        bonusButton.click();
        console.log('Кнопка "Бонусы" нажата!');
        
        setTimeout(() => {
            const adButton = document.querySelector('button.Touch.css-l56sm2.e1hualo72');
            if (adButton) {
                adButton.click();
                console.log('Кнопка "Смотреть рекламу" нажата!');
            } else {
                console.error('Кнопка "Смотреть рекламу" не найдена');
            }
        }, Math.random() * 2000 + 1000); // 1-3 секунды
    });
})();

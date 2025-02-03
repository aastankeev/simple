// ==UserScript==
// @name         findbtc
// @namespace    Violentmonkey Scripts
// @version      4
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

    const checkBonusButton = setInterval(() => { 
        const buttons = Array.from(document.querySelectorAll('button.Touch.css-10ilq54.e2vyh741'));
        const bonusButton = buttons.find(btn => btn.textContent.trim() === 'Бонусы');

        if (bonusButton) {
            console.log('Нашёл кнопку "Бонусы"!', bonusButton);
            bonusButton.click();
            clearInterval(checkBonusButton);

            // Ждём 1-3 секунды перед поиском кнопки "Смотреть рекламу"
            setTimeout(() => {
                const adButton = document.querySelector('button.Touch.css-l56sm2.e1hualo72');
                if (adButton) {
                    console.log('Нашёл кнопку "Смотреть рекламу"!', adButton);
                    adButton.click();
                } else {
                    console.log('Кнопка "Смотреть рекламу" не найдена...');
                }
            }, Math.random() * 2000 + 1000); // случайная задержка от 1 до 3 секунд
        } else {
            console.log('Кнопка "Бонусы" пока не найдена...');
        }
    }, 1000);
})();

        }, Math.random() * 2000 + 1000); // 1-3 секунды
    });
})();

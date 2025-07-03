// ==UserScript==
// @name         void
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Авто-клейм
// @author       lab404
// @match        *://*app.voidgame.io/*
// @grant        none
// @icon         https://app.voidgame.io/assets/favicon-CI8FsvaE.svg
// @downloadURL  https://github.com/aastankeev/simple/raw/main/void.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/void.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function () {
    'use strict';

    // Автоклейм
    const claimInterval = setInterval(() => {
        const button = Array.from(document.querySelectorAll('button')).find(btn =>
            btn.textContent.trim() === 'Клейм'
        );

        if (button) {
            button.click();
            console.log('Кнопка "Клейм" нажата.');
            clearInterval(claimInterval);
        } else {
            console.log('Кнопка "Клейм" не найдена.');
        }
    }, 2000);

    // Автоинвентарь
    const inventoryInterval = setInterval(() => {
        const svg = document.querySelector('svg[data-sentry-component="InventoryIcon"]');
        if (svg) {
            const clickableDiv = svg.closest('div._bottomBarLinkWrap_1sac6_120');
            if (clickableDiv) {
                clickableDiv.click();
                console.log('Иконка "Инвентарь" нажата.');
                clearInterval(inventoryInterval);
            } else {
                console.log('SVG найден, но родительский div не найден.');
            }
        } else {
            console.log('Иконка "Инвентарь" пока не найдена.');
        }
    }, 2000);
})();

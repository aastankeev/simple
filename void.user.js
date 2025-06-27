// ==UserScript==
// @name         void
// @namespace    http://tampermonkey.net/
// @version      1
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

    // Функция для кнопки "Клейм"
    const claimInterval = setInterval(() => {
        const button = Array.from(document.querySelectorAll('button')).find(btn =>
            btn.textContent.trim() === 'Клейм'
        );

        if (button) {
            button.click();
            console.log('Кнопка "Клейм" найдена и нажата.');
            clearInterval(claimInterval);
        } else {
            console.log('Кнопка "Клейм" пока не найдена.');
        }
    }, 2000);

    // Функция для иконки "Инвентарь"
    const inventoryInterval = setInterval(() => {
        const svg = document.querySelector('svg[data-sentry-component="InventoryIcon"]');

        if (svg) {
            // Поднимаемся по DOM вверх, пока не найдём кликабельный родитель (обычно <div> или <a>)
            let clickable = svg.closest('div._bottomBarLinkWrap_1051n_120');
            if (clickable) {
                clickable.click();
                console.log('Инвентарь (иконка) найден и нажат.');
                clearInterval(inventoryInterval);
            } else {
                console.log('SVG найден, но не найден кликабельный контейнер.');
            }
        } else {
            console.log('Иконка "Инвентарь" пока не найдена.');
        }
    }, 2000);
})();

// ==UserScript==
// @name        Not Pixel Autoclicker
// @namespace   Violentmonkey Scripts
// @version     130
// @description halloween fix 18.11.24/27.11.2024 / фикс главноего всплывающего окна турнира/ просмотр рекламы / кофе брейк / 17.12.2024 сбор награды онли
// @downloadURL https://github.com/aastankeev/simple/raw/main/traf.user.js
// @updateURL   https://github.com/aastankeev/simple/raw/main/traf.user.js
// @homepage    https://github.com/aastankeev/simple
// @icon        https://notpx.app/favicon.ico
// @match       *://*.notpx.app/*
// @grant       none
// @author      lab404
// ==/UserScript==

(function () {
    'use strict';

    // Флаг для отслеживания состояния выполнения скрипта
    let isScriptCompleted = false;

    // Функция для проверки наличия кнопки и выполнения действий
    function checkAndCollectReward() {
        if (isScriptCompleted) return;

        const menuButton = document.querySelector('._button_rjvnl_1');
        if (menuButton) {
            menuButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
            menuButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
            menuButton.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
            console.log('Меню открыто');

            setTimeout(() => {
                const rewardButton = document.querySelector('._button_13oyr_11');
                if (rewardButton) {
                    rewardButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
                    rewardButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
                    rewardButton.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
                    console.log('Награда собрана');

                    isScriptCompleted = true;
                    console.log('Скрипт завершён');
                } else {
                    console.log('Кнопка награды не найдена');
                }
            }, 500); // Задержка для обработки меню
        } else {
            console.log('Кнопка меню не найдена');
        }
    }

    // Интервал для проверки каждые 2 секунды
    const intervalId = setInterval(() => {
        if (isScriptCompleted) {
            clearInterval(intervalId);
        } else {
            checkAndCollectReward();
        }
    }, 2000);
})();

// ==UserScript==
// @name        launche
// @namespace   Violentmonkey Scripts
// @match       https://web.telegram.org/*
// @version     2
// @grant       none
// @icon        https://telegram.org/favicon.ico
// @downloadURL  https://raw.githubusercontent.com/aastankeev/simple/refs/heads/main/laucher.user.js
// @updateURL    https://raw.githubusercontent.com/aastankeev/simple/refs/heads/main/laucher.user.js
// @homepage     none
// ==/UserScript==

(function() {
    'use strict';

    let isSecondButtonClicked = false; // Флаг для отслеживания состояния нажатия кнопки

    // Функция для нажатия на кнопку "Launch"
    function clickLaunchButton(callback) {
        const launchButton = document.querySelector('button.popup-button.btn.primary.rp');

        if (launchButton) {
            launchButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
            launchButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
            launchButton.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));

            console.log('Кнопка "Launch" нажата');
            if (typeof callback === 'function') {
                setTimeout(callback, 500); // Задержка перед вызовом следующей функции
            }
        } else {
            console.log('Кнопка "Launch" не найдена');
        }
    }
})();

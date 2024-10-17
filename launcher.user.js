// ==UserScript==
// @name        launcher
// @namespace   Violentmonkey Scripts
// @match       https://web.telegram.org/*
// @grant       none
// @icon        https://telegram.org/favicon.ico
// @version     1.0
// @author      -
// @description 16.10.2024, 10:45:00
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

// ==UserScript==
// @name        launche
// @namespace   Violentmonkey Scripts
// @match       https://web.telegram.org/*
// @grant       none
// @version     1.0
// @author      -
// @description 16.10.2024, 10:45:00
// ==/UserScript==

(function() {
    'use strict';

    // Функция для нажатия на кнопку "Launch"
    function clickLaunchButton() {
        const launchButton = document.querySelector('button.popup-button.btn.primary.rp');

        if (launchButton) {
            launchButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
            launchButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
            launchButton.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));

            console.log('Кнопка "Launch" нажата');
        } else {
            console.log('Кнопка "Launch" не найдена');
        }
    }

    // Запускаем функцию через 5000 мс (5 секунда) после загрузки страницы
    setTimeout(clickLaunchButton, 5000);
})();

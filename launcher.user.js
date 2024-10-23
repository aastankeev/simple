// ==UserScript==
// @name        launche
// @namespace   Violentmonkey Scripts
// @updateURL   https://github.com/aastankeev/simple/raw/refs/heads/main/launcher.user.js
// @match       https://web.telegram.org/*
// @grant       none
// @version     1.1
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

    // Функция для запуска таймера обратного отсчета до перезапуска
    function startCountdown(seconds) {
        let counter = seconds;

        const countdownInterval = setInterval(() => {
            console.log(`Перезапуск через: ${counter} секунд`);
            counter--;

            if (counter < 0) {
                clearInterval(countdownInterval);
                clickLaunchButton(); // Нажатие на кнопку
                startCountdown(10); // Перезапуск через 10 секунд
            }
        }, 1000); // Интервал в 1 секунду
    }

    // Запускаем функцию через 5 секунд после загрузки страницы
    setTimeout(() => {
        clickLaunchButton(); // Первоначальный запуск
        startCountdown(10); // Обратный отсчет до перезапуска
    }, 5000);
})();

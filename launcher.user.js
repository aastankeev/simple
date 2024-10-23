// ==UserScript==
// @name        launche
// @namespace   Violentmonkey Scripts
// @version     10.23
// @description 
// @downloadURL https://github.com/aastankeev/simple/raw/main/launcher.user.js
// @updateURL   https://github.com/aastankeev/simple/raw/main/launcher.user.js
// @homepage    https://github.com/aastankeev/simple
// @icon        https://telegram.org/favicon.ico
// @match       https://web.telegram.org/*
// @grant       none
// @author      lab404
// ==/UserScript==

(function() {
    'use strict';

    let launchClicked = false; // Флаг, указывающий, нажата ли кнопка

    // Функция для нажатия на кнопку "Launch"
    function clickLaunchButton() {
        if (launchClicked) {
            console.log('Кнопка "Launch" уже была нажата. Перезапуск не требуется.');
            return;
        }

        const launchButton = document.querySelector('button.popup-button.btn.primary.rp');

        if (launchButton) {
            launchButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
            launchButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
            launchButton.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));

            console.log('Кнопка "Launch" нажата');
            launchClicked = true; // Устанавливаем флаг, что кнопка нажата
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

                if (!launchClicked) {
                    clickLaunchButton(); // Нажатие на кнопку только если она еще не была нажата
                    startCountdown(10); // Перезапуск через 10 секунд, если кнопка не была нажата
                } else {
                    console.log('Кнопка уже была нажата, дальнейший перезапуск не нужен.');
                }
            }
        }, 1000); // Интервал в 1 секунду
    }

    // Запускаем функцию через 5 секунд после загрузки страницы
    setTimeout(() => {
        clickLaunchButton(); // Первоначальный запуск
        if (!launchClicked) {
            startCountdown(10); // Обратный отсчет до перезапуска, если кнопка не нажата
        }
    }, 5000);
})();

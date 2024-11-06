// ==UserScript==
// @name        launcher c iframe
// @namespace   Violentmonkey Scripts
// @version     10.24
// @description добавлен перезапуск поиска launche кнопки если она не нажалась
// @downloadURL https://github.com/aastankeev/simple/raw/main/launchiframe.user.js
// @updateURL   https://github.com/aastankeev/simple/raw/main/launchiframe.user.js
// @homepage    https://github.com/aastankeev/simple
// @icon        https://telegram.org/favicon.ico
// @match       https://web.telegram.org/*
// @grant       none
// @author      lab404
// ==/UserScript==

(function() {
    'use strict';

    let launchClicked = false; // Флаг, указывающий, нажата ли кнопка
    let iframesUpdated = false; // Флаг для обновления iframe

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

            // Обновляем iframes только один раз после нажатия кнопки
            if (!iframesUpdated) {
                updateIframes();
                iframesUpdated = true;
            }
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

    // Функция для изменения параметра tgWebAppPlatform на "android" для всех iframe
    function updateIframes() {
        document.querySelectorAll('iframe').forEach(el => {
            if (el.src.includes("tgWebAppPlatform")) {
                el.src = el.src.replace(/(tgWebAppPlatform=)[^&]+/, "$1android");
            }
        });

        console.log("Параметр tgWebAppPlatform изменен на 'android' для всех iframe");

        // Добавляем MutationObserver для отслеживания новых iframe
        const observer = new MutationObserver(updateIframes);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Запускаем функцию через 5 секунд после загрузки страницы
    setTimeout(() => {
        clickLaunchButton(); // Первоначальный запуск
        if (!launchClicked) {
            startCountdown(10); // Обратный отсчет до перезапуска, если кнопка не нажата
        }
    }, 5000);
})();


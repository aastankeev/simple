https://
// ==UserScript==
// @name         hot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Кликает по динамически появляющимся кнопкам
// @author       alex
// @icon         https://tgapp.herewallet.app/logo.png
// @match        *://*tgapp.herewallet.app/*
// @grant        none

// ==/UserScript==

(function() {
    'use strict';

    // Функция для ожидания элемента и клика
    function waitAndClick(selector, maxAttempts = 50, interval = 300) {
        return new Promise((resolve) => {
            let attempts = 0;
            const checkElement = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    element.click();
                    console.log(`Клик по селектору: ${selector}`);
                    clearInterval(checkElement);
                    resolve(true);
                } else if (attempts >= maxAttempts) {
                    console.log(`Селектор ${selector} не найден после ${maxAttempts} попыток`);
                    clearInterval(checkElement);
                    resolve(false);
                }
                attempts++;
            }, interval);
        });
    }

    // Основная функция
    async function autoClick() {
        // Шаг 1: Клик по первому селектору (.sc-cOIMFE.cMsHpq)
        const firstClickSuccess = await waitAndClick('.sc-cOIMFE.cMsHpq');
        
        if (firstClickSuccess) {
            // Шаг 2: Многократный клик по второму селектору (.sc-tOkKi.lnrNYS)
            let clickCount = 0;
            const maxClicks = 5; // Максимум кликов (настройте по необходимости)
            const clickInterval = setInterval(async () => {
                const clicked = await waitAndClick('.sc-tOkKi.lnrNYS', 5, 200); // Быстрая проверка
                if (clicked) {
                    clickCount++;
                    console.log(`Клик #${clickCount} по второй кнопке`);
                }
                if (clickCount >= maxClicks) {
                    clearInterval(clickInterval);
                    console.log('Достигнуто максимальное число кликов');
                }
            }, 500); // Интервал между попытками
        }
    }

    // Запускаем после загрузки страницы
    window.addEventListener('load', autoClick);
})();

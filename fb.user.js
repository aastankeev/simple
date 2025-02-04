// ==UserScript==
// @name         findbtc
// @namespace    Violentmonkey Scripts
// @version      7
// @description  Ожидание кнопки "Бонусы" и нажатие на рекламу
// @match        https://web.telegram.org/k/#?tgaddr=tg%3A%2F%2Fresolve%3Fdomain%3Dbtctma_bot%26appname%3Dapp%26startapp%3D707981986
// @grant        none
// @icon         https://cdn-icons-png.flaticon.com/128/5128/5128439.png
// @downloadURL  https://github.com/aastankeev/simple/raw/main/fb.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/fb.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function () {
    'use strict';

    // Функция для ожидания появления элемента
    async function waitForElement(selector, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error(`Элемент ${selector} не найден за ${timeout} мс`));
                }
            }, 100);
        });
    }

    // Функция для выполнения основного процесса
    async function mainProcess() {
        try {
            // Ждём появления кнопки "Бонусы" и кликаем на неё
            const bonusButton = await waitForElement('button.Touch.css-10ilq54.e2vyh741');
            bonusButton.click();
            console.log('Кнопка "Бонусы" нажата.');

            // Ждём 1 секунду и кликаем на кнопку для запуска рекламы
            await new Promise(resolve => setTimeout(resolve, 1000));
            const adButton = await waitForElement('button.Touch.css-l56sm2.e1hualo72');
            adButton.click();
            console.log('Реклама запущена.');

            // Ждём 30 секунд (время рекламы)
            await new Promise(resolve => setTimeout(resolve, 30000));
            console.log('Реклама завершена.');

            // Повторяем процесс
            mainProcess();
        } catch (error) {
            console.error('Ошибка:', error.message);
            // Повторяем процесс через 5 секунд в случае ошибки
            setTimeout(mainProcess, 5000);
        }
    }

    // Запускаем процесс
    mainProcess();
})();

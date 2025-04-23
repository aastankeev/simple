// ==UserScript== 
// @name         labra
// @namespace    http://tampermonkey.net/
// @version      5
// @description  автоматизация
// @match        *://app.labr.meme/*
// @grant        none
// @icon         https://labr.hostappme.co/assets/dogIdle-ChJx0rZO.svg
// @downloadURL  https://github.com/aastankeev/simple/raw/main/labra.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/labra.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function () {
    'use strict';

    // Запускаем основной скрипт через 10 секунд
    setTimeout(() => {

        // Функция для выполнения клика по селектору с задержкой
        async function clickIfExists(selector) {
            const element = document.querySelector(selector);
            if (element) {
                element.click();
                console.log(`Клик выполнен по селектору: ${selector}`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка 1 секунда
                return true;
            }
            return false;
        }

        // Функция для проверки и клика по монетам
        async function checkAndClickCoins() {
            await clickIfExists('.coin-tap-to-collect');
        }

        // Функция для проверки и клика по основным селекторам
        async function checkAndClickSelectors() {
            await clickIfExists('.container.reward-item.today'); // Клик по ежедневной награде
            await clickIfExists('button.custom-button.tap-to-close.close');
            await clickIfExists('.mining-message button.custom-button');
            await clickIfExists('button.custom-button.expedition-finished-modal__button');
            await clickIfExists('#chest-opened-screen button.custom-button');
        }

        // Наблюдатель за изменениями в DOM
        const observer = new MutationObserver(async () => {
            await checkAndClickSelectors();
        });

        // Начинаем наблюдение за изменениями в DOM
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Периодическая проверка появления монет
        setInterval(async () => {
            await checkAndClickCoins();
        }, 2000); // Проверяем каждые 2 секунды

        // Клик по ежедневной награде сразу при запуске
        (async function init() {
            await clickIfExists('.container

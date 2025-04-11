// ==UserScript==
// @name         Wemainer
// @namespace    http://tampermonkey.net/
// @version      15
// @description  Сбор наград, обмен и прокачка карточек
// @author       YourName
// @match        *://*app.wemine.pro/*
// @grant        none
// @icon         https://img.icons8.com/?size=77&id=9T8Gef2DVZ89&format=png
// @downloadURL  https://github.com/aastankeev/simple/raw/main/we.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/we.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
    'use strict';

    // Функция для клика по кнопке Claim
    function clickClaimButton(callback) {
        const button = document.querySelector('div.button.Claim');
        if (button) {
            button.click();
            console.log("Кнопка Claim нажата.");
            // Ждем 5 секунд после нажатия и выполняем следующий блок
            setTimeout(callback, 5000);
        } else {
            console.log("Кнопка Claim не найдена. Ждем 20 секунд...");
            // Ждем 10 секунд и повторяем попытку
            setTimeout(() => clickClaimButton(callback), 10000);
        }
    }

    // Функция для выполнения "Start & Claim" в LABR Miner
    function performLabrMinerClaim() {
        // Ждем 2 секунды для загрузки домашнего меню
        setTimeout(() => {
            // Находим кнопку для открытия списка майнеров
            const asicSelectButton = document.querySelector('.asic-select-item');
            if (asicSelectButton) {
                asicSelectButton.click();
                console.log("Кнопка открытия списка майнеров нажата.");

                // Ждем 1 секунду для появления списка майнеров
                setTimeout(() => {
                    // Находим LABR Miner в списке
                    const labrMinerButton = Array.from(document.querySelectorAll('.asic-select-item'))
                        .find(item => item.textContent.trim() === 'LABR Miner');

                    if (labrMinerButton) {
                        labrMinerButton.click();
                        console.log("Переход в LABR Miner выполнен.");

                        // Ждем 5 секунд перед выполнением "Start & Claim"
                        setTimeout(() => {
                            const startClaimButton = document.querySelector('.button.usdt-button.Start');
                            if (startClaimButton) {
                                startClaimButton.click();
                                console.log('Кнопка "Start & Claim" нажата.');
                            } else {
                                console.log('Кнопка "Start & Claim" не найдена. Пробуем нажать "Claim"...');

                                // Ищем кнопку "Claim"
                                const claimButton = document.querySelector('.button.usdt-button.text span.s1');
                                if (claimButton && claimButton.textContent.trim() === 'Claim') {
                                    claimButton.closest('.button.usdt-button').click();
                                    console.log('Кнопка "Claim" нажата.');
                                } else {
                                    console.error('Кнопка "Claim" не найдена.');
                                }
                            }
                        }, 5000); // Задержка 5 секунд
                    } else {
                        console.error('Кнопка перехода в LABR Miner не найдена.');
                    }
                }, 1000); // Задержка 1 секунда после открытия списка майнеров
            } else {
                console.error('Кнопка открытия списка майнеров не найдена.');
            }
        }, 2000); // Задержка 2 секунды для загрузки домашнего меню
    }

    // Запускаем весь процесс
    clickClaimButton(() => {
        console.log("Переходим к следующему блоку...");
        performLabrMinerClaim();
    });
})();

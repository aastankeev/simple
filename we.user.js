// ==UserScript==
// @name         Wemainer
// @namespace    http://tampermonkey.net/
// @version      14
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
            // Ждем 10 секунд после нажатия и выполняем следующий блок
            setTimeout(callback, 10000);
        } else {
            console.log("Кнопка Claim не найдена. Ждем 20 секунд...");
            // Ждем 10 секунд и повторяем попытку
            setTimeout(() => clickClaimButton(callback), 10000);
        }
    }

/*
// Функция для выполнения "Start & Claim" в LABR Miner
function startLabrMiner() {
    // Переходим домой
    const homeButton = document.querySelector('div.item i.home');
    if (homeButton) {
        homeButton.click();
        console.log('Переход в меню домой выполнен.');
        console.log("Открываем LABR Miner...");

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
                        .find(item => item.textContent.trim() === 'USDT Miner');

                    if (labrMinerButton) {
                        labrMinerButton.click();
                        console.log("Переход в usdt Miner выполнен.");

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
                        console.error('Кнопка перехода в usdt Miner не найдена.');
                    }
                }, 1000); // Задержка 1 секунда после открытия списка майнеров
            } else {
                console.error('Кнопка открытия списка майнеров не найдена.');
            }
        }, 2000); // Задержка 2 секунды для загрузки домашнего меню
    } else {
        console.error('Кнопка перехода домой не найдена.');
    }
}

// Блок: Обмен, 100% свап и чтение баланса
function performExchangeAndReadBalance(callback) {
    const exchangeButton = document.querySelector('div.item i.exchange');

    if (exchangeButton) {
        exchangeButton.click();
        console.log('Переход в меню обмена выполнен.');

        // Ждем, чтобы меню обмена полностью загрузилось
        setTimeout(() => {
            const percentageButton = Array.from(document.querySelectorAll('div.exchange .buttons .button.small'))
                .find(button => button.querySelector('.text span.s1') && button.querySelector('.text span.s1').textContent.trim() === '100%');

            if (percentageButton) {
                percentageButton.click();
                console.log('Кнопка "100%" была нажата.');

                setTimeout(() => {
                    const swapButton = document.querySelector('div.button.exch-swap.orange');

                    if (swapButton) {
                        swapButton.click();
                        console.log('Кнопка "Swap" была нажата.');

                        // Переход в меню улучшений
                        setTimeout(() => {
                            const upgradesButton = document.querySelector('div.item i.upgrades');

                            if (upgradesButton) {
                                upgradesButton.click();
                                console.log('Переход в меню улучшений выполнен.');

                                // Чтение баланса
                                setTimeout(() => {
                                    const balanceElement = document.querySelector('div.layout.gradient .headerBalance .balance');

                                    if (balanceElement) {
                                        const balance = parseFloat(balanceElement.textContent.trim());
                                        console.log('Ваш баланс: ' + balance);

                                        // Запуск блока прокачки карточек
                                        if (callback) callback(balance);
                                    } else {
                                        console.log('Баланс не найден.');
                                    }
                                }, 500); // Задержка 500 мс, чтобы элемент баланса успел загрузиться
                            } else {
                                console.log('Кнопка перехода в меню улучшений не найдена.');
                            }
                        }, 500); // Задержка для завершения действия "Swap"
                    } else {
                        console.log('Кнопка "Swap" не найдена.');
                    }
                }, 500); // Задержка для появления кнопки "Swap"
            } else {
                console.log('Кнопка "100%" не найдена.');
            }
        }, 1000); // Задержка для загрузки меню обмена
    } else {
        console.log('Кнопка перехода в меню обмена не найдена.');
    }
}
*/

    // Запускаем весь процесс
    clickClaimButton(() => {
        console.log("Переходим к следующему блоку...");
        // performExchangeAndReadBalance(upgradeCards);
    });
})();

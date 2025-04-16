// ==UserScript==
// @name         Wemainer
// @namespace    http://tampermonkey.net/
// @version      17
// @description  первый день лабра майнера 2 сезон
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
            setTimeout(callback, 5000);
        } else {
            console.log("Кнопка Claim не найдена. Ждем 20 секунд...");
            setTimeout(() => clickClaimButton(callback), 10000);
        }
    }

    // Функция для выполнения "Start & Claim" в LABR Miner
    function performLabrMinerClaim() {
        setTimeout(() => {
            const asicSelectButton = document.querySelector('.asic-select-item');
            if (asicSelectButton) {
                asicSelectButton.click();
                console.log("Кнопка открытия списка майнеров нажата.");

                setTimeout(() => {
                    const labrMinerButton = Array.from(document.querySelectorAll('.asic-select-item'))
                        .find(item => item.textContent.trim() === 'LABR Miner');

                    if (labrMinerButton) {
                        labrMinerButton.click();
                        console.log("Переход в LABR Miner выполнен.");

                        setTimeout(() => {
                            // Сначала пробуем найти "Start & Claim"
                            const startClaimButton = document.querySelector('.button.MiningButton.labr.Start');
                            if (startClaimButton) {
                                startClaimButton.click();
                                console.log('Кнопка "Start & Claim" нажата.');
                                return;
                            }

                            // Если не найдено, ищем кнопку "Claim" по новому селектору
                            const claimButtons = document.querySelectorAll('.button.MiningButton.labr');
                            const claimButton = Array.from(claimButtons).find(btn => {
                                const span = btn.querySelector('.text span.s1');
                                return span && span.textContent.trim() === 'Claim';
                            });

                            if (claimButton) {
                                claimButton.click();
                                console.log('Кнопка "Claim" нажата.');
                            } else {
                                console.error('Ни одна из кнопок не найдена.');
                                // Дополнительная проверка через 5 секунд
                                setTimeout(performLabrMinerClaim, 5000);
                            }
                        }, 5000);
                    } else {
                        console.error('Кнопка перехода в LABR Miner не найдена.');
                    }
                }, 1000);
            } else {
                console.error('Кнопка открытия списка майнеров не найдена.');
            }
        }, 2000);
    }

    // Запускаем весь процесс
    clickClaimButton(() => {
        console.log("Переходим к следующему блоку...");
        performLabrMinerClaim();
    });

    // Добавляем периодическую проверку каждые 30 секунд
    setInterval(performLabrMinerClaim, 30000);
})();

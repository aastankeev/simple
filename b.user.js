// ==UserScript==
// @name         Bums
// @namespace    Violentmonkey Scripts
// @version      9
// @description
// @match        *://*app.bums.bot/*
// @grant        none
// @icon         https://app.bums.bot/favicon.ico
// @downloadURL https://github.com/aastankeev/simple/raw/main/b.user.js
// @updateURL   https://github.com/aastankeev/simple/raw/main/b.user.js
// @homepage    https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
    'use strict';

    const excludedCards = ["Jackpot Chance", "Crit Multiplier", "Max Energy", "Tap Reward", "Energy Regen"];

    // Функция для конвертации стоимости карты в числовое значение
    function convertPriceToNumber(price) {
        let priceString = price.replace(/[\s,]/g, '').toLowerCase();
        let priceNumber = parseFloat(priceString);

        if (priceString.includes('k')) {
            priceNumber *= 1000;
        } else if (priceString.includes('m')) {
            priceNumber *= 1000000;
        } else if (priceString.includes('b')) {
            priceNumber *= 1000000000;
        }

        return priceNumber;
    }

    // Функция для чтения и сортировки доступных карт на третьей вкладке
    function readAndSortCards() {
        const availableCards = [];

        // Открываем третью вкладку (id="van-tabs-1-3")
        const tab = document.querySelector('#van-tabs-1-3');
        if (tab) {
            tab.click();

            // Задержка для загрузки вкладки и чтения карт
            setTimeout(() => {
                const cards = document.querySelectorAll(".desc");

                cards.forEach(card => {
                    const cardItem = card.closest('.Item');
                    if (cardItem && cardItem.classList.contains('upgrade-item-active')) return;

                    const cardName = card.querySelector("span").textContent.trim();
                    if (excludedCards.includes(cardName)) return;  // Пропускаем карту, если она в списке исключенных

                    const priceElement = card.closest('.Item').querySelector(".coin-num span");
                    const cardPrice = priceElement ? priceElement.textContent.trim() : "Цена не найдена";
                    const numericPrice = convertPriceToNumber(cardPrice);

                    // Добавляем карту в список доступных карт, если её нет
                    if (!availableCards.some(item => item.name === cardName)) {
                        availableCards.push({ name: cardName, price: numericPrice, element: cardItem });
                    }
                });

                // Сортируем карты по возрастанию стоимости
                availableCards.sort((a, b) => a.price - b.price);

                // Запускаем процесс улучшения карт
                upgradeCardsSequentially(availableCards);
            }, 1000); // Задержка для ожидания загрузки вкладки
        }
    }

    // Функция для последовательного улучшения карт
    function upgradeCardsSequentially(cards) {
        if (cards.length === 0) return;

        const card = cards.shift(); // Берём первую карту из списка

        // Открываем карту и нажимаем кнопку улучшения
        card.element.click();
        setTimeout(() => {
            const upgradeButton = document.querySelector('.van-button.van-button--default.van-button--normal.vant-btn');
            if (upgradeButton) {
                upgradeButton.click();
                console.log(`Улучшена карта: ${card.name}, Цена: ${card.price}`);
            }

            // Рекурсивно вызываем функцию для следующей карты после задержки
            setTimeout(() => upgradeCardsSequentially(cards), 1000);
        }, 1000); // Ожидание перед нажатием кнопки улучшения
    }

    // Основная функция скрипта
    function main() {
        // Проверяем наличие кнопки для сбора награды
        const collectRewardButton = document.querySelector("button.van-button--warning.van-button--large.van-button--block.van-button--round.shadow");
        if (collectRewardButton) {
            collectRewardButton.click(); // Нажимаем на кнопку "Собрать награду"
        } else {
            // Если кнопки нет, переходим в меню строительства
            const upgradeTab = [...document.querySelectorAll('.van-tabbar-item')]
                .find(tab => tab.innerText.trim() === 'Upgrade');
            if (upgradeTab) {
                upgradeTab.click();
            }
        }

        // Запускаем процесс чтения и сортировки карт на третьей вкладке
        setTimeout(readAndSortCards, 1000);
    }

    // Запускаем основной цикл каждые 3 секунды
    setInterval(main, 3000);
})();

// ==UserScript==
// @name         Bums
// @namespace    Violentmonkey Scripts
// @version      18
// @description  fix 14.11.24, 15.11.24 экспедиция, сбор ежедневной награды / 02.12.2024/ 09-12-2024
// @match        *://*app.bums.bot/*
// @grant        none
// @icon         https://app.bums.bot/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/b.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/b.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
    'use strict';

    const excludedCards = ["Jackpot Chance", "Crit Multiplier", "Max Energy", "Tap Reward", "Energy Regen"];
    let scriptRunning = true;  // Флаг для управления состоянием скрипта

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

    // Функция для получения текущего баланса
    function getCurrentBalance() {
        const balanceElement = document.querySelector(".balance-value");
        if (balanceElement) {
            return convertPriceToNumber(balanceElement.textContent.trim());
        }
        return 0;
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

        // Получаем текущий баланс
        const currentBalance = getCurrentBalance();

        // Проверяем, достаточно ли средств для улучшения карты
        if (currentBalance < card.price) {
            console.log(`Недостаточно средств для улучшения карты: ${card.name}. Баланс: ${currentBalance}, Требуется: ${card.price}`);
            scriptRunning = false;  // Останавливаем выполнение скрипта
            collectDailyRewards();  // Запускаем сбор ежедневных наград
            return;  // Прекращаем выполнение кода
        }

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

// Функция для выполнения сбора ежедневных наград и выполнения заданий
function collectDailyRewards() {
    function clickElementIfExists(selector) {
        const element = document.querySelector(selector);
        if (element) {
            console.log(`Найден элемент: ${selector}`);
            element.click();
            return true;
        }
        console.log(`Элемент не найден: ${selector}`);
        return false;
    }

// Сбор ежедневных наград
setTimeout(() => {
    const cityClicked = clickElementIfExists('.van-tabbar-item img[src*="earn"]');
    if (!cityClicked) return;

    setTimeout(() => {
        const expeditionClicked = clickElementIfExists('.layer.bord img[src*="4-CRn3d9ia.png"]');
        if (!expeditionClicked) return;

        setTimeout(() => {
            const listContainer = document.querySelector('div[data-v-662d8137][class="list"]');
            if (listContainer) {
                const firstItem = listContainer.querySelector('div[data-v-662d8137][class="item"]');
                if (firstItem) {
                    const employButtonText = firstItem.querySelector('button .van-button__text');
                    if (employButtonText && employButtonText.textContent.trim() === "Employ") {
                        employButtonText.closest('button').click();
                        console.log("Free Expedition использована.");
                    } else {
                        console.log("Free Expedition уже использована, пропускаем...");
                    }
                }
            }

            setTimeout(() => {
                clickElementIfExists('.back-button');

                setTimeout(() => {
                    const freeBoxSection = clickElementIfExists('div.layer.mysteryBox');
                    if (!freeBoxSection) return;

                    setTimeout(() => {
                        const freeButtons = document.querySelectorAll('button.van-button span.van-button__text');
                        let foundFreeButton = null;

                        freeButtons.forEach((button) => {
                            if (button.textContent.trim() === "Free") {
                                foundFreeButton = button;
                            }
                        });

                        if (foundFreeButton) {
                            console.log("Нажимаем кнопку Free");
                            foundFreeButton.closest('button').click();

                            setTimeout(() => {
                                const niceButton = document.querySelector("button.van-button--default .van-button__text span");
                                if (niceButton) {
                                    niceButton.click();
                                    console.log("Нажата кнопка NICE!");
                                } else {
                                    console.log("Кнопка NICE не найдена.");
                                }

                                setTimeout(() => {
                                    clickElementIfExists('.back-button');
                                }, 2000);
                            }, 2000);
                        } else {
                            console.log("Кнопка Free не найдена или уже использована.");

                            setTimeout(() => {
                                clickElementIfExists('.back-button');
                            }, 2000);
                        }
                    }, 2000);
                }, 2000);
            }, 2000);
        }, 2000);
    }, 2000);
}, 2000);
}


    // Основная функция скрипта
    function main() {
        if (!scriptRunning) return;  // Проверяем, активен ли скрипт

        // Проверяем наличие кнопки для сбора награды
        const collectRewardButton = document.querySelector("button.van-button--warning.van-button--large.van-button--block.van-button--round.shadow");
        if (collectRewardButton) {
            collectRewardButton.click(); // Нажимаем на кнопку "Собрать награду"
        } else {
            const upgradeTab = [...document.querySelectorAll('.van-tabbar-item')]
                .find(tab => tab.innerText.trim() === 'Upgrade');
            if (upgradeTab) {
                upgradeTab.click();
            }
        }

        // Запускаем процесс чтения и сортировки карт на третьей вкладке
        setTimeout(readAndSortCards, 1000);
    }

    // Запускаем основной цикл
    setInterval(main, 3000);
})();

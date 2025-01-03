// ==UserScript==
// @name         Bums
// @namespace    Violentmonkey Scripts
// @version      20
// @description  fix 14.11.24, 15.11.24 экспедиция, сбор ежедневной награды / 02.12.2024/ 09-12-2024 / 13.12.2024
// @match        *://*app.bums.bot/*
// @grant        none
// @icon         https://app.bums.bot/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/b.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/b.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function () {
    'use strict';

    const excludedCards = ["Jackpot Chance", "Crit Multiplier", "Max Energy", "Tap Reward", "Energy Regen"];
    let scriptRunning = true; // Флаг для управления состоянием скрипта

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

        const tab = document.querySelector('#van-tabs-1-3');
        if (tab) {
            tab.click();

            setTimeout(() => {
                const cards = document.querySelectorAll(".desc");

                cards.forEach(card => {
                    const cardItem = card.closest('.Item');
                    if (cardItem && cardItem.classList.contains('upgrade-item-active')) return;

                    const cardName = card.querySelector("span").textContent.trim();
                    if (excludedCards.includes(cardName)) return;

                    const priceElement = card.closest('.Item').querySelector(".coin-num span");
                    const cardPrice = priceElement ? priceElement.textContent.trim() : "Цена не найдена";
                    const numericPrice = convertPriceToNumber(cardPrice);

                    if (!availableCards.some(item => item.name === cardName)) {
                        availableCards.push({ name: cardName, price: numericPrice, element: cardItem });
                    }
                });

                availableCards.sort((a, b) => a.price - b.price);
                upgradeCardsSequentially(availableCards);
            }, 1000);
        }
    }

    // Функция для последовательного улучшения карт
    function upgradeCardsSequentially(cards) {
        if (cards.length === 0) return;

        const card = cards.shift();
        const currentBalance = getCurrentBalance();

        if (currentBalance < card.price) {
            console.log(`Недостаточно средств для улучшения карты: ${card.name}. Баланс: ${currentBalance}, Требуется: ${card.price}`);
            scriptRunning = false;
            collectDailyRewards();
            return;
        }

        card.element.click();
        setTimeout(() => {
            const upgradeButton = document.querySelector('.van-button.van-button--default.van-button--normal.vant-btn');
            if (upgradeButton) {
                upgradeButton.click();
                console.log(`Улучшена карта: ${card.name}, Цена: ${card.price}`);
            }

            setTimeout(() => upgradeCardsSequentially(cards), 1000);
        }, 1000);
    }

    // Функция для выполнения сбора ежедневных наград
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

        setTimeout(() => {
            const cityClicked = clickElementIfExists('.van-tabbar-item img[src*="earn"]');
            if (!cityClicked) return;

            setTimeout(() => {
                const expeditionClicked = clickElementIfExists('.layer.bord img[src*="4-CRn3d9ia.png"]');
                if (!expeditionClicked) return;

                setTimeout(() => {
                    const listContainer = document.querySelector('div[data-v-c0f0c28b][class="item"]');
                    if (listContainer) {
                        const firstItem = listContainer.querySelector('button.van-button span.van-button__text');
                        if (firstItem && firstItem.textContent.trim() === "Employ") {
                            firstItem.closest('button').click();
                            console.log("Free Expedition использована.");
                        } else {
                            console.log("Free Expedition уже использована, пропускаем...");
                        }
                    }

                    setTimeout(() => {
                        clickElementIfExists('.back-button');

                        setTimeout(() => {
                            const freeBoxSection = clickElementIfExists('div.layer.mysteryBox');
                            if (!freeBoxSection) return;

                            setTimeout(() => {
                                const freeButtons = [...document.querySelectorAll('button span, div span')].filter(button =>
                                    button.textContent.trim().toUpperCase() === "FREE"
                                );

                                if (freeButtons.length === 0) {
                                    console.log("Кнопки Free не найдены.");
                                    return;
                                }

                                freeButtons.forEach((button, index) => {
                                    const parentButton = button.closest('button');
                                    if (parentButton) {
                                        setTimeout(() => {
                                            console.log(`Нажимаем кнопку Free №${index + 1}`);
                                            parentButton.click();
                                        }, index * 2000);
                                    }
                                });

                                setTimeout(() => {
                                    const niceButton = document.querySelector("button.van-button--default .van-button__text span");
                                    if (niceButton) {
                                        niceButton.click();
                                        console.log("Нажата кнопка NICE!");
                                    }
                                    setTimeout(() => {
                                        clickElementIfExists('.back-button');
                                    }, 2000);
                                }, 2000);
                            }, 2000);
                        }, 2000);
                    }, 2000);
                }, 2000);
            }, 2000);
        }, 2000);
    }

    function main() {
        if (!scriptRunning) return;

        const collectRewardButton = document.querySelector("button.van-button--warning.van-button--large.van-button--block.van-button--round.shadow");
        if (collectRewardButton) {
            collectRewardButton.click();
        } else {
            const upgradeTab = [...document.querySelectorAll('.van-tabbar-item')]
                .find(tab => tab.innerText.trim() === 'Upgrade');
            if (upgradeTab) {
                upgradeTab.click();
            }
        }

        setTimeout(readAndSortCards, 1000);
    }

    setInterval(main, 3000);
})();

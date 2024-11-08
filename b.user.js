// ==UserScript==
// @name         Bums
// @namespace    Violentmonkey Scripts
// @version      7
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
    let availableCards = [];

    function convertPriceToNumber(price) {
        let priceString = price.replace(/[\s,]/g, '').toLowerCase();
        let priceNumber = parseFloat(priceString);

        if (priceString.includes('k')) priceNumber *= 1000;
        else if (priceString.includes('m')) priceNumber *= 1000000;
        else if (priceString.includes('b')) priceNumber *= 1000000000;

        return priceNumber;
    }

    function readCardsFromTab(tabId) {
        const tab = document.querySelector(`#${tabId}`);
        if (tab) {
            tab.click();
            const cards = document.querySelectorAll(".desc");
            cards.forEach(card => {
                const cardItem = card.closest('.Item');
                if (cardItem && cardItem.classList.contains('upgrade-item-active')) return;

                const cardName = card.querySelector("span").textContent.trim();
                const priceElement = card.closest('.Item').querySelector(".coin-num span");
                const cardPrice = priceElement ? priceElement.textContent.trim() : "Цена не найдена";
                const numericPrice = convertPriceToNumber(cardPrice);

                if (!excludedCards.includes(cardName) && !availableCards.some(item => item.name === cardName)) {
                    availableCards.push({ name: cardName, price: numericPrice, element: cardItem });
                }
            });
        }
    }

    function processTabsAndFindCheapest() {
        availableCards = [];
        readCardsFromTab("van-tabs-1-3");
        setTimeout(() => {
            readCardsFromTab("van-tabs-1-1");
            setTimeout(() => {
                readCardsFromTab("van-tabs-1-2");
                availableCards.sort((a, b) => a.price - b.price);

                console.log("Итоговый список доступных карт:");
                availableCards.forEach(card => {
                    console.log(`Название карты: ${card.name}, Цена: ${card.price}`);
                });

                upgradeCheapestCard();
            }, 1000);
        }, 1000);
    }

    function upgradeCheapestCard() {
        if (availableCards.length === 0) {
            console.log("Нет доступных карт для улучшения.");
            return;
        }

        const cheapestCard = availableCards.shift();
        console.log(`Самая дешёвая карта: ${cheapestCard.name}, Цена: ${cheapestCard.price}`);

        openCardAndUpgrade(cheapestCard);
    }

    function openCardAndUpgrade(card) {
        card.element.click();
        setTimeout(() => {
            const upgradePopup = document.querySelector('.upgrade-popup');
            if (upgradePopup) {
                const buyButton = upgradePopup.querySelector('button.van-button--default.van-button--normal.vant-btn');
                if (buyButton) {
                    console.log(`Улучшение карты ${card.name}...`);
                    buyButton.click();

                    setTimeout(() => {
                        upgradeCheapestCard(); // Переход к следующей самой дешевой карте
                    }, 1000); // Пауза после улучшения карты перед переходом к следующей
                } else {
                    console.log(`Кнопка улучшения для карты ${card.name} не найдена.`);
                }
            } else {
                console.log(`Окно улучшения для карты ${card.name} не появилось.`);
            }
        }, 1000);
    }

    function main() {
        processTabsAndFindCheapest();
        setTimeout(main, 3000); // Автоматический перезапуск каждые 3 секунды
    }

    main();
})();




// ==UserScript==
// @name         Bums
// @namespace    Violentmonkey Scripts
// @version      2.0.1
// @description  
// @match        *://*app.bums.bot/*
// @grant        none
// @icon         https://app.bums.bot/favicon.ico
// @downloadURL https://github.com/aastankeev/simple/raw/main/b.user.js
// @updateURL   https://github.com/aastankeev/simple/raw/main/b.user.js
// @homepage    https://github.com/aastankeev/simple
// ==/UserScript==

// Обработчик доступных карточек
const readAvailableCards = () => {
    const availableCards = document.querySelectorAll('div.Item:not(.upgrade-item-active)');
    let cheapestCard = null; 
    let minCost = Infinity;

    const cardsToCheck = Array.from(availableCards).slice(1); // Пропускаем первый элемент

    // Процесс получения информации о карточках
    cardsToCheck.forEach((card, index) => {
        const descElement = card.querySelector('div.desc');
        const coinNumElement = card.querySelector('div.coin-num');

        if (descElement) {
            const spanElement = descElement.querySelector('span[data-v-d3e7e514]');
            if (spanElement) {
                const cardName = spanElement.innerText;
                let cardCost = 'Не указана';
                
                if (coinNumElement) {
                    const costSpan = coinNumElement.querySelector('span[data-v-d3e7e514]');
                    if (costSpan) {
                        cardCost = costSpan.innerText.replace(/\s/g, '');
                        if (cardCost.includes('K')) {
                            cardCost = cardCost.replace('K', '');
                            cardCost = parseFloat(cardCost) * 1000;
                        } else {
                            cardCost = parseFloat(cardCost);
                        }
                    }
                }

                if (cardCost < minCost) {
                    minCost = cardCost;
                    cheapestCard = { name: cardName, cost: cardCost, element: card };
                }
            }
        }
    });

    // Получаем баланс пользователя
    const balanceElement = document.querySelector('.balance-value');
    let balance = 0;

    if (balanceElement) {
        let balanceText = balanceElement.innerText.trim().replace(/\s/g, '');
        if (balanceText.includes('K')) {
            balanceText = balanceText.replace('K', '');
            balance = parseFloat(balanceText) * 1000;
        } else {
            balance = parseFloat(balanceText);
        }
    }

    // Проверка, достаточно ли средств для прокачки
    if (cheapestCard) {
        if (balance >= cheapestCard.cost) {
            cheapestCard.element.click();
            setTimeout(() => {
                const upgradePopup = document.querySelector('.upgrade-popup .content');
                if (upgradePopup) {
                    const upgradeButton = upgradePopup.querySelector('.van-button');
                    if (upgradeButton) {
                        upgradeButton.click();
                        setTimeout(() => {
                            readAvailableCards();
                        }, 1000);
                    }
                }
            }, 1000);
        } else {
            const randomWaitTime = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
            setTimeout(() => {
                readAvailableCards();
            }, randomWaitTime * 1000);
        }
    }
};

// Запуск функции
readAvailableCards();

// Добавляем возможность перезапуска через кнопки или другие методы
const startScript = () => {
    readAvailableCards();
};

// Пример кнопки для перезапуска скрипта (добавляем в DOM)
const restartButton = document.createElement('button');
restartButton.textContent = 'Перезапустить Скрипт';
restartButton.style.position = 'fixed';
restartButton.style.top = '20px';
restartButton.style.right = '20px';
restartButton.style.zIndex = 1000;
restartButton.onclick = startScript;
document.body.appendChild(restartButton);

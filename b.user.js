// ==UserScript==
// @name         Bums
// @namespace    Violentmonkey Scripts
// @version      2.5
// @description  
// @match        *://*app.bums.bot/*
// @grant        none
// @icon         https://app.bums.bot/favicon.ico
// @downloadURL https://github.com/aastankeev/simple/raw/main/b.user.js
// @updateURL   https://github.com/aastankeev/simple/raw/main/b.user.js
// @homepage    https://github.com/aastankeev/simple
// ==/UserScript==

// Функция для перехода на вкладку "Upgrade" и прокачки карточек на всех вкладках внутри неё
const openUpgradeTabAndUpgradeCardsOnAllTabs = async () => {
    // Функция для поиска и клика по вкладке "Upgrade"
    const findAndClickUpgradeTab = async () => {
        const upgradeTab = [...document.querySelectorAll('.van-tabbar-item')]
            .find(tab => tab.innerText.trim() === 'Upgrade');

        if (upgradeTab) {
            upgradeTab.click();
            console.log("Перешли на вкладку 'Upgrade'");
            return true; // Успешный клик
        } else {
            console.log("Вкладка 'Upgrade' не найдена, повторная попытка через 3 секунды...");
            return false; // Не удалось найти вкладку
        }
    };

    // Попытки найти и нажать на вкладку "Upgrade"
    let found = false;
    while (!found) {
        found = await findAndClickUpgradeTab();
        if (!found) {
            await new Promise(resolve => setTimeout(resolve, 3000)); // Ждем 3 секунды перед следующей попыткой
        }
    }

    // Ждем, чтобы вкладка "Upgrade" успела загрузиться
    await new Promise(resolve => setTimeout(resolve, 500));

    // Функция для клика по конкретной вкладке (вкладки карточек внутри "Upgrade")
    const clickTab = async (tabIndex) => {
        const tab = document.querySelectorAll('.van-tab')[tabIndex];
        if (tab) {
            tab.click();
            console.log(`Перешли на вкладку ${tabIndex + 1}`);
            await new Promise(resolve => setTimeout(resolve, 500)); // Ждем активации вкладки
            return true;
        }
        console.log(`Вкладка ${tabIndex + 1} не найдена`);
        return false;
    };

// Основная функция для обработки карточек
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

// Делаем клик на вкладку Upgrade сразу при запуске игры
window.addEventListener('load', () => {
    setTimeout(clickUpgradeTab, 1000); // Задержка, чтобы элемент точно был доступен
});


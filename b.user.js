// ==UserScript==
// @name         Bums
// @namespace    Violentmonkey Scripts
// @version      3.1
// @description  
// @match        *://*app.bums.bot/*
// @grant        none
// @icon         https://app.bums.bot/favicon.ico
// @downloadURL https://github.com/aastankeev/simple/raw/main/b.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/b.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

const excludedCards = ["Jackpot Chance", "Crit Multiplier", "Max Energy", "Tap Reward", "Energy Regen"];

const openUpgradeTabAndUpgradeCardsOnAllTabs = async () => {
    const findAndClickUpgradeTab = async () => {
        const upgradeTab = [...document.querySelectorAll('.van-tabbar-item')]
            .find(tab => tab.innerText.trim() === 'Upgrade');

        if (upgradeTab) {
            upgradeTab.click();
            console.log("Перешли на вкладку 'Upgrade'");
            return true;
        } else {
            console.log("Вкладка 'Upgrade' не найдена, повторная попытка через 3 секунды...");
            return false;
        }
    };

    let found = false;
    while (!found) {
        found = await findAndClickUpgradeTab();
        if (!found) {
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const isUpgradeTabActive = document.querySelector('.van-tabbar-item--active span')?.innerText === 'Upgrade';
    if (isUpgradeTabActive) {
        console.log("Вкладка 'Upgrade' активирована. Запускаем обработку карточек...");
        await readAvailableCardsOnAllTabs();
    } else {
        console.log("Не удалось подтвердить, что вкладка 'Upgrade' активна.");
    }
};

const readAvailableCardsOnAllTabs = async () => {
    const tabs = document.querySelectorAll('.van-tab');
    const tabsToCheck = Array.from(tabs).slice(1);

    for (let tabIndex = 0; tabIndex < tabsToCheck.length; tabIndex++) {
        tabsToCheck[tabIndex].click();
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`Проверяем карточки на вкладке ${tabIndex + 2}`);
        await readAvailableCards();
    }
};

const readAvailableCards = async () => {
    const availableCards = document.querySelectorAll('div.Item:not(.upgrade-item-active)');
    let cheapestCard = null;
    let minCost = Infinity;

    console.log("Доступные карточки для прокачки:");
    availableCards.forEach((card, index) => {
        const descElement = card.querySelector('div.desc');
        const coinNumElement = card.querySelector('div.coin-num');

        if (descElement) {
            const spanElement = descElement.querySelector('span[data-v-d3e7e514]');
            if (spanElement) {
                const cardName = spanElement.innerText;

                // Пропускаем карточки из списка исключений
                if (excludedCards.includes(cardName)) {
                    console.log(`Пропускаем карточку ${cardName}`);
                    return;
                }

                let cardCost = 'Не указана';
                if (coinNumElement) {
                    const costSpan = coinNumElement.querySelector('span[data-v-d3e7e514]');
                    if (costSpan) {
                        cardCost = costSpan.innerText.replace(/\s/g, '');
                        if (cardCost.includes('K')) {
                            cardCost = cardCost.replace('K', '');
                            cardCost = parseFloat(cardCost) * 1000;
                        } else if (cardCost.includes('M')) {
                            cardCost = cardCost.replace('M', '');
                            cardCost = parseFloat(cardCost) * 1000000;
                        } else if (cardCost.includes('B')) {
                            cardCost = cardCost.replace('B', '');
                            cardCost = parseFloat(cardCost) * 1000000000;
                        } else {
                            cardCost = parseFloat(cardCost);
                        }
                    }
                }

                console.log(`- Карточка ${index + 1}: ${cardName}, Стоимость: ${cardCost}`);

                if (cardCost < minCost) {
                    minCost = cardCost;
                    cheapestCard = { name: cardName, cost: cardCost, element: card };
                }
            }
        }
    });

    const balanceElement = document.querySelector('.balance-value');
    let balance = 0;

    if (balanceElement) {
        let balanceText = balanceElement.innerText.trim().replace(/\s/g, '');
        if (balanceText.includes('K')) {
            balanceText = balanceText.replace('K', '');
            balance = parseFloat(balanceText) * 1000;
        } else if (balanceText.includes('M')) {
            balanceText = balanceText.replace('M', '');
            balance = parseFloat(balanceText) * 1000000;
        } else if (balanceText.includes('B')) {
            balanceText = balanceText.replace('B', '');
            balance = parseFloat(balanceText) * 1000000000;
        } else {
            balance = parseFloat(balanceText);
        }
    }
    console.log(`Текущий баланс: ${balance}`);

    if (cheapestCard) {
        if (balance >= cheapestCard.cost) {
            console.log(`Достаточно средств для прокачки карточки ${cheapestCard.name}. Прокачиваем...`);
            cheapestCard.element.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            const upgradePopup = document.querySelector('.upgrade-popup .content');
            if (upgradePopup) {
                const upgradeButton = upgradePopup.querySelector('.van-button');
                if (upgradeButton) {
                    upgradeButton.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.log("Прокачка завершена. Перепроверяем все карточки...");
                    await readAvailableCardsOnAllTabs(); // Обновляем информацию о карточках после прокачки
                }
            }
        } else {
            const randomWaitTime = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
            console.log(`Недостаточно средств. Ожидание ${randomWaitTime} секунд перед повторной проверкой...`);
            await new Promise(resolve => setTimeout(resolve, randomWaitTime * 1000));
            await readAvailableCardsOnAllTabs();
        }
    }
};

window.addEventListener('load', () => {
    setTimeout(openUpgradeTabAndUpgradeCardsOnAllTabs, 1000);
});
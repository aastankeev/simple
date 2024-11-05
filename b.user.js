// ==UserScript==
// @name         Bums
// @namespace    Violentmonkey Scripts
// @version      1
// @description  Скрипт для работы с приложением Bums Bot
// @match        *://*app.bums.bot/*
// @grant        none
// @icon         https://app.bums.bot/favicon.ico
// @downloadURL  none
// @updateURL    none
// @homepage     none
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

    // Функция для улучшения карточек на текущей вкладке
    const upgradeCardsOnCurrentTab = async () => {
        const upgradeableCards = document.querySelectorAll('.Item:not(.upgrade-item-active)');

        if (upgradeableCards.length > 0) {
            for (const card of upgradeableCards) {
                const cardNameElement = card.querySelector('span');
                const cardName = cardNameElement ? cardNameElement.innerText : "Название карточки не найдено";
                const contentElement = card.querySelector('.content');

                if (contentElement) {
                    contentElement.click(); // Активируем карточку
                    console.log(`Активировано улучшение для: ${cardName}`);

                    // Ждем, чтобы карточка открылась полностью
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const popupContainer = document.querySelector('.van-popup');
                    if (popupContainer) {
                        const upgradeButton = popupContainer.querySelector('button.van-button--default.van-button--normal.vant-btn');

                        if (upgradeButton && !upgradeButton.disabled && upgradeButton.offsetParent !== null) {
                            upgradeButton.click(); // Нажимаем на кнопку улучшения
                            console.log(`Улучшено умение: ${cardName}`);
                        } else {
                            console.log(`Кнопка для улучшения не найдена или заблокирована для карточки: ${cardName}`);
                        }
                    } else {
                        console.log(`Родительский контейнер карточки не найден для: ${cardName}`);
                    }
                } else {
                    console.log(`Элемент для активации улучшения не найден для карточки: ${cardName}`);
                }
            }
        } else {
            console.log("Нет доступных для улучшения карточек на текущей вкладке.");
        }
    };

    // Проходим по всем вкладкам (начиная со второй) и прокачиваем карточки
    const totalTabs = 4; // Укажите общее количество вкладок
    while (true) {
        for (let i = 1; i <= totalTabs; i++) {
            await clickTab(i); // Переходим на вкладку
            await upgradeCardsOnCurrentTab(); // Прокачиваем карточки на текущей вкладке
        }
    }
};

// Запускаем функцию
openUpgradeTabAndUpgradeCardsOnAllTabs();













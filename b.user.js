// ==UserScript== 
// @name         Bums
// @namespace    Violentmonkey Scripts
// @version      27
// @description  fix 14.11.24, 15.11.24 экспедиция, сбор ежедневной награды / 02.12.2024/ 09-12-2024 / 13.12.2024 / 28.01.2025 добавлена кнопка стоп старт // второй баланс
// @match        *://*app.bums.bot/*
// @grant        none
// @icon         https://app.bums.bot/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/b.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/b.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function () {
    'use strict';

    // Нажатие кнопки "AIRDROP RULES"
    document.querySelectorAll('.icon').forEach(button => {
        let textElement = button.querySelector('.name .cut_two');
        if (textElement && textElement.innerHTML.includes('AIRDROP<br>RULES')) {
            button.click();

            // Задержка 1 секунда перед нажатием "DAILY LOG-IN"
            setTimeout(() => {
                document.querySelectorAll('.left_text').forEach(el => {
                    const textEl = el.querySelector('.text_bold');
                    if (textEl && textEl.textContent.includes('DAILY LOG-IN')) {
                        el.click();

                        // Еще 1 секунда задержки перед нажатием "GET FREE"
                        setTimeout(() => {
                            let getFreeBtn = document.querySelector('.getFree');
                            if (getFreeBtn) {
                                getFreeBtn.click();
                            }
                        }, 1000);
                    }
                });
            }, 1000);
        }
    });

    // Твой код начинается здесь
    const excludedCards = ["trumplin"];
    let scriptRunning = true; // Флаг для управления состоянием скрипта

    // Создаем круглую кнопку для управления скриптом
    function createControlButton() {
        const button = document.createElement('button');
        button.textContent = '●'; // Символ круга
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '10000';
        button.style.width = '40px'; // Маленький размер
        button.style.height = '40px'; // Маленький размер
        button.style.borderRadius = '50%'; // Делаем кнопку круглой
        button.style.backgroundColor = scriptRunning ? '#44ff44' : '#ff4444'; // Зелёный при включенном, красный при выключенном
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.fontSize = '20px';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)'; // Тень для красоты

        // Обработчик клика
        button.addEventListener('click', () => {
            scriptRunning = !scriptRunning;
            button.style.backgroundColor = scriptRunning ? '#44ff44' : '#ff4444'; // Меняем цвет
            console.log(`Скрипт ${scriptRunning ? 'запущен' : 'остановлен'}`);
        });

        document.body.appendChild(button);
    }

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
        } else if (priceString.includes('t')) {
            priceNumber *= 1000000000000;
        }

        return priceNumber;
    }

    // Функция для получения текущего баланса
    function getCurrentBalance() {
        const balanceElements = document.querySelectorAll(".balance-value");
        if (balanceElements.length >= 2) {
            const balanceText = balanceElements[1].textContent.trim();
            return convertPriceToNumber(balanceText);
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
        if (cards.length === 0 || !scriptRunning) return;

        const card = cards.shift();
        const currentBalance = getCurrentBalance();

        if (currentBalance < card.price) {
            document.querySelector('button.van-button--success.van-button--large.van-button--block.shadow').click();
            document.querySelector('button.van-button--success.van-button--large.van-button--block.shadow').click();
            console.log(`Недостаточно средств для улучшения карты: ${card.name}. Баланс: ${currentBalance}, Требуется: ${card.price}`);
            scriptRunning = false;
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

    // Создаем кнопку при запуске скрипта
    createControlButton();

    // Запускаем основной цикл
    setInterval(readAndSortCards, 3000);
})();

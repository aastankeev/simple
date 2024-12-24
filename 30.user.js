// ==UserScript==
// @name         Zoo
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Автоматизация сбора ежедневной награды и покупки животных в игре
// @author       
// @match        *://*game.zoo.team/*
// @grant        none
// @icon         https://game.zoo.team/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/30.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/30.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function waitForTasksButton() {
    'use strict';

    // Периодическая проверка наличия кнопки "Задачи"
    const interval = setInterval(() => {
        const tasksButton = Array.from(document.querySelectorAll("#app .flyBtnTitle"))
            .find(button => button.textContent.trim() === "Задачи");

        if (tasksButton) {
            clearInterval(interval); // Прекращаем проверку
            console.log("Кнопка 'Задачи' найдена, запускаем скрипт.");
            startGameAutomation(tasksButton);
        } else {
            console.log("Кнопка 'Задачи' пока не найдена, повторяем проверку...");
        }
    }, 2000); // Проверяем каждые 2 секунды

    function startGameAutomation(tasksButton) {
        // Клик по кнопке "Задачи"
        tasksButton.click();

        // Дождаться загрузки списка задач
        setTimeout(() => {
            const dailyReward = document.querySelector(".dailyReward");

            if (dailyReward && !dailyReward.classList.contains("grayscale")) {
                // Если награда доступна, кликаем по ней
                dailyReward.click();

                // Дождаться открытия подменю и кликнуть по кнопке "Получить награду"
                setTimeout(() => {
                    const claimButton = document.querySelector(
                        "button.van-button--warning.van-button--large.van-button--round span.van-button__text"
                    );
                    if (claimButton && claimButton.textContent.trim() === "Получить награду") {
                        claimButton.closest("button").click();
                        console.log("Ежедневная награда получена.");

                        // Закрываем меню задач
                        setTimeout(() => {
                            const closeButton = document.querySelector(
                                'i.van-popup__close-icon.van-popup__close-icon--top-right'
                            );
                            if (closeButton) {
                                closeButton.click();
                                console.log('Меню закрыто.');
                            } else {
                                console.log('Кнопка выхода из меню не найдена.');
                            }
                        }, 1000);
                    } else {
                        console.log("Кнопка 'Получить награду' не найдена.");
                    }
                }, 500);
            } else {
                console.log("Ежедневная награда уже собрана или недоступна.");
            }
        }, 1000);

        // Выполнение дополнительных действий
        performAdditionalActions();
    }

    function performAdditionalActions() {
        // Находим все элементы с классом "point"
        const points = document.querySelectorAll('.point');
        const emptySlots = [];

        // Перебираем все элементы с классом "point"
        points.forEach(point => {
            const emptySlot = point.querySelector('.emptySlot');
            if (emptySlot) {
                const style = window.getComputedStyle(point);
                const left = style.left;
                const top = style.top;
                emptySlots.push({ point, left, top });
            } else {
                console.log('Слот занят или не найден:', point);
            }
        });

        if (emptySlots.length > 0) {
            const randomSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
            const pointClick = document.querySelector(`.pointClick[style*="left: ${randomSlot.left}; top: ${randomSlot.top};"]`);

            if (pointClick) {
                if (isElementVisible(pointClick)) {
                    pointClick.click();
                    console.log('Кликнули по случайному свободному слоту:', pointClick);
                } else {
                    console.log('Слот скрыт или не доступен для клика:', pointClick);
                }
            } else {
                console.log('Не найден элемент с классом "pointClick" для выбранного слота.');
            }
        } else {
            console.log('Свободные слоты не найдены.');
        }

        // Ищем и покупаем доступных животных
        buyAnimals();
    }

    function buyAnimals() {
        // Ищем все доступные животные
        const animals = Array.from(document.querySelectorAll('.animalForBuy')).map(animal => {
            const titleElement = animal.querySelector('.title');
            const priceText = animal.querySelector('.van-button__text').textContent.trim();
            const price = parseInt(priceText.replace(/\D/g, ''), 10);

            return {
                name: titleElement ? titleElement.textContent.trim() : 'Неизвестное животное',
                price: price,
                element: animal.querySelector('button.van-button--success')
            };
        }).filter(animal => animal.price > 0);

        animals.sort((a, b) => a.price - b.price);

        // Проверка баланса
        const moneyElement = document.querySelector('.zTextShadow2white');
        let money = 0;

        if (moneyElement) {
            const moneyText = moneyElement.textContent.trim();

            if (moneyText.includes('K')) {
                money = parseFloat(moneyText.replace('K', '').trim()) * 1000;
            } else if (moneyText.includes('M')) {
                money = parseFloat(moneyText.replace('M', '').trim()) * 1000000;
            } else if (moneyText.includes('B')) {
                money = parseFloat(moneyText.replace('B', '').trim()) * 1000000000;
            } else {
                money = parseFloat(moneyText);
            }

            console.log('У вас есть денег: ', money);
        } else {
            console.log('Сумма денег не найдена.');
            return;
        }

        const cheapestAnimal = animals.find(animal => animal.price <= money);

        if (cheapestAnimal) {
            cheapestAnimal.element.click();
            console.log('Купили самое дешевое животное:', cheapestAnimal.name);
        } else {
            console.log('Не хватает денег для покупки самого дешевого животного.');
        }
    }

    // Функция проверки видимости элемента
    function isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }
})();

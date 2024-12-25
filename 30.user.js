// ==UserScript==
// @name         Zoo
// @namespace    http://tampermonkey.net/
// @version      10
// @description  Автоматизация сбора ежедневной награды и покупки животных в игре
// @author
// @match        *://*game.zoo.team/*
// @grant        none
// @icon         https://game.zoo.team/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/30.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/30.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function gameAutomation() {
    'use strict';

    // Основная функция для автоматизации
    function startAutomation() {
        console.log("Запуск автоматизации...");
        handleAnimalPurchase();
    }

    // Функция для работы с покупкой животных
    function handleAnimalPurchase() {
        const animals = Array.from(document.querySelectorAll('.animalForBuy')).map(animal => {
            const titleElement = animal.querySelector('.title');
            const priceText = animal.querySelector('.van-button__text').textContent.trim();
            const price = parseInt(priceText.replace(/\D/g, ''), 10); // извлекаем цену

            return {
                name: titleElement ? titleElement.textContent.trim() : 'Неизвестное животное',
                price: price,
                element: animal.querySelector('button.van-button--success') // кнопка "Купить животное"
            };
        }).filter(animal => animal.price > 0); // фильтруем только животных с правильной ценой

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
            setTimeout(() => {
                cheapestAnimal.element.click();
                console.log('Купили самое дешевое животное:', cheapestAnimal.name);
                scheduleRestart();
            }, 1000); // Задержка для плавности
        } else {
            console.log('Недостаточно денег для покупки. Переходим к задачам...');
            handleTasks();
        }
    }

    // Функция для работы с задачами
    function handleTasks() {
        const tasksInterval = setInterval(() => {
            const tasksButton = Array.from(document.querySelectorAll("#app .flyBtnTitle"))
                .find(button => button.textContent.trim() === "Задачи");

            if (tasksButton) {
                clearInterval(tasksInterval);
                console.log("Кнопка 'Задачи' найдена, начинаем работу с задачами.");
                tasksButton.click();

                setTimeout(() => {
                    const dailyReward = document.querySelector(".dailyReward");

                    if (dailyReward && !dailyReward.classList.contains("grayscale")) {
                        dailyReward.click();
                        console.log("Кликнули по ежедневной награде.");

                        setTimeout(() => {
                            const claimButton = document.querySelector(
                                "button.van-button--warning.van-button--large.van-button--round span.van-button__text"
                            );
                            if (claimButton && claimButton.textContent.trim() === "Получить награду") {
                                claimButton.closest("button").click();
                                console.log("Ежедневная награда получена.");

                                setTimeout(closeTasksMenu, 1000);
                            } else {
                                console.log("Кнопка 'Получить награду' не найдена.");
                                setTimeout(closeTasksMenu, 1000);
                            }
                        }, 1000);
                    } else {
                        console.log("Ежедневная награда уже собрана или недоступна.");
                        setTimeout(closeTasksMenu, 1000);
                    }
                }, 1000);
            } else {
                console.log("Кнопка 'Задачи' пока не найдена, повторяем проверку...");
            }
        }, 2000);
    }

    function closeTasksMenu() {
        const closeButton = document.querySelector(".van-overlay--visible + .van-popup__close-icon");
        if (closeButton) {
            closeButton.click();
            console.log("Закрыли меню задач.");
        } else {
            console.log("Кнопка закрытия меню задач не найдена.");
        }

        scheduleRestart();
    }

    function scheduleRestart() {
        const delay = 5000; // Задержка перед перезапуском
        console.log(`Перезапуск скрипта через ${delay / 1000} секунд...`);
        setTimeout(startAutomation, delay);
    }

    // Запуск автоматизации
    startAutomation();
})();

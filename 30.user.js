// ==UserScript==
// @name         Zoo
// @namespace    http://tampermonkey.net/
// @version      16
// @description  Автоматизация сбора ежедневной награды и покупки животных в игре
// @author       
// @match        *://*game.zoo.team/*
// @grant        none
// @icon         https://game.zoo.team/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/30.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/30.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function zooAutomation() {
    const delay = 5000; // Задержка перед действиями и перезапуском (5 секунд)

    // Запуск основного процесса
    function startAutomation() {
        console.log("Запуск автоматизации...");
        isElementVisible(element);
    }
    // Проверка баланса
    function isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }
    // Проверка наличия свободного слота
    function waitForEmptySlot() {
        console.log("Проверяем наличие свободных слотов...");
        const points = document.querySelectorAll('.point');
        const emptySlots = [];

        points.forEach(point => {
            const emptySlot = point.querySelector('.emptySlot');
            if (emptySlot) {
                const style = window.getComputedStyle(point);
                const left = style.left;
                const top = style.top;
                emptySlots.push({ point, left, top });
            }
        });

        if (emptySlots.length > 0) {
            console.log("Свободный слот найден, продолжаем выполнение...");
            handleSlotAction(emptySlots);
        } else {
            console.log("Свободных слотов нет, повторяем проверку через 2 секунды...");
            setTimeout(waitForEmptySlot, 2000); // Повторяем проверку через 2 секунды
        }
    }

    // Действие с пустым слотом
    function handleSlotAction(emptySlots) {
        const randomSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
        const pointClick = document.querySelector(`.pointClick[style*="left: ${randomSlot.left}; top: ${randomSlot.top};"]`);

        if (pointClick && isElementVisible(pointClick)) {
            setTimeout(() => {
                pointClick.click();
                console.log("Кликнули по случайному свободному слоту:", randomSlot);
                handleAnimalPurchase();
            }, 1000); // Задержка 1 секунда перед кликом
        } else {
            console.log("Элемент для клика не найден или невидим.");
            setTimeout(startAutomation, delay); // Перезапуск
        }
    }

    // Покупка животного
function handleAnimalPurchase() {
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

    const moneyElement = document.querySelector('.zTextShadow2white');
    let money = 0;

    if (moneyElement) {
        const moneyText = moneyElement.textContent.trim();
        if (moneyText.includes('K')) money = parseFloat(moneyText.replace('K', '').trim()) * 1000;
        else if (moneyText.includes('M')) money = parseFloat(moneyText.replace('M', '').trim()) * 1000000;
        else if (moneyText.includes('B')) money = parseFloat(moneyText.replace('B', '').trim()) * 1000000000;
        else money = parseFloat(moneyText);

        console.log("Денег доступно:", money);
    } else {
        console.log("Не удалось определить баланс.");
        setTimeout(startAutomation, 5000); // Задержка перед перезапуском
        return;
    }

    const cheapestAnimal = animals.find(animal => animal.price <= money);
    if (cheapestAnimal) {
        setTimeout(() => {
            cheapestAnimal.element.click();
            console.log("Купили самое дешевое животное:", cheapestAnimal.name);
            setTimeout(startAutomation, 5000); // Задержка перед перезапуском
        }, 1000); // Задержка 1 секунда перед покупкой
    } else {
        console.log('Недостаточно денег для покупки. Закрываем окно и переходим к задачам...');
        const closeButton = document.querySelector('.van-popup__close-icon');
        if (closeButton) {
            closeButton.click();
            console.log("Закрыли всплывающее окно.");
        }
        setTimeout(() => {
            handleTasks(); // Переход к задачам после задержки
        }, 2000); // Задержка 2 секунды
    }
}
// Работа с задачами
function handleTasks() {
    const tasksButton = Array.from(document.querySelectorAll("#app .flyBtnTitle"))
        .find(button => button.textContent.trim() === "Задачи");

    if (tasksButton) {
        tasksButton.click();
        console.log("Кликнули по кнопке 'Задачи'.");
        setTimeout(collectDailyReward, 1000);
    } else {
        console.log("Кнопка 'Задачи' не найдена. Завершаем скрипт.");
        terminateScript();
    }
}

// Сбор ежедневной награды
function collectDailyReward() {
    const dailyReward = document.querySelector(".dailyReward");
    if (dailyReward && !dailyReward.classList.contains("grayscale")) {
        dailyReward.click();
        console.log("Собрали ежедневную награду.");
    } else {
        console.log("Ежедневная награда уже собрана или недоступна.");
    }
    terminateScript();
}

// Завершение скрипта
function terminateScript() {
    console.log("Скрипт завершён.");
    // Дополнительные действия при завершении, если нужны
}


    // Запуск автоматизации
    startAutomation();
})();

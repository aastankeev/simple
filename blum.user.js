// ==UserScript== 
// @name        blum/main
// @namespace   Violentmonkey Scripts
// @match       https://telegram.blum.codes/*
// @grant       none
// @version     3
// @description 15.12.2024, 08:52:00

// ==/UserScript==

// Флаг для отслеживания статуса выполнения скрипта
let isFirstTabClicked = false;
let isSecondTabClicked = false;

// Функция ожидания
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Ждем, пока первая вкладка появится и выполняем клик
const waitForFirstTab = setInterval(async () => {
    if (isFirstTabClicked) {
        clearInterval(waitForFirstTab); // Останавливаем проверку, если клик уже выполнен
        return;
    }

    const firstTabElement = document.querySelector('.tab');
    if (firstTabElement) {
        clearInterval(waitForFirstTab); // Останавливаем проверку
        firstTabElement.click(); // Кликаем по первой вкладке
        isFirstTabClicked = true; // Устанавливаем флаг выполнения
        console.log("Первая вкладка была нажата.");

        // Ждем 5 секунд
        await wait(5000);

        // Переход ко второй вкладке
        const secondTabElement = document.querySelector('a[href="/tasks"].tab');
        if (secondTabElement && !isSecondTabClicked) {
            secondTabElement.click(); // Кликаем по второй вкладке
            isSecondTabClicked = true; // Устанавливаем флаг выполнения
            console.log("Вторая вкладка была нажата.");
        }
    }
}, 1000); // Проверяем каждые 1000 мс

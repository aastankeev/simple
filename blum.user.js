// ==UserScript==
// @name        blum/main
// @namespace   Violentmonkey Scripts
// @match       https://telegram.blum.codes/*
// @grant       none
// @version     2
// @description 15.12.2024, 08:52:00

// ==/UserScript==
    // Ждем, пока элемент появится
const waitForElement = setInterval(() => {
    const tabElement = document.querySelector('.tab');
    if (tabElement) {
        clearInterval(waitForElement);  // Останавливаем проверку
        tabElement.click();  // Выполняем клик
    }
}, 100);  // Проверяем каждые 100 мс

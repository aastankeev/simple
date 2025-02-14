// ==UserScript==
// @name         donot
// @namespace    Violentmonkey Scripts
// @version      5     
// @description  
// @match        *://*donut.coolapps.me/*
// @grant        none
// @icon         https://cdn-icons-png.flaticon.com/128/189/189129.png
// @downloadURL  https://github.com/aastankeev/simple/raw/main/donot.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/donot.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, description, callback) {
        const checkExist = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checkExist);
                console.log(`${description} найдена!`);
                element.click();
                setTimeout(callback, 1000);
            }
        }, 500);
    }

    function waitForShopButton(callback) {
        const checkExist = setInterval(() => {
            const shopButton = Array.from(document.querySelectorAll('button._button_hzhtf_19')).find(button => {
                return button.textContent.trim() === 'Магазин'; // Убираем лишние пробелы
            });

            if (shopButton) {
                clearInterval(checkExist);
                console.log('Кнопка "Магазин" найдена, нажимаем!');
                shopButton.click();
                setTimeout(callback, 1000);
            }
        }, 500);
    }

    // Ждем кнопку "Лавка", потом "Магазин", потом награду
    waitForElement('button._bakeryButton_1fg5n_19', 'Кнопка "Лавка"', () => {
        waitForShopButton(() => {
            waitForElement('button._button_hzhtf_19._button--black_hzhtf_56._button--moreRound_hzhtf_80._buyButton_1bpcu_158', 'Кнопка награды');
        });
    });

})();

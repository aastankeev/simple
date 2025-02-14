// ==UserScript==
// @name         donot
// @namespace    Violentmonkey Scripts
// @version      3     
// @description  
// @match        *://*donut.coolapps.me/*
// @grant        none
// @icon         https://donut.coolapps.me/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/donot.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/donot.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
    'use strict';

    function clickButton(selector, description, callback) {
        const button = document.querySelector(selector);
        if (button) {
            button.click();
            console.log(`${description} нажата!`);
            if (callback) setTimeout(callback, 1000);
        } else {
            console.error(`${description} не найдена`);
        }
    }

    // Нажимаем "Лавка", затем "Магазин", затем получаем награду
    clickButton('button._bakeryButton_1fg5n_19', 'Кнопка "Лавка"', () => {
        clickButton("button._button_hzhtf_19 span:contains('Магазин')", 'Кнопка "Магазин"', () => {
            clickButton('button._button_hzhtf_19._button--black_hzhtf_56._button--moreRound_hzhtf_80._buyButton_1bpcu_158', 'Кнопка награды');
        });
    });
})();


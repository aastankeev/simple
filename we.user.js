// ==UserScript==
// @name         Wemainer
// @namespace    http://tampermonkey.net/
// @version      2
// @description  
// @author       YourName
// @match        *://*app.wemine.pro/*
// @grant        none
// @icon         https://img.icons8.com/?size=77&id=9T8Gef2DVZ89&format=png
// @downloadURL  https://github.com/aastankeev/simple/raw/main/we.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/we.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
    'use strict';

    // Функция для клика по кнопке Claim
    function clickClaimButton() {
        const button = document.querySelector('div.button.Claim');
        if (button) {
            button.click();
            console.log("Кнопка Claim нажата.");
        } else {
            console.log("Кнопка Claim не найдена.");
        }
    }

    // Таймер ожидания 5 секунд
    setTimeout(clickClaimButton, 15000);
})();

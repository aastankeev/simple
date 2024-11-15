// ==UserScript==
// @name         Wemainer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  
// @author       YourName
// @match        *://*app.wemine.pro/*
// @grant        none
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

    // Таймер ожидания 15 секунд
    setTimeout(clickClaimButton, 15000);
})();

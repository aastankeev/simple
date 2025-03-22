// ==UserScript==
// @name         caps
// @namespace    ViolentMonkey
// @version      2
// @description  Автонажатие кнопки "Pick up" при появлении
// @match        *://capsbot.com/*
// @grant        none
// @icon         https://capsbot.com/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/caps.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/caps.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
    'use strict';

    let clicked = false;
    const selector = 'button.w-full.bg-white.py-3\\.5.rounded-2xl.text-sm.font-semibold.flex.items-center.justify-center';

    function checkAndClick() {
        if (clicked) return;
        const btn = document.querySelector(selector);
        if (btn && !btn.disabled && btn.offsetParent !== null) { // кнопка видима и не отключена
            btn.click();
            console.log('Pick up button clicked!');
            clicked = true;
        }
    }

    // Проверять каждую секунду
    const interval = setInterval(() => {
        if (clicked) {
            clearInterval(interval);
        } else {
            checkAndClick();
        }
    }, 1000);
})();

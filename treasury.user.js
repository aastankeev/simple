// ==UserScript==
// @name         treasury
// @namespace    http://tampermonkey.net/
// @version      2
// @description  menu
// @author       alex
// @match        *://*cdn.thetreasury.io/*
// @icon         https://cdn-icons-png.flaticon.com/128/4545/4545090.png
// @grant        none
// @downloadURL  https://github.com/aastankeev/simple/raw/main/treasury.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/treasury.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
    'use strict';

    // Селектор элемента, который нужно найти
    const targetSelector = 'div._tabsWrapper_42298_107 div._navIconContainer_42298_29';

    // Функция для проверки и клика
    function checkAndClick() {
        const elements = document.querySelectorAll(targetSelector);
        if (elements.length > 0) {
            console.log('Элемент найден, выполняется клик...');
            elements[0].click();
            return true;
        }
        return false;
    }

    // Проверим сразу при загрузке скрипта
    if (checkAndClick()) {
        return;
    }

    // Если элемент не найден сразу, настроим наблюдение за DOM
    const observer = new MutationObserver(function(mutations) {
        if (checkAndClick()) {
            observer.disconnect(); // Остановить наблюдение после клика
            console.log('Наблюдение остановлено, элемент был найден и кликнут');
        }
    });

    // Начать наблюдение за изменениями в DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('Наблюдение за появлением элемента начато...');
})();

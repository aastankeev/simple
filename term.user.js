// ==UserScript==
// @name         terminal
// @namespace    http://tampermonkey.net/
// @version      1
// @description  автопуш
// @author
// @match        *://*app.0xterminal.game/*
// @grant        none
// @icon         https://app.0xterminal.game/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/term.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/term.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function () {
    'use strict';

    // Флаг для отслеживания нажатия
    let buttonClicked = false;

    // Функция поиска и нажатия кнопки
    function findAndClickButton() {
        // Ищем кнопку по частичному совпадению классов
        const buttons = document.querySelectorAll('button.relative.size-256.rounded-full.p-2');

        for (const button of buttons) {
            const bgClass = Array.from(button.classList).find(cls =>
                cls.startsWith('bg-[') && cls.includes('linear-gradient')
            );
            const activeClass = Array.from(button.classList).find(cls =>
                cls.includes('!opacity-100')
            );

            if (bgClass && activeClass && !buttonClicked) {
                button.click(); // Нажимаем на кнопку
                buttonClicked = true; // Устанавливаем флаг
                console.log("Кнопка нажата. Скрипт завершен.");
                break;
            }
        }

        if (!buttonClicked) {
            console.log("Кнопка не найдена.");
        }
    }

    // Выполняем поиск кнопки
    findAndClickButton();

    // Проверяем флаг, чтобы завершить скрипт
    if (buttonClicked) {
        return;
    } else {
        // Если кнопка не найдена сразу, пытаемся повторить через небольшую задержку
        setTimeout(() => {
            findAndClickButton();
        }, 3000);
    }
})();

// ==UserScript==
// @name         PocketFI
// @namespace    Violentmonkey Scripts
// @version      2
// @description  
// @match        *://*pocketfi.app/*
// @grant        none
// @icon         https://pocketfi.app/vite.svg
// @downloadURL  https://github.com/aastankeev/simple/raw/main/fp.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/fp.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function () {
    'use strict';

    // Флаг для отслеживания нажатия
    let elementClicked = false;

    // Функция поиска и нажатия на элемент
    function findAndClickElement() {
        // Ищем элемент по селектору
        const element = document.querySelector("span.font-extrabold.leading-tight.text-md.select-none");

        if (element && !elementClicked) {
            element.click(); // Нажимаем на элемент
            elementClicked = true; // Устанавливаем флаг
            console.log("Элемент найден и нажат. Скрипт завершен.");
        } else {
            console.log("Элемент не найден.");
        }
    }

    // Функция с задержкой перед выполнением
    function startScript() {
        // Выполняем поиск элемента
        findAndClickElement();

        // Проверяем флаг, чтобы завершить скрипт
        if (elementClicked) {
            return;
        } else {
            // Если элемент не найден сразу, пытаемся повторить через небольшую задержку
            setTimeout(() => {
                findAndClickElement();
            }, 3000);
        }
    }

    // Добавляем задержку перед выполнением скрипта
    setTimeout(() => {
        startScript();
    }, Math.random() * 5000 + 5000); // Задержка от 5 до 10 секунд
})();

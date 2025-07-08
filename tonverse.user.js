// ==UserScript==
// @name         tonverse
// @namespace    http://tampermonkey.net/
// @version      7
// @description
// @match        *://*app.tonverse.app/*
// @grant        none
// @icon         https://cdn.icon-icons.com/icons2/39/PNG/128/favoritesilver_star_favorite_6338.png
// @downloadURL  https://github.com/aastankeev/simple/raw/main/tonverse.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/tonverse.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
    'use strict';

    // 🔁 Функция для постоянного поиска и нажатия "Эволюционировать Ещё"
    function autoClickEvolveMore() {
        setInterval(() => {
            const buttons = document.querySelectorAll('button.ui-button');
            buttons.forEach(btn => {
                const span = btn.querySelector('span');
                if (span && span.textContent.trim() === "Эволюционировать Ещё") {
                    btn.click();
                    console.log("Нажата кнопка 'Эволюционировать Ещё'");
                }
            });
        }, 1000); // каждые 1 секунда
    }

    // Запускаем функцию
    autoClickEvolveMore();

    // ⏱ Ждем 10 секунд перед выполнением остального кода
    setTimeout(() => {
        const bottomDiv = document.querySelector('#ui-bottom');

        if (bottomDiv) {
            const links = bottomDiv.querySelectorAll('a.ui-link.blur');
            if (links.length >= 2) {
                links[1].click();
                console.log("Второй элемент <a> с классом 'ui-link blur' нажат!");

                const delay = Math.random() * 2000 + 1000;
                setTimeout(() => {
                    links[0].click();
                    console.log("Первый элемент <a> с классом 'ui-link blur' нажат!");
                }, delay);
            } else {
                console.log("Меньше двух элементов <a> с классом 'ui-link blur' найдено.");
            }
        } else {
            console.log("Контейнер #ui-bottom не найден.");
        }

        // ❌ Отключено: Автоклик по кнопке "Создать 100 Звезд"
        /*
        setTimeout(() => {
            const button = document.querySelector('html > body > div#app > div#page-view > div.page-content > div.content > div.content-body.blur > div > button.ui-button');
            if (button) {
                button.click();
                console.log("Кнопка 'Создать 100 Звезд' нажата!");
            } else {
                console.log("Кнопка 'Создать 100 Звезд' не найдена.");
            }
        }, 3000);
        */

    }, 10000);

})();

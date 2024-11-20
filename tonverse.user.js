// ==UserScript==
// @name         tonverse
// @namespace    http://tampermonkey.net/
// @version      1
// @description
// @author       You
// @match        *://*app.tonverse.app/*
// @grant        none
// @icon         https://cdn.icon-icons.com/icons2/39/PNG/128/favoritesilver_star_favorite_6338.png
// @downloadURL  https://github.com/aastankeev/simple/raw/main/tonverse.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/tonverse.user.js
// @homepage     https://github.com/aastankeev/simple
// @wait-for      document.readyState === 'complete'  // Ждем полной загрузки страницы
// ==/UserScript==

(function() {
    'use strict';

    // Ожидаем полной загрузки страницы
    window.addEventListener('load', () => {

        // Находим контейнер с id 'ui-bottom'
        const bottomDiv = document.querySelector('#ui-bottom');

        // Проверяем, что контейнер существует
        if (bottomDiv) {
            // Находим все элементы <a> с классом 'ui-link blur' внутри контейнера
            const links = bottomDiv.querySelectorAll('a.ui-link.blur');

            // Проверяем, что найдено хотя бы два таких элемента
            if (links.length >= 2) {
                // Нажимаем второй элемент
                links[1].click();
                console.log("Второй элемент <a> с классом 'ui-link blur' нажат!");

                // Генерируем случайное время задержки от 1 до 3 секунд
                const delay = Math.random() * 2000 + 1000;

                // Устанавливаем таймер для нажатия на первый элемент
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

        // Задержка перед поиском кнопки
        setTimeout(() => {
            // Путь до кнопки
            const button = document.querySelector('html > body > div#app > div#page-view > div.page-content > div.content > div.content-body.blur > div > button.ui-button');

            // Проверяем, что кнопка найдена
            if (button) {
                // Нажимаем на кнопку
                button.click();
                console.log("Кнопка 'Создать 100 Звезд' нажата!");
            } else {
                console.log("Кнопка 'Создать 100 Звезд' не найдена.");
            }
        }, 3000);  // 3 секунды задержки, можно увеличить в зависимости от времени загрузки
    });

})();


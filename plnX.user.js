// ==UserScript==
// @name         planetX
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Автоматически нажимает кнопки "Возобновить добычу" и "Перезарядить"
// @author       lab404
// @match        *://*xplanet.online/*
// @grant        none
// @icon         https://xplanet.online/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/plnX.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/plnX.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
    'use strict';

    // Функция для ожидания и нажатия кнопки "Возобновить добычу"
    function waitForResumeButton() {
        const resumeButtonSelector = 'button.btn.is-color-red.is-size-small.\\!px-2 span.btn__text.text-xs';

        const checkInterval = setInterval(() => {
            const resumeButtonTextElements = document.querySelectorAll(resumeButtonSelector);

            for (const element of resumeButtonTextElements) {
                if (element.textContent.trim() === 'Возобновить добычу') {
                    const button = element.closest('button');
                    if (button) {
                        button.click();
                        console.log('Кнопка "Возобновить добычу" найдена и нажата');
                        clearInterval(checkInterval);

                        // После нажатия "Возобновить добычу" ждём кнопку "Перезарядить"
                        setTimeout(waitForReloadButton, 1000);
                    }
                }
            }
        }, 500);
    }

    // Функция для ожидания и нажатия кнопки "Перезарядить"
    function waitForReloadButton() {
        const reloadButtonSelector = 'button.btn.is-size-small.relative.mx-auto.\\!px-3 span.btn__text.text-xs';

        const checkInterval = setInterval(() => {
            const reloadButtonTextElements = document.querySelectorAll(reloadButtonSelector);

            for (const element of reloadButtonTextElements) {
                if (element.textContent.trim() === 'Перезарядить') {
                    const button = element.closest('button');
                    if (button) {
                        button.click();
                        console.log('Кнопка "Перезарядить" найдена и нажата');
                        clearInterval(checkInterval);

                        // После выполнения всей последовательности можно снова начать цикл
                        setTimeout(waitForResumeButton, 5000);
                    }
                }
            }
        }, 500);
    }

    // Запускаем процесс после полной загрузки страницы
    window.addEventListener('load', function() {
        console.log('Начинаем мониторинг кнопок...');
        waitForResumeButton();
    });

    // Также запускаем сразу (на случай если страница уже загружена)
    console.log('Скрипт автокликера активирован');
    waitForResumeButton();
})();

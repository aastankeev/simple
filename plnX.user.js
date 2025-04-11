// ==UserScript==
// @name         planetX
// @namespace    http://tampermonkey.net/
// @version      5
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

    let resumeAttempts = 0;
    const maxResumeAttempts = 10;

    // Функция для выполнения ежедневных квестов
    async function doDailyQuests() {
        console.log('Начинаем выполнение ежедневных квестов...');

        // Ждём появления и нажимаем на "Квесты"
        const openTasks = () => document.querySelector('a[href="/tasks"]')?.click();
        while (!document.querySelector('a[href="/tasks"]')) await new Promise(r => setTimeout(r, 300));
        openTasks();

        // Ждём загрузку раздела с ежедневными заданиями
        const openDailyTask = () => {
            const dailyBtn = Array.from(document.querySelectorAll("button")).find(btn =>
                btn.textContent.includes("Ежедневная награда")
            );
            if (dailyBtn) dailyBtn.click();
        };
        while (!Array.from(document.querySelectorAll("button")).some(btn => btn.textContent.includes("Ежедневная награда")))
            await new Promise(r => setTimeout(r, 300));
        openDailyTask();

        // Ждём кнопку "Получить награду"
        const claimReward = () => {
            const rewardBtn = Array.from(document.querySelectorAll("button")).find(btn =>
                btn.textContent.includes("Получить награду")
            );
            if (rewardBtn) rewardBtn.click();
        };
        while (!Array.from(document.querySelectorAll("button")).some(btn => btn.textContent.includes("Получить награду")))
            await new Promise(r => setTimeout(r, 300));
        claimReward();

        console.log('Ежедневные квесты выполнены, возвращаемся к мониторингу добычи...');
        // После выполнения квестов сбрасываем счётчик и начинаем мониторить добычу снова
        resumeAttempts = 0;
        setTimeout(waitForResumeButton, 5000);
    }

    // Функция для ожидания и нажатия кнопки "Возобновить добычу"
    function waitForResumeButton() {
        const resumeButtonSelector = 'button.btn.is-color-red.is-size-small.\\!px-2 span.btn__text.text-xs';

        const checkInterval = setInterval(() => {
            const resumeButtonTextElements = document.querySelectorAll(resumeButtonSelector);
            let found = false;

            for (const element of resumeButtonTextElements) {
                if (element.textContent.trim() === 'Возобновить добычу') {
                    const button = element.closest('button');
                    if (button) {
                        button.click();
                        console.log('Кнопка "Возобновить добычу" найдена и нажата');
                        clearInterval(checkInterval);
                        resumeAttempts = 0; // Сброс счётчика при успешном нажатии

                        // После нажатия "Возобновить добычу" ждём кнопку "Перезарядить"
                        setTimeout(waitForReloadButton, 1000);
                        found = true;
                    }
                }
            }

            if (!found) {
                resumeAttempts++;
                console.log(`Попытка ${resumeAttempts}/${maxResumeAttempts}: Кнопка "Возобновить добычу" не найдена`);

                if (resumeAttempts >= maxResumeAttempts) {
                    clearInterval(checkInterval);
                    console.log(`Кнопка "Возобновить добычу" не найдена после ${maxResumeAttempts} попыток, переходим к квестам`);
                    doDailyQuests();
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

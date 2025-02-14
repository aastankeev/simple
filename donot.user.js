// ==UserScript==
// @name         donot
// @namespace    Violentmonkey Scripts
// @version      2     
// @description  
// @match        *://*donut.coolapps.me/*
// @grant        none
// @icon         https://donut.coolapps.me/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/donot.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/donot.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
    'use strict';

    // Задержка перед запуском скрипта (10 секунд)
    setTimeout(() => {
        console.log('Скрипт запущен через 10 секунд');

        // Функция для ожидания появления элемента и выполнения действия
        function waitForElement(selector, callback) {
            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect(); // Останавливаем наблюдение
                    callback(element); // Выполняем действие
                }
            });

            // Начинаем наблюдение за изменениями в DOM
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // Шаг 1: Ожидание и нажатие кнопки "Лавка"
        waitForElement('button._bakeryButton_1fg5n_19', (bakeryButton) => {
            bakeryButton.click();
            console.log('Кнопка "Лавка" нажата!');

            // Задержка 1 секунда перед следующим шагом
            setTimeout(() => {
                // Шаг 2: Ожидание и нажатие кнопки "Магазин"
                waitForElement('button._button_hzhtf_19', () => {
                    const shopButton = Array.from(document.querySelectorAll('button._button_hzhtf_19')).find(button => {
                        return button.querySelector('span')?.textContent === 'Магазин';
                    });

                    if (shopButton) {
                        shopButton.click();
                        console.log('Кнопка "Магазин" нажата!');

                        // Задержка 1 секунда перед следующим шагом
                        setTimeout(() => {
                            // Шаг 3: Ожидание и нажатие третьей кнопки
                            waitForElement('button._button_hzhtf_19._button--black_hzhtf_56._button--moreRound_hzhtf_80._buyButton_1bpcu_158', (button) => {
                                button.click();
                                console.log('Третья кнопка нажата!');
                            });
                        }, 1000); // Задержка 1 секунда
                    } else {
                        console.error('Кнопка с текстом "Магазин" не найдена');
                    }
                });
            }, 1000); // Задержка 1 секунда
        });
    }, 10000); // Задержка 10 секунд перед запуском скрипта
})();
        });
    });
})();

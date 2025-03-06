// ==UserScript==
// @name        city-holder автозапуск среднее
// @namespace   Violentmonkey Scripts
// @version     126
// @description fix_08-11-2024; 11-11-2024; 12-11-2024; 09-12-2024; 19-12-2024; 20-12-2024; 10-01-2025; 31-01-2025; 06-03-2025
// @downloadURL https://github.com/aastankeev/simple/raw/main/hold-midlerun.user.js
// @updateURL   https://github.com/aastankeev/simple/raw/main/hold-midlerun.user.js
// @homepage    https://github.com/aastankeev/simple
// @icon        https://cdn-icons-png.flaticon.com/128/10345/10345749.png
// @match       https://app.city-holder.com/*
// @grant       none
// @run-at      document-end
// ==/UserScript==

(function() {
    'use strict';

    const log = (message, data = null) => {
        console.log(`[DEBUG] ${message}`, data || '');
    };

    // Функция для нажатия на кнопку
    const clickButton = (button) => {
        if (button && !button.disabled) {
            button.click();
            log('Кнопка нажата:', button);
            return true;
        }
        return false;
    };

    // Функция для нажатия на карточку здания
    const clickBuildingCard = async (buildingElement) => {
        if (buildingElement) {
            log('Нажимаем на карточку здания:', buildingElement);
            buildingElement.click();
            await new Promise(resolve => setTimeout(resolve, 500)); // Ждем загрузки карточки
            return true;
        }
        return false;
    };

    // Основная функция для проверки и нажатия кнопок
    const checkAndClickButtons = async () => {
        // Находим все вкладки
        const tabs = document.querySelectorAll('div._navItem_1ktcf_24');
        if (!tabs.length) {
            log('Вкладки не найдены.');
            return;
        }

        // Перебираем все вкладки
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].click(); // Переключаемся на вкладку
            log(`Переключились на вкладку: ${i + 1}`);

            // Ждем 500 мс для загрузки контента вкладки
            await new Promise(resolve => setTimeout(resolve, 500));

            // Находим все здания на текущей вкладке
            const buildings = document.querySelectorAll('div._main_1tsjb_105');
            if (!buildings.length) {
                log('Здания не найдены на этой вкладке.');
                continue;
            }

            // Перебираем все здания
            for (const building of buildings) {
                const nameElement = building.querySelector('div._title_xhvbx_1');
                if (!nameElement) {
                    log('Название здания не найдено.');
                    continue;
                }
                const name = nameElement.textContent.trim();
                log(`Обрабатываемое здание: ${name}`);

                // Нажимаем на карточку здания
                if (await clickBuildingCard(building)) {
                    // Ждем 500 мс для загрузки карточки
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // Проверяем доступность кнопок
                    const upgradeButton = document.querySelector('button._button_wnn9a_1._upgrade_wnn9a_66._normal_wnn9a_261');
                    const horoscopeButton = document.querySelector('button._button_wnn9a_1._horoscope_wnn9a_120._normal_wnn9a_261');
                    const buildButton = document.querySelector('button._button_wnn9a_1._action_wnn9a_48._normal_wnn9a_261');

                    // Нажимаем на первую доступную кнопку
                    if (clickButton(buildButton)) {
                        log('Нажата кнопка строительства.');
                    } else if (clickButton(upgradeButton)) {
                        log('Нажата кнопка улучшения.');
                    } else if (clickButton(horoscopeButton)) {
                        log('Нажата кнопка гороскопа.');
                    } else {
                        log('Нет доступных кнопок для этого здания.');
                    }

                    // Возвращаемся на вкладку
                    tabs[i].click();
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        }
    };

    // Запускаем основной цикл
    const startLoop = async () => {
        while (true) {
            await checkAndClickButtons(); // Проверяем и нажимаем кнопки
            await new Promise(resolve => setTimeout(resolve, 1000)); // Ждем 1 секунду перед следующим циклом
        }
    };

    // Запускаем скрипт с задержкой, чтобы дать время для загрузки страницы
    setTimeout(() => {
        log('Скрипт запущен.');
        startLoop();
    }, 5000);
})();

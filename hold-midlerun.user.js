// ==UserScript==
// @name        city-holder автозапуск среднее
// @namespace   Violentmonkey Scripts
// @version     128
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

    // НОВЫЙ: первичная кнопка
    const checkAndClickPrimaryButton = () => {
        const primaryButton = document.querySelector(
            'button._button_wnn9a_1._primary_wnn9a_28._normal_wnn9a_261'
        );
        if (primaryButton && !primaryButton.disabled) {
            primaryButton.click();
            log('Нажата первичная кнопка:', primaryButton);
            return true;
        }
        return false;
    };

    // НОВЫЙ: функция автоклика по ключевым словам
    const clickMatchingButtons = () => {
        const keywords = [
            'Улучшить',
            'Построить',
            'Покупка',
            'Отлично!',
            'Перейти к Строительству объектов'
        ];
        const buttons = Array.from(document.querySelectorAll('button'))
            .filter(btn => {
                const text = btn.textContent.trim();
                return keywords.some(word => text.includes(word)) && !btn.disabled;
            });
        buttons.forEach(btn => {
            btn.click();
            log(`Кнопка "${btn.textContent.trim()}" нажата`);
        });
    };

    // Существующий код: clickButton, clickBuildingCard, checkAndClickButtons
    const clickButton = (button) => {
        if (button && !button.disabled) {
            button.click();
            log('Кнопка нажата:', button);
            return true;
        }
        return false;
    };

    const clickBuildingCard = async (buildingElement) => {
        if (buildingElement) {
            log('Нажимаем на карточку здания:', buildingElement);
            buildingElement.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
        }
        return false;
    };

    const checkAndClickButtons = async () => {
        const tabs = document.querySelectorAll('div._navItem_1ktcf_24');
        if (!tabs.length) {
            log('Вкладки не найдены.');
            return;
        }

        for (let i = 0; i < tabs.length; i++) {
            tabs[i].click();
            log(`Переключились на вкладку: ${i + 1}`);
            await new Promise(resolve => setTimeout(resolve, 500));

            const buildings = document.querySelectorAll('div._main_1tsjb_105');
            if (!buildings.length) {
                log('Здания не найдены на этой вкладке.');
                continue;
            }

            for (const building of buildings) {
                const nameElement = building.querySelector('div._title_xhvbx_1');
                if (!nameElement) continue;

                const name = nameElement.textContent.trim();
                log(`Обрабатываемое здание: ${name}`);

                if (await clickBuildingCard(building)) {
                    await new Promise(resolve => setTimeout(resolve, 500));

                    const upgradeButton = document.querySelector('button._button_wnn9a_1._upgrade_wnn9a_66._normal_wnn9a_261');
                    const horoscopeButton = document.querySelector('button._button_wnn9a_1._horoscope_wnn9a_120._normal_wnn9a_261');
                    const buildButton = document.querySelector('button._button_wnn9a_1._action_wnn9a_48._normal_wnn9a_261');

                    if (clickButton(buildButton)) {
                        log('Нажата кнопка строительства.');
                    } else if (clickButton(upgradeButton)) {
                        log('Нажата кнопка улучшения.');
                    } else if (clickButton(horoscopeButton)) {
                        log('Нажата кнопка гороскопа.');
                    } else {
                        log('Нет доступных кнопок.');
                    }

                    tabs[i].click();
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        }
    };

    const startLoop = async () => {
        while (true) {
            await checkAndClickButtons();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    };

    setTimeout(() => {
        log('Скрипт запущен.');

        startLoop();

        // автоклик первичной кнопки каждые 3 сек
        setInterval(checkAndClickPrimaryButton, 3000);

        // автоклик ключевых кнопок каждые 500 мс
        setInterval(clickMatchingButtons, 500);
    }, 5000);
})();

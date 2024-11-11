// ==UserScript==
// @name        city-holder автозапуск среднее
// @namespace   Violentmonkey Scripts
// @version     111
// @description fix_08-11-2024/11-11-2024
// @downloadURL https://github.com/aastankeev/simple/raw/main/hold-midlerun.user.js
// @updateURL   https://github.com/aastankeev/simple/raw/main/hold-midlerun.user.js
// @homepage    https://github.com/aastankeev/simple
// @icon        https://cdn-icons-png.flaticon.com/128/10345/10345749.png
// @match       https://app.city-holder.com/*
// @grant       none
// @run-at      document-end
// ==/UserScript==

(function() {
    const clickButton = () => {
        const button = document.querySelector('div._btn_1mwk4_90 button._button_1ir11_1._primary_1ir11_25._normal_1ir11_211');
        if (button) {
            console.log("Кнопка 'Отлично!' найдена. Пытаемся нажать на нее...");
            button.click();
            console.log("Кнопка 'Отлично!' успешно нажата.");
        } else {
            console.log("Кнопка 'Отлично!' не найдена.");
        }
    };

    // Запускаем функцию с задержкой, чтобы дать время для загрузки страницы
    setTimeout(clickButton, 2000);

    'use strict';

    let isRunning = true; // Устанавливаем сразу в true для автоматического запуска

    const select = document.createElement('select');
    select.innerHTML = `
        <option value="">Выбери</option>
        <option value="income" selected>доход</option>
        <option value="population">население</option>
        <option value="combined">среднее</option>
    `;
    select.style.position = 'fixed';
    select.style.top = '100px';
    select.style.right = '10px';
    select.style.zIndex = 1000;
    select.style.padding = '10px';
    document.body.appendChild(select);

    const button = document.createElement('button');
    button.innerText = 'Остановить';
    button.style.position = 'fixed';
    button.style.top = '50px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        isRunning = !isRunning;
        button.innerText = isRunning ? 'Остановить' : 'Запустить';
        if (isRunning) {
            getBuildingDetails();
        }
    });

    // Запускаем getBuildingDetails с задержкой в 7 секунд для автоматического старта
    setTimeout(() => {
        if (isRunning) {
            getBuildingDetails();
        }
    }, 7000);

    function parseCost(costText) {
        if (!costText) return 0;
        return parseFloat(costText.replace(/,/g, '')) || 0;
    }

    function parseCost(costText) {
        if (!costText) return 0;
        return parseFloat(costText.replace(/,/g, '')) || 0;
    }

    function getGrowthType(url) {
        if (url.includes('M5.99967%201.33325C4.25301')) {
            return 'population';
        } else if (url.includes('M5.50641%2014.1633C5.93773')) {
            return 'income';
        }
        return null;
    }

    async function getBuildingDetails() {
        if (!isRunning) return;

        const tabs = document.querySelectorAll('div._navItem_1o6uf_24');
        const result = [];

        for (let i = 0; i < tabs.length; i++) {
            tabs[i].click();
            await new Promise(resolve => setTimeout(resolve, 500));

            const tabTitle = document.querySelector('div._header_16rj6_20 h2').textContent.trim();
            const buildings = Array.from(document.querySelectorAll('div._main_131sn_103')).map(building => {
                const name = building.querySelector('div._title_131sn_76').textContent.trim();
                const upgradeButton = building.querySelector('button._button_1ir11_1._upgrade_1ir11_63');
                const horoscopeButton = building.querySelector('button._button_1ir11_1._horoscope_1ir11_117');
                const buildButton = building.querySelector('button._button_1ir11_1._action_1ir11_45');

                let upgradeCost = null;
                // Проверяем, что кнопка улучшения или event кнопка существуют и не заблокированы
                if (upgradeButton && !upgradeButton.disabled) {
                    const costText = building.querySelector('span._price_180p0_34._green_180p0_40')?.textContent.trim();
                    upgradeCost = parseCost(costText);
                } else if (horoscopeButton && !horoscopeButton.disabled) { // Проверяем, что event-кнопка существует и не заблокирована
                    const costText = building.querySelector('span._price_180p0_34._green_180p0_40')?.textContent.trim();
                    upgradeCost = parseCost(costText);
                }

                let buildCost = null;
                if (buildButton) {
                    const costText = building.querySelector('span._price_180p0_34._green_180p0_40')?.textContent.trim();
                    buildCost = parseCost(costText);
                }

                const growthItems = Array.from(building.querySelectorAll('div._growthItem_180p0_26')).map(item => {
                    const title = item.querySelector('div._title_131sn_76')?.textContent.trim();
                    const svgElement = item.querySelector('img');
                    const url = svgElement ? svgElement.src : '';
                    const growthType = getGrowthType(url);
                    const growthValue = parseFloat(item.querySelector('span')?.textContent.trim().replace(',', '')) || 0;

                    return {
                        title: title,
                        type: growthType,
                        growthValue: growthValue
                    };
                });

                return {
                    name: name,
                    group: tabTitle,
                    canBuild: buildButton !== null,
                    upgradeAvailable: (upgradeButton && !upgradeButton.disabled) || (horoscopeButton && !horoscopeButton.disabled),
                    upgradeCost: upgradeCost,
                    buildCost: buildCost,
                    growthItems: growthItems
                };
            });

            buildings.forEach(building => {
                // Учитываем только те карточки, которые можно построить или улучшить (и кнопки не заблокированы)
                if (building.canBuild || building.upgradeAvailable) {
                    result.push({
                        name: building.name,
                        group: building.group,
                        type: building.canBuild ? 'Построить' : 'Улучшить',
                        cost: building.canBuild ? building.buildCost : building.upgradeCost,
                        growthItems: building.growthItems
                    });
                }
            });
        }

        const selectedType = select.value;
        let ratings = [];

        if (selectedType === 'income') {
            ratings = result.flatMap(building => building.growthItems.filter(item => item.type === 'income').map(item => ({
                name: building.name,
                group: building.group,
                cost: building.cost,
                growthValue: item.growthValue
            })))
            .filter(item => item.growthValue > 0 && item.cost > 0)
            .map(item => ({
                name: item.name,
                group: item.group,
                cost: item.cost,
                rating: item.growthValue / item.cost
            }))
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);
        } else if (selectedType === 'population') {
            ratings = result.flatMap(building => building.growthItems.filter(item => item.type === 'population').map(item => ({
                name: building.name,
                group: building.group,
                cost: building.cost,
                growthValue: item.growthValue
            })))
            .filter(item => item.growthValue > 0 && item.cost > 0)
            .map(item => ({
                name: item.name,
                group: item.group,
                cost: item.cost,
                rating: item.growthValue / item.cost
            }))
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);
        } else if (selectedType === 'combined') {
            ratings = result.map(building => {
                const income = building.growthItems.filter(item => item.type === 'income').reduce((sum, item) => sum + item.growthValue, 0);
                const population = building.growthItems.filter(item => item.type === 'population').reduce((sum, item) => sum + item.growthValue, 0);
                const combinedGrowth = income + population;
                return {
                    name: building.name,
                    group: building.group,
                    cost: building.cost,
                    rating: combinedGrowth / building.cost
                };
            })
            .filter(item => item.rating > 0 && item.cost > 0)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);
        }

        if (ratings.length > 0) {
            console.log(`Топ 5 построек по ${selectedType === 'income' ? 'приросту денег' : selectedType === 'population' ? 'приросту населения' : 'общему приросту (доход + население)'}:`);
            ratings.forEach((item, index) => {
                console.log(`${index + 1}. ${item.name} (Категория: ${item.group}) - Рейтинг: ${item.rating.toFixed(2)}, Стоимость: ${item.cost}`);
            });

            // Переход на вкладку с лучшим зданием
            const topBuilding = ratings[0];

            for (let i = 0; i < tabs.length; i++) {
                tabs[i].click();
                await new Promise(resolve => setTimeout(resolve, 500));

                const tabTitle = document.querySelector('div._header_16rj6_20 h2').textContent.trim();

                if (tabTitle === topBuilding.group) {
                    console.log(`Найдена вкладка для лучшего объекта: ${topBuilding.group}`);

                    const buildingElement = Array.from(document.querySelectorAll('div._title_131sn_76')).find(el => el.textContent.includes(topBuilding.name));

                    if (buildingElement) {
                        console.log(`Нажимаем на здание: ${topBuilding.name}`);
                        buildingElement.click();
                        await new Promise(resolve => setTimeout(resolve, 500)); // Ждем открытия карточки здания

                        // Нажимаем на соответствующую кнопку после открытия карточки
                        clickButtonBasedOnType();
                    } else {
                        console.error(`Не удалось найти элемент здания: ${topBuilding.name}`);
                    }

                    break;
                }
            }
        } else {
            console.log('Нет доступных построек для выбранного типа рейтинга.');
        }
    }

    // Функция для нажатия на нужную кнопку
    function clickButtonBasedOnType() {
        // Определяем селекторы для разных кнопок
        const buildButtonSelector = 'div._detailActions_10u6o_1 button._button_1ir11_1._action_1ir11_45._normal_1ir11_216';
        const upgradeButtonSelector = 'div._detailActions_10u6o_1 button._button_1ir11_1._upgrade_1ir11_63._normal_1ir11_211';
        const eventButtonSelector = 'div._detailActions_10u6o_1 button._button_1ir11_1._horoscope_1ir11_117._normal_1ir11_211';

        // Функция для нажатия на кнопку
        function clickButton(selector) {
            const button = document.querySelector(selector);
            if (button) {
                if (!button.disabled) {
                    // Создаем событие клика
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });

                    // Вызываем событие клика на кнопке
                    button.dispatchEvent(clickEvent);
                    console.log(`Кнопка "${selector}" нажата!`);
                } else {
                    console.log(`Кнопка "${selector}" недоступна для нажатия.`);
                }
            } else {
                console.error(`Кнопка "${selector}" не найдена.`);
            }
        }

        // Проверяем и нажимаем соответствующую кнопку
        const upgradeButton = document.querySelector(upgradeButtonSelector);
        const buildButton = document.querySelector(buildButtonSelector);
        const eventButton = document.querySelector(eventButtonSelector);

        if (upgradeButton && !upgradeButton.disabled) { // Проверяем доступность кнопки улучшения
            clickButton(upgradeButtonSelector);
        } else if (buildButton) {
            clickButton(buildButtonSelector);
        } else if (eventButton && !eventButton.disabled) { // Проверяем доступность event-кнопки
            clickButton(eventButtonSelector);
        } else {
            console.log('Нет доступных кнопок для нажатия.');
        }

        // Перезапуск формирования рейтинга после нажатия кнопки
        getBuildingDetails();
    }
})();

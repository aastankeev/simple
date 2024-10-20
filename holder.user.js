// ==UserScript==
// @name         cityholder
// @namespace    Violentmonkey Scripts
// @version      20 ����������� ������
// @description  ������ ��������
// @match        https://app.city-holder.com/*
// @grant        none
// ==/UserScript==

(function() {
const clickButton = () => {
    const button = document.querySelector('div._btn_1mwk4_90 button._button_afxdk_1._primary_afxdk_25._normal_afxdk_194');

    if (button) {
        console.log("������ '�������!' �������. �������� ������ �� ���...");
        button.click();
        console.log("������ '�������!' ������� ������.");
    } else {
        console.log("������ '�������!' �� �������.");
    }
};

// ��������� ������� � ���������, ����� ���� ����� ��� �������� ��������
setTimeout(clickButton, 2000);

    'use strict';

    let isRunning = false;

    const select = document.createElement('select');
    select.innerHTML = `
        <option value="">������</option>
        <option value="income">�����</option>
        <option value="population">���������</option>
        <option value="combined">�������</option>
    `;
    select.style.position = 'fixed';
    select.style.top = '100px';
    select.style.right = '10px';
    select.style.zIndex = 1000;
    select.style.padding = '10px';
    document.body.appendChild(select);

    const button = document.createElement('button');
    button.innerText = '���������';
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
        button.innerText = isRunning ? '����������' : '���������';
        if (isRunning) {
            getBuildingDetails();
        }
    });

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

        const tabs = document.querySelectorAll('div._navItem_r4hf3_24');
        const result = [];

        for (let i = 0; i < tabs.length; i++) {
            tabs[i].click();
            await new Promise(resolve => setTimeout(resolve, 500));

            const tabTitle = document.querySelector('div._header_16rj6_20 h2').textContent.trim();
            const buildings = Array.from(document.querySelectorAll('div._main_a5uob_99')).map(building => {
                const name = building.querySelector('div._title_a5uob_72').textContent.trim();
                const upgradeButton = building.querySelector('button._button_afxdk_1._upgrade_afxdk_63');
                const horoscopeButton = building.querySelector('button._button_afxdk_1._horoscope_afxdk_117');
                const buildButton = building.querySelector('button._button_afxdk_1._action_afxdk_45');

                let upgradeCost = null;
                // ���������, ��� ������ ��������� ��� event ������ ���������� � �� �������������
                if (upgradeButton && !upgradeButton.disabled) {
                    const costText = building.querySelector('span._price_180p0_34._green_180p0_40')?.textContent.trim();
                    upgradeCost = parseCost(costText);
                } else if (horoscopeButton && !horoscopeButton.disabled) { // ���������, ��� event-������ ���������� � �� �������������
                    const costText = building.querySelector('span._price_180p0_34._green_180p0_40')?.textContent.trim();
                    upgradeCost = parseCost(costText);
                }

                let buildCost = null;
                if (buildButton) {
                    const costText = building.querySelector('span._price_180p0_34._green_180p0_40')?.textContent.trim();
                    buildCost = parseCost(costText);
                }

                const growthItems = Array.from(building.querySelectorAll('div._growthItem_180p0_26')).map(item => {
                    const title = item.querySelector('div._title_a5uob_72')?.textContent.trim();
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
                // ��������� ������ �� ��������, ������� ����� ��������� ��� �������� (� ������ �� �������������)
                if (building.canBuild || building.upgradeAvailable) {
                    result.push({
                        name: building.name,
                        group: building.group,
                        type: building.canBuild ? '���������' : '��������',
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
            console.log(`��� 5 �������� �� ${selectedType === 'income' ? '�������� �����' : selectedType === 'population' ? '�������� ���������' : '������ �������� (����� + ���������)'}:`);
            ratings.forEach((item, index) => {
                console.log(`${index + 1}. ${item.name} (���������: ${item.group}) - �������: ${item.rating.toFixed(2)}, ���������: ${item.cost}`);
            });

            // ������� �� ������� � ������ �������
            const topBuilding = ratings[0];

            for (let i = 0; i < tabs.length; i++) {
                tabs[i].click();
                await new Promise(resolve => setTimeout(resolve, 500));

                const tabTitle = document.querySelector('div._header_16rj6_20 h2').textContent.trim();

                if (tabTitle === topBuilding.group) {
                    console.log(`������� ������� ��� ������� �������: ${topBuilding.group}`);

                    const buildingElement = Array.from(document.querySelectorAll('div._title_a5uob_72')).find(el => el.textContent.includes(topBuilding.name));

                    if (buildingElement) {
                        console.log(`�������� �� ������: ${topBuilding.name}`);
                        buildingElement.click();
                        await new Promise(resolve => setTimeout(resolve, 500)); // ���� �������� �������� ������

                        // �������� �� ��������������� ������ ����� �������� ��������
                        clickButtonBasedOnType();
                    } else {
                        console.error(`�� ������� ����� ������� ������: ${topBuilding.name}`);
                    }

                    break;
                }
            }
        } else {
            console.log('��� ��������� �������� ��� ���������� ���� ��������.');
        }
    }

    // ������� ��� ������� �� ������ ������
    function clickButtonBasedOnType() {
        // ���������� ��������� ��� ������ ������
        const buildButtonSelector = 'div._detailActions_10u6o_1 button._button_afxdk_1._action_afxdk_45._normal_afxdk_194';
        const upgradeButtonSelector = 'div._detailActions_10u6o_1 button._button_afxdk_1._upgrade_afxdk_63._normal_afxdk_194';
        const eventButtonSelector = 'div._detailActions_10u6o_1 button._button_afxdk_1._horoscope_afxdk_117._normal_afxdk_194';

        // ������� ��� ������� �� ������
        function clickButton(selector) {
            const button = document.querySelector(selector);
            if (button) {
                if (!button.disabled) {
                    // ������� ������� �����
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });

                    // �������� ������� ����� �� ������
                    button.dispatchEvent(clickEvent);
                    console.log(`������ "${selector}" ������!`);
                } else {
                    console.log(`������ "${selector}" ���������� ��� �������.`);
                }
            } else {
                console.error(`������ "${selector}" �� �������.`);
            }
        }

        // ��������� � �������� ��������������� ������
        const upgradeButton = document.querySelector(upgradeButtonSelector);
        const buildButton = document.querySelector(buildButtonSelector);
        const eventButton = document.querySelector(eventButtonSelector);

        if (upgradeButton && !upgradeButton.disabled) { // ��������� ����������� ������ ���������
            clickButton(upgradeButtonSelector);
        } else if (buildButton) {
            clickButton(buildButtonSelector);
        } else if (eventButton && !eventButton.disabled) { // ��������� ����������� event-������
            clickButton(eventButtonSelector);
        } else {
            console.log('��� ��������� ������ ��� �������.');
        }

        // ���������� ������������ �������� ����� ������� ������
        getBuildingDetails();
    }
})();

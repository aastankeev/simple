// ==UserScript==
// @name         NFT Floor Price Tools
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Save floor prices and highlight deals with percentage deviation
// @author       Your Name
// @match        *://*portals-market.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Стили для кнопок и выделений
    GM_addStyle(`
        .floor-tool-btn {
            position: fixed;
            z-index: 9999;
            padding: 10px 15px;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }
        .floor-tool-btn:hover {
            transform: scale(1.05);
        }
        #saveFloorsBtn {
            bottom: 70px;
            right: 20px;
            background-color: #4CAF50;
        }
        #saveFloorsBtn:hover {
            background-color: #45a049;
        }
        #compareBtn {
            bottom: 20px;
            right: 20px;
            background-color: #2196F3;
        }
        #compareBtn:hover {
            background-color: #0b7dda;
        }
        .gold-highlight {
            color: gold !important;
            text-shadow: 0 0 5px rgba(255,215,0,0.7);
        }
        .deal-badge {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: rgba(0,0,0,0.7);
            color: gold;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            z-index: 10;
        }
        .price-deviation {
            font-size: 12px;
            font-weight: bold;
            margin-left: 5px;
        }
        .deviation-up {
            color: red;
        }
        .deviation-down {
            color: limegreen;
        }
    `);

    // Создаем кнопки
    const saveBtn = createButton('💾', 'saveFloorsBtn', saveFloorPrices);
    const compareBtn = createButton('📊', 'compareBtn', compareGiftPricesWithDeviation);

    // Добавляем кнопки на страницу
    document.body.appendChild(saveBtn);
    document.body.appendChild(compareBtn);

    function createButton(text, id, clickHandler) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.id = id;
        btn.className = 'floor-tool-btn';
        btn.addEventListener('click', clickHandler);
        return btn;
    }

    function saveFloorPrices() {
        const storedData = JSON.parse(localStorage.getItem('nftFloorData') || '{}');
        const newData = {...storedData};
        let collectedCount = 0;

        document.querySelectorAll('.flex.items-center.gap-3').forEach(container => {
            const nameElement = container.querySelector('.line-clamp-2.overflow-hidden');
            const priceBlock = container.querySelector('.justify-self-end.flex.flex-col.gap-1.items-end');

            if (nameElement && priceBlock) {
                const name = nameElement.textContent.trim();
                const priceDiv = priceBlock.querySelector('div');

                if (priceDiv) {
                    let priceText = priceDiv.textContent.trim();
                    let priceValue;

                    if (priceText.toUpperCase().includes('K')) {
                        priceValue = parseFloat(priceText.replace(/[kK]/g, '')) * 1000;
                    } else {
                        priceValue = parseFloat(priceText.replace(/[^\d.]/g, ''));
                    }

                    if (!isNaN(priceValue)) {
                        newData[name] = priceValue;
                        collectedCount++;
                    }
                }
            }
        });

        localStorage.setItem('nftFloorData', JSON.stringify(newData));

        // Анимация подтверждения
        saveBtn.textContent = `✅ Saved ${collectedCount} floors!`;
        setTimeout(() => {
            saveBtn.textContent = '💾';
        }, 2000);
    }

function compareGiftPricesWithDeviation() {
    const stored = localStorage.getItem('nftFloorData');
    const floorData = stored ? JSON.parse(stored) : {};

    console.log('%c[DEBUG] Loaded Floor Data:', 'color: blue; font-weight: bold;', floorData);

    // Находим все подарки
    const gifts = document.querySelectorAll('.flex.items-center.gap-3.cursor-pointer');

    if (!gifts.length) {
        console.warn('[DEBUG] No gifts found in the container.');
        return;
    }

    // Удаляем предыдущие подсветки и бейджи
    document.querySelectorAll('.gold-highlight').forEach(el => el.classList.remove('gold-highlight'));
    document.querySelectorAll('.deal-badge, .price-deviation').forEach(el => el.remove());

    let dealsFound = 0;

    gifts.forEach(gift => {
        // Находим название и цену внутри подарка
        const nameElement = gift.querySelector('.text-lg.font-semibold.line-clamp-2.overflow-hidden');
        const priceElement = gift.querySelector('.text-lg.font-semibold:not(.line-clamp-2)');

        if (nameElement && priceElement) {
            const collectionName = nameElement.textContent.trim();
            const rawPriceText = priceElement.textContent.replace('TON', '').trim();

            let giftPrice = NaN;

            if (rawPriceText.toLowerCase().includes('k')) {
                // Если есть 'k' — умножаем на 1000
                giftPrice = parseFloat(rawPriceText.replace(/[^\d.]/g, '')) * 1000;
            } else {
                // Иначе просто парсим число
                giftPrice = parseFloat(rawPriceText.replace(/[^\d.]/g, ''));
            }

            console.groupCollapsed(`[DEBUG] Processing gift: ${collectionName}`);
            console.log("Raw Price Text:", rawPriceText);
            console.log("Parsed Gift Price:", giftPrice);

            if (isNaN(giftPrice)) {
                console.warn("Invalid price format.");
                console.groupEnd();
                return;
            }

            const floorPrice = floorData[collectionName];

            if (floorPrice !== undefined) {
                const diffPercent = ((giftPrice - floorPrice) / floorPrice * 100).toFixed(1);

                console.log("%cMatched Floor Price:", "color: green", floorPrice);
                console.log("%cDifference (%):", "color: purple", diffPercent + "%");

                // Добавляем процент рядом с названием
                const devSpan = document.createElement('span');
                devSpan.className = 'price-deviation ' + (diffPercent >= 0 ? 'deviation-up' : 'deviation-down');
                devSpan.textContent = `(${diffPercent >= 0 ? '+' : ''}${diffPercent}%)`;

                nameElement.appendChild(devSpan);

                // Выделяем выгодные предложения
                if (giftPrice < floorPrice) {
                    nameElement.classList.add('gold-highlight');
                    priceElement.classList.add('gold-highlight');
                    dealsFound++;

                    // Добавляем иконку выгодной сделки
                    const dealBadge = document.createElement('span');
                    dealBadge.textContent = '';
                    dealBadge.className = 'deal-badge';

                    const imgContainer = gift.querySelector('.relative.rounded-md.overflow-hidden');
                    if (imgContainer) {
                        imgContainer.appendChild(dealBadge);
                    }
                }

            } else {
                console.log("%cNo matching floor data found for this collection.", "color: gray");
            }

            console.groupEnd();
        } else {
            console.warn("[DEBUG] Missing name or price element in gift card.");
        }
    });

    // Анимация подтверждения
    compareBtn.textContent = dealsFound ? `✅ Found ${dealsFound} deals!` : '❌ No deals found';
    setTimeout(() => {
        compareBtn.textContent = '📊';
    }, 3000);
}
})();

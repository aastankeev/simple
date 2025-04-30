// ==UserScript==
// @name         DMD
// @namespace    http://tampermonkey.net/
// @version      5.6
// @description  Кликает по уткам и периодическим кнопкам ("Забрать", "Комиссия", "Искать"), автослияние яиц
// @author       lab404
// @match        *://*webapp.duckmyduck.com/*
// @grant        none
// @downloadURL  https://github.com/aastankeev/simple/raw/main/dmd.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/dmd.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

// Периодическая проверка кнопки "Забрать"
setInterval(() => {
    const button = document.querySelector('footer.aside-footer button.btn.btn-primary');
    if (button) {
        button.click();
        console.log('Кнопка "Забрать" нажата!');
    }
}, 3000);

// Периодическая проверка кнопки "Комиссия"
setInterval(() => {
    const button = [...document.querySelectorAll("button.btn.btn-primary.btn-size-md")]
        .find(b => b.textContent.includes("Комиссия"));
    if (button) {
        button.click();
        console.log('Кнопка "Комиссия" нажата!');
    }
}, 3000);

// Периодическая проверка кнопки "Искать"
setInterval(() => {
    const button = document.querySelector('#find-partner-button');
    if (button && !button.disabled) {
        button.click();
        console.log('Кнопка "Искать" нажата');
    }
}, 5000);

// Ожидание появления карусели
function waitForCarousel() {
    const carousel = document.querySelector('ul.w-fit.h-fit.flex.items-center.gap-1\\.5');
    if (carousel) {
        console.log('Карусель найдена');
        startProcessing(carousel);
    } else {
        console.log('Ожидаем карусель...');
        setTimeout(waitForCarousel, 1000);
    }
}

// Запуск обработки слотов
function startProcessing(carousel) {
    const slots = Array.from(carousel.querySelectorAll('.slot-nav-item'));
    let currentSlotIndex = 0;

    function processNextSlot() {
        if (currentSlotIndex >= slots.length) {
            console.log('Все слоты обработаны');
            return;
        }

        const slot = slots[currentSlotIndex];
        console.log(`Открываем слот #${currentSlotIndex}`);

        slot.click();

        setTimeout(() => {
            const duck = document.querySelector('figure[id^="duck-"]');
            if (!duck) {
                console.log('Утка не найдена, пропускаем слот');
                currentSlotIndex++;
                setTimeout(processNextSlot, 400);
                return;
            }

            duck.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

            clickDuck(duck, 0, () => {
                currentSlotIndex++;
                setTimeout(processNextSlot, 400);
            });

        }, 400);
    }

    processNextSlot();
}

// Клик по утке
function clickDuck(duck, count, doneCallback) {
    if (count >= 10) {
        doneCallback();
        return;
    }

    const rect = duck.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(eventType => {
        const event = new MouseEvent(eventType, {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            button: 0
        });
        duck.dispatchEvent(event);
    });

    console.log(`Клик #${count + 1}`);

    setTimeout(() => {
        clickDuck(duck, count + 1, doneCallback);
    }, 300 + Math.random() * 200);
}

// ------------------- MERGE ------------------------

// Ожидание открытия меню "Яйца"
function waitForEggsMenu() {
    const menuBtn = document.querySelector('a[aria-label="Яйца"]');
    if (menuBtn) {
        menuBtn.click();
        console.log('Меню "Яйца" нажато, ждём загрузку...');
        waitForEggsGrid();
    } else {
        console.log('Ожидаем кнопку "Яйца"...');
        setTimeout(waitForEggsMenu, 1000);
    }
}

function waitForEggsGrid() {
    const eggGrid = document.querySelector('.cell .egg-icon');
    if (eggGrid) {
        console.log('Яйца загружены, запускаем autoMerge');
        autoMerge().catch(console.error);
    } else {
        setTimeout(waitForEggsGrid, 1000);
    }
}

// Симуляция перетаскивания
async function simulatePointerDrag(source, target) {
    const sourceRect = source.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const startX = sourceRect.left + sourceRect.width / 2;
    const startY = sourceRect.top + sourceRect.height / 2;
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

    function firePointerEvent(type, x, y) {
        const event = new PointerEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            pointerId: 1,
            pointerType: 'mouse',
            isPrimary: true,
        });
        source.dispatchEvent(event);
    }

    firePointerEvent('pointerdown', startX, startY);
    await new Promise(r => setTimeout(r, 50));

    const steps = 10;
    for (let i = 1; i <= steps; i++) {
        const x = startX + (endX - startX) * (i / steps);
        const y = startY + (endY - startY) * (i / steps);
        firePointerEvent('pointermove', x, y);
        await new Promise(r => setTimeout(r, 30));
    }

    firePointerEvent('pointerup', endX, endY);
    await new Promise(r => setTimeout(r, 500));
}

// Поиск пары и слияние
async function performMerge() {
    const eggs = Array.from(document.querySelectorAll('.cell:not(.cell--locked) .egg-icon'))
        .filter(img => img.style.visibility !== 'hidden');

    for (let i = 0; i < eggs.length; i++) {
        for (let j = i + 1; j < eggs.length; j++) {
            const egg1 = eggs[i];
            const egg2 = eggs[j];

            if (egg1.dataset.level === egg2.dataset.level &&
                egg1.src.includes('heart') === egg2.src.includes('heart')) {
                console.log(`Merging ${egg1.dataset.level} -> ${egg2.dataset.level}`);
                await simulatePointerDrag(egg1, egg2);
                return true;
            }
        }
    }
    return false;
}

// Цикл автослияния
async function autoMerge() {
    while (true) {
        const merged = await performMerge();
        if (!merged) {
            await new Promise(r => setTimeout(r, 500));
            continue;
        }
        await new Promise(r => setTimeout(r, 250));
    }
}

// Запуск карусели и слияния
waitForCarousel();
waitForEggsMenu();

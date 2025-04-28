// ==UserScript==
// @name         DMD
// @namespace    http://tampermonkey.net/
// @version      5
// @description
// @author       lab404
// @match        *://*webapp.duckmyduck.com/*
// @grant        none
// @downloadURL  https://github.com/aastankeev/simple/raw/main/dmd.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/dmd.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

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

        slot.click(); // Кликаем по слоту

        setTimeout(() => {
            const duck = document.querySelector('figure[id^="duck-"]');
            if (!duck) {
                console.log('Утка не найдена, пропускаем слот');
                currentSlotIndex++;
                setTimeout(processNextSlot, 400); // Переход к следующему слоту
                return;
            }

            duck.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

            clickDuck(duck, 0, () => {
                currentSlotIndex++;
                setTimeout(processNextSlot, 400); // После 10 кликов переходим к следующему слоту
            });

        }, 400); // Немного ждём после клика по слоту
    }

    processNextSlot();
}

// Клик по утке 10 раз
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
    }, 300 + Math.random() * 200); // 0.3 - 0.5 секунды между кликами
}

// Старт
waitForCarousel();

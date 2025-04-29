// ==UserScript==
// @name         DMD
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Кликает по уткам и периодическим кнопкам ("Забрать", "Комиссия", "Искать")
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
}, 3000); // каждые 3 сек

// Периодическая проверка кнопки "Комиссия"
setInterval(() => {
    const button = [...document.querySelectorAll("button.btn.btn-primary.btn-size-md")]
        .find(b => b.textContent.includes("Комиссия"));
    if (button) {
        button.click();
        console.log('Кнопка "Комиссия" нажата!');
    }
}, 3000); // каждые 3 сек

// Периодическая проверка кнопки "Искать"
setInterval(() => {
    const button = document.querySelector('#find-partner-button');
    if (button && !button.disabled) {
        button.click();
        console.log('Кнопка "Искать" нажата');
    }
}, 5000); // каждые 5 сек

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
    }, 300 + Math.random() * 200);
}

// Старт
waitForCarousel();

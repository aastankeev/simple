// ==UserScript==
// @name         DMD с кнопкой стрелки вправо + авто-сдача яиц
// @namespace    http://tampermonkey.net/
// @version      23
// @description  Кликает по уткам и кнопкам, автослияние яиц, с кнопкой вкл/выкл + стрелка вправо + авто-сдача яиц 🌀
// @author       lab404
// @match        *://*webapp.duckmyduck.com/*
// @grant        none
// @icon         https://webapp.duckmyduck.com/favicon.png
// @downloadURL https://github.com/aastankeev/simple/raw/main/dmd.user.js
// @updateURL   https://github.com/aastankeev/simple/raw/main/dmd.user.js
// @homepage    https://github.com/aastankeev/simple
// ==/UserScript==

(function () {
    'use strict';

    let isRunning = true;
    let isAutoSubmitActive = true;
    let intervals = [];
    let mergeLoop = null;

    // === СТИЛИ ===
    const style = document.createElement('style');
    style.textContent = `
        #toggle-script-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: none;
            background-color: #4CAF50;
            color: white;
            font-size: 18px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        #toggle-script-btn.inactive {
            background-color: #777;
        }

        #egg-nav-btn {
            position: fixed;
            bottom: 60px;
            right: 20px;
            width: 36px;
            height: 42px;
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            background: #FFC107;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
        }
        #egg-nav-btn::after {
            content: "🥚";
            font-size: 24px;
        }

        #next-slot-btn {
            position: fixed;
            bottom: 140px;
            right: 20px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #9C27B0;
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
        }
        #next-slot-btn::after {
            content: "➡️";
        }

        #auto-submit-btn {
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 36px;
            height: 42px;
            border-radius: 50%;
            background: #03A9F4;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
            opacity: 1;
        }
        #auto-submit-btn::after {
            content: "🌀";
            font-size: 20px;
        }
    `;
    document.head.appendChild(style);

    // === КНОПКИ ===
    const btn = document.createElement('button');
    btn.id = 'toggle-script-btn';
    btn.textContent = '⏻';
    document.body.appendChild(btn);

    const eggBtn = document.createElement('button');
    eggBtn.id = 'egg-nav-btn';
    document.body.appendChild(eggBtn);

    const nextSlotBtn = document.createElement('button');
    nextSlotBtn.id = 'next-slot-btn';
    document.body.appendChild(nextSlotBtn);

    const autoSubmitBtn = document.createElement('button');
    autoSubmitBtn.id = 'auto-submit-btn';
    document.body.appendChild(autoSubmitBtn);

    // === ОБРАБОТЧИКИ ===
    btn.addEventListener('click', () => {
        isRunning = !isRunning;
        btn.classList.toggle('inactive', !isRunning);
        if (isRunning) {
            console.log('[DMD] Скрипт включён');
            runScript();
        } else {
            console.log('[DMD] Скрипт остановлен');
            stopScript();
        }
    });

    eggBtn.addEventListener('click', () => {
        try {
            const tasksLink = document.getElementById('nav-tasks-link');
            if (tasksLink) tasksLink.click();
            setTimeout(() => {
                const category = document.getElementById('category-menu-4');
                if (category) {
                    const btn = category.querySelector('button');
                    if (btn) btn.click();
                }
            }, 1000);
        } catch (e) {
            console.error('Navigation error:', e);
        }
    });

    nextSlotBtn.addEventListener('click', () => {
        setTimeout(() => {
            const carousel = document.querySelector('ul.w-fit.h-fit.flex.items-center.gap-1\\.5');
            if (!carousel) return;
            const slots = Array.from(carousel.querySelectorAll('.slot-nav-item'));
            if (slots.length <= 1) return;
            currentSlotIndex = (currentSlotIndex + 1) % slots.length;
            const nextSlot = slots[currentSlotIndex];
            if (nextSlot) {
                console.log(`Переход на слот #${currentSlotIndex}`);
                nextSlot.click();
            }
        }, 200);
    });

    autoSubmitBtn.addEventListener('click', () => {
        isAutoSubmitActive = !isAutoSubmitActive;
        autoSubmitBtn.style.opacity = isAutoSubmitActive ? '1' : '0.5';
        console.log(`[DMD] Авто-сдача яиц: ${isAutoSubmitActive ? 'включена' : 'выключена'}`);
    });

    // === АВТО-СДАЧА ЯИЦ ===
    function autoSubmitEggs() {
        setInterval(() => {
            if (!isAutoSubmitActive) return;
            const button = Array.from(document.querySelectorAll('div[role="button"]'))
                .find(el => el.textContent.trim().toLowerCase() === 'сдать');
            if (button) {
                button.click();
                console.log('👉 Нажата кнопка "сдать"');
            }
        }, 300);
    }

    // === ОСНОВНОЙ ЗАПУСК ===
    function runScript() {
        intervals.push(setInterval(checkCollectButton, 100));
        intervals.push(setInterval(checkCommissionButton, 100));
        intervals.push(setInterval(checkSearchButton, 100));
        waitForCarousel();
        waitForEggsGrid();
    }

    function stopScript() {
        intervals.forEach(id => clearInterval(id));
        intervals = [];
        mergeLoop = null;
    }

    function checkCollectButton() {
        if (!isRunning) return;
        const button = document.querySelector('footer.aside-footer button.btn.btn-primary');
        if (button) {
            button.click();
            console.log('Кнопка "Забрать" нажата!');
        }
    }

    function checkCommissionButton() {
        if (!isRunning) return;
        const button = [...document.querySelectorAll("button.btn.btn-primary.btn-size-md")]
            .find(b => b.textContent.includes("Комиссия"));
        if (button) {
            button.click();
            console.log('Кнопка "Комиссия" нажата!');
        }
    }

    function checkSearchButton() {
        if (!isRunning) return;
        const button = document.querySelector('#find-partner-button');
        if (button && !button.disabled) {
            button.click();
            console.log('Кнопка "Искать" нажата');
        }
    }

    function waitForCarousel() {
        if (!isRunning) return;
        const carousel = document.querySelector('ul.w-fit.h-fit.flex.items-center.gap-1\\.5');
        if (carousel) {
            console.log('Карусель найдена');
            startProcessing(carousel);
        } else {
            console.log('Ожидаем карусель...');
            setTimeout(waitForCarousel, 1000);
        }
    }

    let currentSlotIndex = 0;
    function startProcessing(carousel) {
        const slots = Array.from(carousel.querySelectorAll('.slot-nav-item'));
        let index = 1;

        function processNextSlot() {
            if (!isRunning || index >= slots.length) {
                console.log('Клики по всем уткам завершены. Переходим в раздел Яйца...');
                const eggsNav = document.getElementById('nav-eggs-link');
                if (eggsNav) eggsNav.click();
                return;
            }
            const slot = slots[index];
            console.log(`Открываем слот #${index}`);
            slot.click();
            setTimeout(() => {
                const duck = document.querySelector('figure[id^="duck-"]');
                if (!duck) {
                    console.log('Утка не найдена, пропускаем слот');
                    index++;
                    setTimeout(processNextSlot, 200);
                    return;
                }
                duck.scrollIntoView({ behavior: 'smooth', block: 'center' });
                clickDuck(duck, 0, () => {
                    index++;
                    setTimeout(processNextSlot, 200);
                });
            }, 100);
        }

        if (slots.length > 1) {
            processNextSlot();
        } else {
            console.log('Недостаточно слотов');
        }
    }

    function clickDuck(duck, count, doneCallback) {
        if (!isRunning || count >= 10) {
            doneCallback();
            return;
        }
        const rect = duck.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(type => {
            duck.dispatchEvent(new MouseEvent(type, {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
                button: 0
            }));
        });
        console.log(`Клик #${count + 1}`);
        setTimeout(() => clickDuck(duck, count + 1, doneCallback), 30 + Math.random() * 15);
    }

    function waitForEggsGrid() {
        if (!isRunning) return;
        const eggGrid = document.querySelector('.cell .egg-icon:not([style*="hidden"])');
        if (eggGrid) {
            console.log('Сетка яиц найдена, запускаем autoMerge');
            autoMergeLoop().catch(console.error);
            watchForLevel12Eggs();
        } else {
            console.log('Ожидаем сетку яиц...');
            setTimeout(waitForEggsGrid, 1000);
        }
    }

    async function autoMergeLoop() {
        if (mergeLoop) return;
        mergeLoop = true;
        while (isRunning) {
            const merged = await performMerge();
            if (!merged) {
                const cells = document.querySelectorAll('.cell:not(.cell--locked)');
                const filled = Array.from(cells).filter(cell =>
                    cell.querySelector('.egg-icon') &&
                    cell.querySelector('.egg-icon').style.visibility !== 'hidden'
                );
                if (filled.length === cells.length) {
                    console.log('Поле заполнено, разбиваем яйцо');
                    await handleNoMerge();
                }
            }
            await new Promise(r => setTimeout(r, 25));
        }
    }

    async function performMerge() {
        const eggs = Array.from(document.querySelectorAll('.cell:not(.cell--locked) .egg-icon'))
            .filter(img => img.style.visibility !== 'hidden');
        for (let i = 0; i < eggs.length; i++) {
            for (let j = i + 1; j < eggs.length; j++) {
                const a = eggs[i], b = eggs[j];
                if (a.dataset.level === b.dataset.level && a.src.includes('heart') === b.src.includes('heart')) {
                    console.log(`Слияние яиц уровня ${a.dataset.level}`);
                    await simulatePointerDrag(a, b);
                    return true;
                }
            }
        }
        return false;
    }

    async function simulatePointerDrag(source, target) {
        const s = source.getBoundingClientRect(), t = target.getBoundingClientRect();
        const steps = 10;
        function fire(type, x, y) {
            const e = new PointerEvent(type, {
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
                pointerId: 1,
                pointerType: 'mouse'
            });
            source.dispatchEvent(e);
        }
        fire('pointerdown', s.left + s.width / 2, s.top + s.height / 2);
        await new Promise(r => setTimeout(r, 25));
        for (let i = 1; i <= steps; i++) {
            const x = s.left + (t.left - s.left) * (i / steps) + s.width / 2;
            const y = s.top + (t.top - s.top) * (i / steps) + s.height / 2;
            fire('pointermove', x, y);
            await new Promise(r => setTimeout(r, 25));
        }
        fire('pointerup', t.left + t.width / 2, t.top + t.height / 2);
        await new Promise(r => setTimeout(r, 25));
    }

    async function handleNoMerge() {
        const eggs = getLowestLevelEggs();
        if (eggs.length === 0) return;
        const target = eggs[Math.floor(Math.random() * eggs.length)];
        console.log(`Разбиваем яйцо уровня ${target.dataset.level}`);
        target.click();
        await new Promise(r => setTimeout(r, 25));
        const crackBtn = document.getElementById('crack-egg-button');
        if (crackBtn) crackBtn.click();
    }

    function getLowestLevelEggs() {
        const eggs = Array.from(document.querySelectorAll('.cell:not(.cell--locked) .egg-icon'))
            .filter(img => img.style.visibility !== 'hidden');
        if (!eggs.length) return [];
        const minLevel = Math.min(...eggs.map(e => parseInt(e.dataset.level)));
        return eggs.filter(e => parseInt(e.dataset.level) === minLevel);
    }

    function watchForLevel12Eggs() {
        setInterval(() => {
            if (!isRunning) return;
            const eggs = Array.from(document.querySelectorAll('.cell:not(.cell--locked) .egg-icon'))
                .filter(e => e.style.visibility !== 'hidden' && parseInt(e.dataset.level) === 12);
            if (eggs.length === 0) return;
            console.log(`Найдено ${eggs.length} яиц 12 уровня. Открываем...`);
            for (const egg of eggs) {
                egg.click();
                setTimeout(() => {
                    const crackBtn = document.getElementById('crack-egg-button');
                    if (crackBtn) crackBtn.click();
                }, 100);
            }
        }, 2000);
    }

    // === ЗАПУСК ===
    runScript();
    autoSubmitEggs();
})();

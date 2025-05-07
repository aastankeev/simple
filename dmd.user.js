// ==UserScript==
// @name         DMD
// @namespace    http://tampermonkey.net/
// @version      7.9
// @description  Кликает по уткам и кнопкам, автослияние яиц, с кнопкой вкл/выкл
// @author       lab404
// @match        *://*webapp.duckmyduck.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let isRunning = true;
    let intervals = [];
    let mergeLoop = null;

    const style = document.createElement('style');
    style.textContent = `
        #toggle-script-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
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
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = 'toggle-script-btn';
    btn.textContent = '⏻';
    document.body.appendChild(btn);

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

    function runScript() {
        intervals.push(setInterval(checkCollectButton, 3000));
        intervals.push(setInterval(checkCommissionButton, 3000));
        intervals.push(setInterval(checkSearchButton, 3000));
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

    function startProcessing(carousel) {
        const slots = Array.from(carousel.querySelectorAll('.slot-nav-item'));
        let currentSlotIndex = 1;

        function processNextSlot() {
            if (!isRunning || currentSlotIndex >= slots.length) return;
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
                duck.scrollIntoView({ behavior: 'smooth', block: 'center' });
                clickDuck(duck, 0, () => {
                    currentSlotIndex++;
                    setTimeout(processNextSlot, 400);
                });
            }, 400);
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
                view: window, bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0
            }));
        });

        console.log(`Клик #${count + 1}`);
        setTimeout(() => clickDuck(duck, count + 1, doneCallback), 300 + Math.random() * 200);
    }

    function waitForEggsGrid() {
        if (!isRunning) return;
        const eggGrid = document.querySelector('.cell .egg-icon:not([style*="hidden"])');
        if (eggGrid) {
            console.log('Сетка яиц найдена, запускаем autoMerge');
            autoMergeLoop().catch(console.error);
        } else {
            console.log('Ожидаем сетку яиц...');
            setTimeout(waitForEggsGrid, 2000);
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
            await new Promise(r => setTimeout(r, 200));
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
                bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 1, pointerType: 'mouse'
            });
            source.dispatchEvent(e);
        }

        fire('pointerdown', s.left + s.width / 2, s.top + s.height / 2);
        await new Promise(r => setTimeout(r, 50));
        for (let i = 1; i <= steps; i++) {
            const x = s.left + (t.left - s.left) * (i / steps) + s.width / 2;
            const y = s.top + (t.top - s.top) * (i / steps) + s.height / 2;
            fire('pointermove', x, y);
            await new Promise(r => setTimeout(r, 30));
        }
        fire('pointerup', t.left + t.width / 2, t.top + t.height / 2);
        await new Promise(r => setTimeout(r, 200));
    }

    async function handleNoMerge() {
        const eggs = getLowestLevelEggs();
        if (eggs.length === 0) return;
        const target = eggs[Math.floor(Math.random() * eggs.length)];
        console.log(`Разбиваем яйцо уровня ${target.dataset.level}`);
        target.click();
        await new Promise(r => setTimeout(r, 250));
        const btn = document.getElementById('crack-egg-button');
        if (btn) btn.click();
    }

    function getLowestLevelEggs() {
        const eggs = Array.from(document.querySelectorAll('.cell:not(.cell--locked) .egg-icon'))
            .filter(img => img.style.visibility !== 'hidden');
        if (!eggs.length) return [];
        const minLevel = Math.min(...eggs.map(e => parseInt(e.dataset.level)));
        return eggs.filter(e => parseInt(e.dataset.level) === minLevel);
    }

    // Автозапуск
    runScript();
})();

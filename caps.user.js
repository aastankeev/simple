// ==UserScript==
// @name         caps
// @namespace    ViolentMonkey
// @version      4
// @description  Автонажатие кнопки "Pick up" при появлении
// @match        *://capsbot.com/*
// @grant        none
// @icon         https://cdn-icons-png.flaticon.com/128/2806/2806254.png
// @downloadURL  https://github.com/aastankeev/simple/raw/main/caps.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/caps.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
    'use strict';

    // 1. Функция для автонажатия "Pick up"
    let pickupClicked = false;
    const pickupSelector = 'button.w-full.bg-white.py-3\\.5.rounded-2xl.text-sm.font-semibold.flex.items-center.justify-center';

    function checkAndClickPickup() {
        if (pickupClicked) return;
        const btn = document.querySelector(pickupSelector);
        if (btn && !btn.disabled && btn.offsetParent !== null) {
            btn.click();
            console.log('[CapsBot] Pick up button clicked!');
            pickupClicked = true;
        }
    }

    // 2. Функция для массового выбора предметов
    function createSelectAllButton() {
        const button = document.createElement('div');
        button.innerHTML = `
            <div id="capsbot-select-all" style="
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: #4CAF50;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                z-index: 9999;
                font-size: 24px;
            ">
                ✓
            </div>
        `;

        document.body.appendChild(button);

        button.querySelector('div').addEventListener('click', () => {
            const items = document.querySelectorAll('.relative.flex.flex-col.items-center.w-full.cursor-pointer.bg-\\[\\#1F1F1F\\].rounded-2xl');
            
            if (items.length === 0) {
                alert('[CapsBot] Элементы не найдены!');
                return;
            }

            items.forEach((item, index) => {
                setTimeout(() => {
                    item.click();
                    console.log(`[CapsBot] Выбран предмет ${index + 1}/${items.length}`);
                }, index * 300);
            });

            const btnElement = document.getElementById('capsbot-select-all');
            btnElement.style.background = '#2E7D32';
            btnElement.textContent = '✓';
            
            setTimeout(() => {
                btnElement.style.background = '#4CAF50';
            }, 2000);
        });
    }

    // 3. Инициализация
    function init() {
        // Запускаем проверку кнопки "Pick up" каждую секунду
        const pickupInterval = setInterval(() => {
            if (pickupClicked) {
                clearInterval(pickupInterval);
            } else {
                checkAndClickPickup();
            }
        }, 1000);

        // Добавляем кнопку для выбора всех предметов
        createSelectAllButton();
        console.log('[CapsBot] Скрипт инициализирован!');
    }

    // Запускаем после загрузки страницы
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();

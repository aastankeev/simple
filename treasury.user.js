// ==UserScript==
// @name         treasury + автоклик "Сделать"
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Автоматически нажимает на элементы по селектору и добавляет кнопку управления автокликом
// @author       lab404
// @match        *://*cdn.thetreasury.io/*
// @icon         https://cdn-icons-png.flaticon.com/128/4545/4545090.png   
// @grant        none
// @downloadURL  https://github.com/aastankeev/simple/raw/main/treasury.user.js   
// @updateURL    https://github.com/aastankeev/simple/raw/main/treasury.user.js   
// @homepage     https://github.com/aastankeev/simple   
// ==/UserScript==

(function() {
    'use strict';

    // === Часть 1: Клик по заданному селектору ===
    const targetSelector = 'div._tabsWrapper_42298_107 div._navIconContainer_42298_29';

    function checkAndClickTarget() {
        const elements = document.querySelectorAll(targetSelector);
        if (elements.length > 0) {
            console.log('Целевой элемент найден, выполняется клик...');
            elements[0].click();
            return true;
        }
        return false;
    }

    if (checkAndClickTarget()) {
        return;
    }

    const observer = new MutationObserver(function(mutations) {
        if (checkAndClickTarget()) {
            observer.disconnect();
            console.log('Наблюдение за целевым элементом остановлено');
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('Наблюдение за появлением целевого элемента начато...');


    // === Часть 2: Автоклик по кнопкам "Сделать" с кнопкой управления ===
    let isEnabled = false;

    function clickMakeButtons() {
        if (!isEnabled) return;

        const buttons = document.querySelectorAll('button, a[role="button"], [onclick]');
        buttons.forEach(button => {
            const buttonText = button.textContent.trim().toLowerCase();
            if (buttonText === 'сделать') {
                button.click();
                console.log('Клик по кнопке "Сделать" выполнен');
            }
        });
    }

    const controlButton = document.createElement('button');
    controlButton.innerText = '▶';
    controlButton.style.position = 'fixed';
    controlButton.style.bottom = '20px';
    controlButton.style.right = '20px';
    controlButton.style.width = '36px';
    controlButton.style.height = '36px';
    controlButton.style.borderRadius = '50%';
    controlButton.style.backgroundColor = '#4CAF50';
    controlButton.style.color = 'white';
    controlButton.style.border = 'none';
    controlButton.style.fontSize = '20px';
    controlButton.style.zIndex = '9999';
    controlButton.style.cursor = 'pointer';
    controlButton.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
    controlButton.title = 'Вкл/Выкл автоклик';

    controlButton.addEventListener('click', () => {
        isEnabled = !isEnabled;
        controlButton.style.backgroundColor = isEnabled ? '#f44336' : '#4CAF50';
        controlButton.innerText = isEnabled ? '⏸' : '▶';
        console.log(`Автоклик ${isEnabled ? 'включен' : 'выключен'}`);
    });

    document.body.appendChild(controlButton);

    // Периодическая проверка кнопок "Сделать"
    setInterval(clickMakeButtons, 2000);

})();

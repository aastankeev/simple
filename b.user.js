// ==UserScript==
// @name         Bums
// @namespace    Violentmonkey Scripts
// @version      28
// @description  45 дней до дропа
// @match        *://*app.bums.bot/*
// @grant        none
// @icon         https://app.bums.bot/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/b.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/b.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==


(function () {
    'use strict';

function waitForNiceButton() {
    return new Promise(resolve => {
        let attempts = 0;
        const interval = setInterval(() => {
            let niceButton = document.querySelector('.van-button--success span.van-button__text');
            if (niceButton && niceButton.textContent.includes('Nice')) {
                niceButton.click();
                clearInterval(interval);
                setTimeout(resolve, 1000);
            } else if (attempts >= 5) {
                clearInterval(interval);
                resolve();
            }
            attempts++;
        }, 1000);
    });
}

function waitForAirdropRules() {
    const checkInterval = setInterval(() => {
        let airdropButton = [...document.querySelectorAll('.icon')].find(button => {
            let textElement = button.querySelector('.name .cut_two');
            return textElement && textElement.innerHTML.includes('AIRDROP<br>RULES');
        });

        if (airdropButton) {
            clearInterval(checkInterval);
            console.log("Кнопка 'AIRDROP RULES' найдена. Запускаем скрипт...");
            processAirdropRules(airdropButton);
        }
    }, 1000);
}

function processAirdropRules(button) {
    button.click();
    setTimeout(() => {
        let dailyLogin = [...document.querySelectorAll('.left_text')].find(el => {
            let textEl = el.querySelector('.text_bold');
            return textEl && textEl.textContent.includes('DAILY LOG-IN');
        });

        if (dailyLogin) {
            dailyLogin.click();
            setTimeout(() => {
                let getFreeBtn = document.querySelector('.getFree');
                if (getFreeBtn) {
                    getFreeBtn.click();
                    setTimeout(closePopups, 1000);
                } else {
                    closePopups();
                }
            }, 1000);
        } else {
            startMainScript();
        }
    }, 1000);
}

function closePopups() {
    let overlayPopup = document.querySelector('div.van-overlay.van-fade-leave-from.van-fade-leave-active');
    if (overlayPopup) {
        overlayPopup.click();
    }
    setTimeout(() => {
        let backButton = document.querySelector('div#app > a.back-button > img');
        if (backButton) {
            backButton.click();
        }
        setTimeout(startMainScript, 1000);
    }, 1000);
}

function startMainScript() {
    console.log("Основной скрипт запущен...");
    // Здесь код основного скрипта
}

waitForNiceButton().then(waitForAirdropRules);
})();

// ==UserScript==
// @name        paws
// @namespace   Violentmonkey Scripts
// @version     1
// @description собираем награду
// @downloadURL https://github.com/aastankeev/simple/raw/main/paws.user.js
// @updateURL   https://github.com/aastankeev/simple/raw/main/paws.user.js
// @homepage    https://github.com/aastankeev/simple
// @icon        https://app.paws.community/favicon.ico
// @match       *://*.app.paws.*/
// @grant       none
// @run-at      document-end
// ==/UserScript==

window.addEventListener('load', function() {
    // Интервал проверки в миллисекундах
    const intervalTime = 1000; // 1 секунда

    // Функция для поиска и нажатия на кнопку "Let’s start"
    const checkForStartButton = setInterval(() => {
        const startButton = Array.from(document.querySelectorAll('.btn-next'))
            .find(el => el.textContent.trim() === "Let’s start");

        if (startButton) {
            startButton.click();
            console.log("Start button clicked");
            clearInterval(checkForStartButton); // Остановить проверку для кнопки "Let’s start"
            checkForGotchaButton(); // Запустить проверку для кнопки "Gotcha!"
        }
    }, intervalTime);

    // Функция для поиска и нажатия на кнопку "Gotcha!"
    function checkForGotchaButton() {
        const gotchaInterval = setInterval(() => {
            const gotchaButton = Array.from(document.querySelectorAll('.btn-next'))
                .find(el => el.textContent.trim() === "Gotcha!");

            if (gotchaButton) {
                gotchaButton.click();
                console.log("Gotcha button clicked");
                clearInterval(gotchaInterval); // Остановить проверку для кнопки "Gotcha!"
            }
        }, intervalTime);
    }
});


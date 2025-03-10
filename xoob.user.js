// ==UserScript== 
// @name         xoob
// @namespace    http://tampermonkey.net/
// @version      2
// @description
// @author
// @match        *://*game.xoob.gg*/
// @grant        none
// @icon         https://game.xoob.gg/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/xoob.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/xoob.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        function waitForElement(selector, callback, interval = 500) {
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    callback(element);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // На случай, если кнопка уже есть
            setTimeout(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    callback(element);
                }
            }, interval);
        }

        waitForElement(
            "div.flex.w-1\/2.items-center.justify-center.px-2.font-futura-medium.text-center.font-medium.text-md.h-\[48px\].bg-heliotrope.rounded-\[32px\].shadow-4.text-\[\#000024\]",
            (button) => {
                console.log("Кнопка найдена, нажимаю...");
                button.click();
            }
        );
    }, 10000); // Задержка 10 секунд перед запуском
})();

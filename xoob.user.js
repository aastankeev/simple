// ==UserScript== 
// @name         xoob
// @namespace    http://tampermonkey.net/
// @version      4
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

    function clickMineButton() {
        const button = [...document.querySelectorAll('div.flex.w-1\\/2.items-center.justify-center.px-2.font-futura-medium.text-center.font-medium.text-md.h-\\[48px\\].bg-heliotrope.rounded-\\[32px\\].shadow-4.text-\\[\\#000024\\]')]
            .find(el => el.textContent.trim() === "Mine" || el.textContent.trim() === "Добывать");

        if (button) {
            button.click();
            console.log("Нажата кнопка:", button.textContent.trim());
        }
    }

    setInterval(clickMineButton, 3000);
})();

// ==UserScript==
// @name         Change iframe Source to Android Platform
// @namespace    
// @version      0.1
// @description  Automatically changes iframe tgWebAppPlatform parameter to "android"
// @author       You
// @match        https://web.telegram.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Включаем поддержку касаний
    window.ontouchstart = true;

    // Создаем наблюдатель за изменениями в DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Проверка, что это элемент
                    node.querySelectorAll('iframe').forEach(el => {
                        // Меняем параметр tgWebAppPlatform в URL на "android"
                        el.src = el.src.replace(/(tgWebAppPlatform=)[^&]+/, "$1android");
                        console.log('-='.repeat(50));
                        console.log("Use this address in your browser:", el.src);
                        console.log('-='.repeat(50));
                    });
                }
            });
        });
    });
    // Наблюдаем за изменениями в теле документа
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ==UserScript==
// @name         planetX
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Автоматически нажимает кнопки "Возобновить добычу" и "Перезарядить"
// @author       lab404
// @match        *://*xplanet.online/*
// @grant        none
// @icon         https://xplanet.online/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/plnX.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/plnX.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function() {
  'use strict';

setTimeout(() => {
  const coinDialog = document.querySelector("button.van-button--warning.van-button--large.van-button--block.van-button--round.shadow");

  if (coinDialog) {
    coinDialog.click();
  } else {
    const tabButtons = Array.from(document.querySelectorAll(".van-tabbar-item"));
    const upgradeButton = tabButtons.find(btn => btn.innerText.includes("Upgrade"));
    if (upgradeButton) {
      upgradeButton.click();
    }

    // === 1. Выполняем перезарядку ===
    const expeditionList = document.querySelectorAll('div[data-v-665e0010].list > div[data-v-665e0010].item');
    expeditionList.forEach(item => {
      const btn = item.querySelector('button');
      if (btn && btn.innerText.includes("Free Expedition")) {
        btn.click();
      }
    });

    // Открываем раздел с коробкой
    const mysteryBox = document.querySelector('div[data-v-14d7cb69].layer.mysteryBox');
    if (mysteryBox) {
      mysteryBox.click();
      setTimeout(() => {
        const freeBtn = document.querySelector('div[data-v-4ef692a1].list.mt-20.flex.gap-20.border-radius-10.text-center button');
        if (freeBtn && freeBtn.innerText.includes("Free")) {
          freeBtn.click();
        }
      }, 1000); // даём 1 сек на открытие коробки
    }

    // === 2. Выполняем квесты и задания ===
    setTimeout(() => {
      const tabButtons = Array.from(document.querySelectorAll(".van-tabbar-item"));
      const earnButton = tabButtons.find(btn => btn.innerText.includes("Earn"));
      if (earnButton) {
        earnButton.click();
        setTimeout(() => {
          const tasksBtn = Array.from(document.querySelectorAll(".van-button__text")).find(el => el.innerText.includes("Tasks"));
          if (tasksBtn) {
            tasksBtn.click();

            setTimeout(() => {
              // Кликаем первую кнопку "Go"
              const goBtn = document.querySelector('div[data-v-88cab770].btn-go button');
              if (goBtn) goBtn.click();

              setTimeout(() => {
                // Кликаем все доступные награды (классы, заканчивающиеся на 0)
                const rewardButtons = Array.from(document.querySelectorAll('[class$="0"]'));
                rewardButtons.forEach(btn => btn.click());

                // Нажимаем NICE!
                setTimeout(() => {
                  const niceBtn = document.querySelector('button.van-button.checkBtn');
                  if (niceBtn && niceBtn.innerText.includes("NICE")) {
                    niceBtn.click();
                  }
                }, 500);
              }, 1000);
            }, 1000);
          }
        }, 1000);
      }
    }, 2000); // ждём выполнения перезарядки
  }
}, 5000); // основной запуск после загрузки

})();

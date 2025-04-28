// ==UserScript==
// @name         DMD
// @namespace    http://tampermonkey.net/
// @version      3
// @description  
// @author       lab404
// @match        *://*webapp.duckmyduck.com/*
// @grant        none
// @downloadURL  https://github.com/aastankeev/simple/raw/main/dmd.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/dmd.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

// Функция для обработки каждого слота и утки
function processSlots() {
  const carousel = document.querySelector('ul.w-fit.h-fit.flex.items-center.gap-1\\.5');
  
  if (!carousel) {
    console.log('Карусель не найдена');
    return;
  }

  const slots = carousel.querySelectorAll('.slot-nav-item');
  
  let currentSlot = 0;

  // Функция для клика по каждому слоту и утке
  function processSlot() {
    if (currentSlot >= slots.length) {
      console.log('Все слоты обработаны');
      return;
    }

    const slot = slots[currentSlot];
    const slotId = slot.id;
    console.log(`Кликаем по элементу с индексом: ${currentSlot}, ID: ${slotId}`);

    // Кликаем по текущему слоту
    slot.click();

    // Ждем, пока утка появится
    setTimeout(() => {
      // Ищем ID утки
      const duckElement = document.querySelector('figure[id^="duck-"]');
      if (duckElement) {
        const duckId = duckElement.id;
        console.log(`Найдена утка с ID: ${duckId}`);

        // Скроллим утку в центр
        duckElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

        // Функция для кликов по утке
        function clickDuck() {
          for (let i = 0; i < 10; i++) {  // 10 кликов
            setTimeout(() => {
              const rect = duckElement.getBoundingClientRect();
              const x = rect.left + rect.width / 2;
              const y = rect.top + rect.height / 2;

              // Отправляем клик
              ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(eventType => {
                const event = new MouseEvent(eventType, {
                  view: window,
                  bubbles: true,
                  cancelable: true,
                  clientX: x,
                  clientY: y,
                  button: 0
                });
                duckElement.dispatchEvent(event);
              });

              console.log(`Клик #${i + 1} по утке с ID: ${duckId}`);
            }, Math.random() * 333 + 333); // случайная задержка между кликами
          }
        }

        // Первый клик
        setTimeout(() => {
          clickDuck();
        }, Math.random() * 333 + 333); // Задержка для первого клика

        // Переходим к следующему слоту через 0.5 секунды
        currentSlot++;
        setTimeout(processSlot, 500); // Задержка 0.5 секунды между слотами

      } else {
        console.log(`Утка в слоте с ID: ${slotId} не найдена`);
        
        // Переходим к следующему слоту
        currentSlot++;
        setTimeout(processSlot, 500); // Задержка 0.5 секунды между слотами
      }
    }, 500); // Задержка для ожидания появления утки
  }

  processSlot(); // Начинаем обработку слотов
}

// Ожидаем появления карусели
function waitForCarousel() {
  const carousel = document.querySelector('ul.w-fit.h-fit.flex.items-center.gap-1\\.5');

  if (carousel) {
    console.log('Карусель обнаружена, начинаем обработку слотов');
    processSlots(); // Запускаем обработку слотов
  } else {
    console.log('Ожидаем появления карусели...');
    setTimeout(waitForCarousel, 1000); // Проверяем наличие карусели каждую секунду
  }
}

// Запуск ожидания появления карусели
waitForCarousel();

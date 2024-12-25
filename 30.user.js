// ==UserScript==
// @name         Zoo
// @namespace    http://tampermonkey.net/
// @version      7
// @description  Автоматизация сбора ежедневной награды и покупки животных в игре
// @author
// @match        *://*game.zoo.team/*
// @grant        none
// @icon         https://game.zoo.team/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/30.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/30.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function gameAutomation() {
  // Перезапуск через случайное время от 5 до 15 секунд
  const delay = Math.floor(Math.random() * 11 + 5) * 1000;

  // Находим все элементы с классом "point"
  const points = document.querySelectorAll('.point');
  
  const emptySlots = [];
  points.forEach(point => {
    const emptySlot = point.querySelector('.emptySlot');
    if (emptySlot) {
      const style = window.getComputedStyle(point);
      const left = style.left;
      const top = style.top;
      emptySlots.push({ point, left, top });
    } else {
      console.log('Слот занят или не найден:', point);
    }
  });

  if (emptySlots.length > 0) {
    const randomSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
    const pointClick = document.querySelector(`.pointClick[style*="left: ${randomSlot.left}; top: ${randomSlot.top};"]`);
    if (pointClick && isElementVisible(pointClick)) {
      pointClick.click();
      console.log('Кликнули по случайному свободному слоту:', pointClick);
    } else {
      console.log('Слот скрыт или не доступен для клика:', pointClick);
    }
  } else {
    console.log('Свободные слоты не найдены.');
  }

  function isElementVisible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  // Покупка животных
  const animals = Array.from(document.querySelectorAll('.animalForBuy')).map(animal => {
    const titleElement = animal.querySelector('.title');
    const priceText = animal.querySelector('.van-button__text').textContent.trim();
    const price = parseInt(priceText.replace(/\D/g, ''), 10);
    return {
      name: titleElement ? titleElement.textContent.trim() : 'Неизвестное животное',
      price: price,
      element: animal.querySelector('button.van-button--success')
    };
  }).filter(animal => animal.price > 0);
  animals.sort((a, b) => a.price - b.price);

  const moneyElement = document.querySelector('.zTextShadow2white');
  let money = 0;
  if (moneyElement) {
    const moneyText = moneyElement.textContent.trim();
    if (moneyText.includes('K')) money = parseFloat(moneyText.replace('K', '')) * 1000;
    else if (moneyText.includes('M')) money = parseFloat(moneyText.replace('M', '')) * 1000000;
    else if (moneyText.includes('B')) money = parseFloat(moneyText.replace('B', '')) * 1000000000;
    else money = parseFloat(moneyText);
    console.log('У вас есть денег:', money);
  } else {
    console.log('Сумма денег не найдена.');
    return;
  }

  const cheapestAnimal = animals.find(animal => animal.price <= money);
  if (cheapestAnimal) {
    cheapestAnimal.element.click();
    console.log('Купили самое дешевое животное:', cheapestAnimal.name);
    setTimeout(gameAutomation, delay);
  } else {
    console.log('Не хватает денег для покупки самого дешевого животного.');
    waitForTasksButton(); // Если денег недостаточно, запускаем вход в задачи
  }

  function waitForTasksButton() {
    const interval = setInterval(() => {
      const tasksButton = Array.from(document.querySelectorAll("#app .flyBtnTitle"))
        .find(button => button.textContent.trim() === "Задачи");
      if (tasksButton) {
        clearInterval(interval);
        console.log("Кнопка 'Задачи' найдена, запускаем сбор награды.");
        startGameAutomation(tasksButton);
      } else {
        console.log("Кнопка 'Задачи' пока не найдена, повторяем проверку...");
      }
    }, 2000);
  }

  function startGameAutomation(tasksButton) {
    tasksButton.click();
    setTimeout(() => {
      const dailyReward = document.querySelector(".dailyReward");
      if (dailyReward && !dailyReward.classList.contains("grayscale")) {
        dailyReward.click();
        setTimeout(() => {
          const claimButton = document.querySelector(
            "button.van-button--warning.van-button--large.van-button--round span.van-button__text"
          );
          if (claimButton && claimButton.textContent.trim() === "Получить награду") {
            claimButton.closest("button").click();
            console.log("Ежедневная награда получена.");
          } else {
            console.log("Кнопка 'Получить награду' не найдена.");
          }
        }, 500);
      } else {
        console.log("Ежедневная награда уже собрана или недоступна.");
      }
    }, 1000);
  }
})();


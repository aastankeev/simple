// ==UserScript==
// @name         Zoo
// @namespace    http://tampermonkey.net/
// @version      29
// @description  Автоматизация сбора ежедневной награды и покупки животных в игре, загадка дня
// @author       
// @match        *://*game.zoo.team/*
// @grant        none
// @icon         https://game.zoo.team/favicon.ico
// @downloadURL  https://github.com/aastankeev/simple/raw/main/30.user.js
// @updateURL    https://github.com/aastankeev/simple/raw/main/30.user.js
// @homepage     https://github.com/aastankeev/simple
// ==/UserScript==

(function zooAutomation() { 
    const delay = 5000; // Задержка перед действиями и перезапуском (5 секунд)

    // Запуск основного процесса
    function startAutomation() {
        console.log("Запуск автоматизации...");
        checkBalance(); // Сначала проверяем баланс
    }

    // Проверка баланса
    function checkBalance() {
        console.log("Проверяем текущий баланс...");
        const moneyElement = document.querySelector('.zTextShadow2white');
        let money = 0;

        if (moneyElement) {
            const moneyText = moneyElement.textContent.trim();
            if (moneyText.includes('K')) money = parseFloat(moneyText.replace('K', '').trim()) * 1000;
            else if (moneyText.includes('M')) money = parseFloat(moneyText.replace('M', '').trim()) * 1000000;
            else if (moneyText.includes('B')) money = parseFloat(moneyText.replace('B', '').trim()) * 1000000000;
            else money = parseFloat(moneyText);

            console.log("Денег доступно:", money);
            if (money > 0) {
                // Если баланс найден, продолжаем с поиском слота
                waitForEmptySlot();
            } else {
                console.log("Баланс не найден или равен нулю, повторная проверка через 5 секунд...");
                setTimeout(startAutomation, delay); // Повторный запуск через 5 секунд
            }
        } else {
            console.log("Не удалось найти элемент с балансом. Повторим проверку через 5 секунд...");
            setTimeout(startAutomation, delay); // Повторный запуск через 5 секунд
        }
    }

    // Проверка наличия свободного слота
    function waitForEmptySlot() {
        console.log("Проверяем наличие свободных слотов...");
        const points = document.querySelectorAll('.point');
        const emptySlots = [];

        points.forEach(point => {
            const emptySlot = point.querySelector('.emptySlot');
            if (emptySlot) {
                const style = window.getComputedStyle(point);
                const left = style.left;
                const top = style.top;
                emptySlots.push({ point, left, top });
            }
        });

        if (emptySlots.length > 0) {
            console.log("Свободный слот найден, продолжаем выполнение...");
            handleSlotAction(emptySlots);
        } else {
            console.log("Свободных слотов нет, повторяем проверку через 2 секунды...");
            setTimeout(waitForEmptySlot, 2000); // Повторяем проверку через 2 секунды
        }
    }

    // Действие с пустым слотом
    function handleSlotAction(emptySlots) {
        const randomSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
        const pointClick = document.querySelector(`.pointClick[style*="left: ${randomSlot.left}; top: ${randomSlot.top};"]`);

        if (pointClick && isElementVisible(pointClick)) {
            setTimeout(() => {
                pointClick.click();
                console.log("Кликнули по случайному свободному слоту:", randomSlot);
                // Добавляем задержку перед продолжением
                setTimeout(() => {
                    handleAnimalPurchase(); // Продолжаем покупку после задержки
                }, 3000); // Задержка 3 секунды перед продолжением
            }, 1000); // Задержка 1 секунда перед кликом
        } else {
            console.log("Элемент для клика не найден или невидим.");
            setTimeout(startAutomation, delay); // Перезапуск
        }
    }

    // Проверка видимости элемента
    function isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }

    // Покупка животного
    function handleAnimalPurchase() {
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
            if (moneyText.includes('K')) money = parseFloat(moneyText.replace('K', '').trim()) * 1000;
            else if (moneyText.includes('M')) money = parseFloat(moneyText.replace('M', '').trim()) * 1000000;
            else if (moneyText.includes('B')) money = parseFloat(moneyText.replace('B', '').trim()) * 1000000000;
            else money = parseFloat(moneyText);

            console.log("Денег доступно:", money);
        } else {
            console.log("Не удалось определить баланс.");
            setTimeout(startAutomation, 5000); // Задержка перед перезапуском
            return;
        }

        const cheapestAnimal = animals.find(animal => animal.price <= money);
        if (cheapestAnimal) {
            console.log("Самое дешевое животное:", cheapestAnimal.name, "Цена:", cheapestAnimal.price);
            setTimeout(() => {
                cheapestAnimal.element.click();
                console.log("Купили самое дешевое животное:", cheapestAnimal.name);
                setTimeout(startAutomation, 5000); // Задержка перед перезапуском
            }, 1000); // Задержка 1 секунда перед покупкой
        } else {
            console.log('Недостаточно денег для покупки. Закрываем окно и переходим к задачам...');
            const closeButton = document.querySelector('.van-popup__close-icon');
            if (closeButton) {
                closeButton.click();
                console.log("Закрыли всплывающее окно.");
            }
            setTimeout(() => {
                handleTasks(); // Переход к задачам после задержки
            }, 2000); // Задержка 2 секунды
        }
    }
   
// Работа с задачами 
function handleTasks() {
    const tasksButton = Array.from(document.querySelectorAll("#app .flyBtnTitle"))
        .find(button => button.textContent.trim() === "Задачи");

    if (tasksButton) {
        tasksButton.click();
        console.log("Кликнули по кнопке 'Задачи'.");
        setTimeout(() => {
            collectDailyReward(); // Переход к сбору награды после задержки
        }, 2000); // Задержка 2 секунды после клика
    } else {
        console.log("Кнопка 'Задачи' не найдена. Завершаем скрипт.");
        setTimeout(() => {
            openRiddleAndSubmitWord(); // Завершение с задержкой
        }, 1000);
    }
}

// Сбор ежедневной награды
function collectDailyReward() {
    const dailyReward = document.querySelector(".dailyReward");

    if (dailyReward && !dailyReward.classList.contains("grayscale")) {
        dailyReward.click();
        console.log("Собрали ежедневную награду.");
        
        // Добавляем задержку перед поиском кнопки "Получить награду"
        setTimeout(() => {
            clickClaimRewardButton(); // Попытка нажать "Получить награду"
        }, 2000); // Задержка 2 секунды после клика на "dailyReward"
    } else {
        console.log("Ежедневная награда уже собрана или недоступна.");
        setTimeout(() => {
            openRiddleAndSubmitWord(); // Завершение после проверки награды
        }, 2000); // Задержка 2 секунды после проверки
    }
}
// Клик по кнопке "Получить награду"
function clickClaimRewardButton() {
    const claimRewardButton = Array.from(document.querySelectorAll("button.van-button--warning.van-button--large.van-button--round"))
        .find(button => button.textContent.trim() === "Получить награду");

    if (claimRewardButton) {
        claimRewardButton.click();
        console.log("Нажали на кнопку 'Получить награду'.");
        setTimeout(() => {
            openRiddleAndSubmitWord(); // Завершение после нажатия на "Получить награду"
        }, 2000); // Задержка 2 секунды после нажатия
    } else {
        console.log("Кнопка 'Получить награду' не найдена.");
        setTimeout(() => {
            openRiddleAndSubmitWord(); // Завершение после проверки
        }, 2000); // Задержка 2 секунды после проверки
    }
}

// Массив слов для подстановки в зависимости от даты
const wordsForDates = {
    "26.12.2024": "Dung beetle",
    // Добавь другие даты и слова
};

// Функция для получения текущей даты в формате dd.mm.yyyy
function getCurrentDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); // День
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяц
    const year = date.getFullYear(); // Год
    return `${day}.${month}.${year}`;
}

// Функция для закрытия всплывающего окна
function closePopup() {
    const closeButton = document.querySelector("div.van-popup.popup i.van-popup__close-icon");
    if (closeButton) {
        closeButton.click(); // Закрыть всплывающее окно
        console.log("Всплывающее окно закрыто.");
    } else {
        console.log("Кнопка закрытия всплывающего окна не найдена.");
    }
}

// Проверка на успешное выполнение задачи или ошибку
function checkTaskResult() {
    const successButtonSelector = "button.van-button--warning.van-button--large.van-button--round.btnFinish";
    const errorSelector = "div[style='color: red;']";

    let checkInterval = setInterval(() => {
        const successButton = document.querySelector(successButtonSelector);
        const errorMessage = document.querySelector(errorSelector);

        if (successButton) {
            successButton.click(); // Нажать кнопку "Взять +1 000"
            console.log("Награда за разгаданную загадку взята.");
            clearInterval(checkInterval); // Остановить проверку
            openRebusOfTheDay();
        } else if (errorMessage) {
            console.log("Ошибка проверки задания: неправильное слово.");
            clearInterval(checkInterval); // Остановить проверку
            closePopup(); // Закрыть всплывающее окно
            openRebusOfTheDay();
        }
    }, 500); // Проверка каждые 500 мс

    // Если через 10 секунд ничего не произошло, закрыть всплывающее окно
    setTimeout(() => {
        clearInterval(checkInterval); // Остановить проверку
        console.log("Кнопка 'Взять +1 000' не появилась. Закрываю окно.");
        closePopup(); // Закрыть всплывающее окно
        openRebusOfTheDay();
    }, 10000);
}

// Функция для подстановки слова в поле ответа и клика по кнопке "Проверить ответ"
function submitWordForToday() {
    const currentDate = getCurrentDate();
    const wordToSubmit = wordsForDates[currentDate];

    if (wordToSubmit) {
        const inputField = document.querySelector("#van-field-1-input");
        if (inputField) {
            inputField.value = wordToSubmit; // Подставить слово в поле
            inputField.dispatchEvent(new Event('input')); // Эмулировать ввод текста

            // Используем задержку перед нажатием кнопки
            setTimeout(() => {
const checkButton = Array.from(document.querySelectorAll("button.van-button.van-button--success.van-button--normal.van-button--round"))
    .find(button => button.textContent.trim() === "Проверить ответ");

if (checkButton) {
    checkButton.click(); // Нажать кнопку "Проверить ответ"
    console.log("Кнопка 'Проверить ответ' нажата.");
    setTimeout(() => {
        checkTaskResult(); // Переход на проверку результата с задержкой
    }, 1000); // Задержка в 1 секунду для обработки клика
} else {
    console.log("Кнопка 'Проверить ответ' не найдена.");
    openRebusOfTheDay();
}

            }, 500); // Задержка в 500 миллисекунд
        } else {
            console.log("Поле для ввода не найдено.");
            closePopup(); // Закрыть всплывающее окно
            openRebusOfTheDay()
        }
    } else {
        console.log(`Слово для ${currentDate} не найдено в массиве.`);
        closePopup(); // Закрыть всплывающее окно
        openRebusOfTheDay()
    }
}

// Основная логика для открытия задачи и подстановки ответа
function openRiddleAndSubmitWord() {
    // Поиск задачи "Загадка дня"
    const riddleTask = Array.from(document.querySelectorAll(".van-cell__title"))
        .find(cell => cell.textContent.includes("Загадка дня"));

    if (riddleTask) {
        // Кликнуть по найденной задаче
        riddleTask.click();

        // Задержка перед подстановкой слова, чтобы успела открыться задача
        setTimeout(() => {
            submitWordForToday();
        }, 1000); // Задержка в 1 секунду
        console.log("Задача 'Загадка дня' открыта.");
        openRebusOfTheDay()
    } else {
        console.log("Задача 'Загадка дня' не найдена.");
        openRebusOfTheDay()
    }
}
// ****************** завершение основного рабочего блока

    
// Массив слов для подстановки в зависимости от даты
const wordsForRebusDates = {
    "26.12.2024": "Jaguar", // Для 26 декабря
    // Добавь другие даты и слова
};

// Функция для открытия ребуса дня
function openRebusOfTheDay() {
    const rebusButton = Array.from(
        document.querySelectorAll('div.van-cell.van-cell--center.van-cell--clickable.van-cell--large .van-cell__title span')
    ).find(span => span.textContent === 'Ребус дня');

    if (rebusButton) {
        rebusButton.closest('.van-cell').click(); // Кликаем по всему элементу
        console.log("Открыт ребус дня");

        // Задержка для открытия ребуса перед заполнением ответа
        setTimeout(() => {
            submitWordForToday();
        }, 1000); // Задержка 1 секунда
    } else {
        console.log("Не найден элемент 'Ребус дня'");
    }
}

// Функция для подстановки слова в поле ответа и клика по кнопке "Проверить ответ"
function submitWordForToday() {
    const currentDate = getCurrentDate();
    const wordToSubmit = wordsForRebusDates[currentDate];

    if (wordToSubmit) {
        const inputField = document.querySelector("#van-field-1-input");
        if (inputField) {
            inputField.value = wordToSubmit; // Подставить слово в поле
            inputField.dispatchEvent(new Event('input')); // Эмулировать ввод текста

            // Используем задержку перед нажатием кнопки
            setTimeout(() => {
const checkButton = Array.from(document.querySelectorAll("button.van-button.van-button--success.van-button--normal.van-button--round"))
    .find(button => button.textContent.trim() === "Проверить ответ");

if (checkButton) {
    checkButton.click(); // Нажать кнопку "Проверить ответ"
    console.log("Кнопка 'Проверить ответ' нажата.");
    setTimeout(() => {
        checkTaskResult(); // Переход на проверку результата с задержкой
    }, 1000); // Задержка в 1 секунду для обработки клика
} else {
    console.log("Кнопка 'Проверить ответ' не найдена.");
}

            }, 500); // Задержка в 500 миллисекунд
        } else {
            console.log("Поле для ввода не найдено.");
            closePopup(); // Закрыть всплывающее окно
        }
    } else {
        console.log(`Слово для ${currentDate} не найдено в массиве.`);
        closePopup(); // Закрыть всплывающее окно
    }
}

// Функция для проверки результата задачи
function checkTaskResult() {
    const successButton = document.querySelector("button.van-button.van-button--warning.van-button--large.van-button--round");
    const errorMessage = document.querySelector("div[style='color: red;']");

    if (successButton) {
        successButton.click(); // Нажать на кнопку "Взять +1 000"
        console.log("Награда забрана.");
    } else if (errorMessage) {
        console.log("Ошибка проверки задания.");
        closePopup(); // Закрыть всплывающее окно
    } else {
        console.log("Результат проверки не определён. Закрытие всплывающего окна.");
        setTimeout(closePopup, 10000); // Закрыть окно через 10 секунд, если ничего не произошло
    }
}

// Функция для закрытия всплывающего окна
function closePopup() {
    const closeButton = document.querySelector("div.van-popup.popup i.van-popup__close-icon");
    if (closeButton) {
        closeButton.click(); // Закрыть всплывающее окно
        console.log("Всплывающее окно закрыто.");
    } else {
        console.log("Кнопка закрытия всплывающего окна не найдена.");
    }
}

// Запуск основного процесса
openRebusOfTheDay();    
// Запуск процесса загадка дня
openRiddleAndSubmitWord();
    // Запуск автоматизации
    startAutomation();
})();

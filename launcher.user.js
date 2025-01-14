// ==UserScript==
// @name        launche
// @namespace   Violentmonkey Scripts
// @version     14
// @description добавлен перезапуск поиска launche кнопки если она не нажалась\ переход на телеграм версию A теперь кнопка конфирм
// @downloadURL https://github.com/aastankeev/simple/raw/main/launcher.user.js
// @updateURL   https://github.com/aastankeev/simple/raw/main/launcher.user.js
// @homepage    https://github.com/aastankeev/simple
// @icon        https://telegram.org/favicon.ico
// @match       https://web.telegram.org/*
// @grant       none
// @author      lab404
// ==/UserScript==

(function() {
    'use strict';

    let intervalId; // Хранит ID интервала
    let isButtonClicked = false; // Флаг, указывающий, нажата ли кнопка

    // Функция для поиска и нажатия кнопки
    function clickConfirmButton() {
        const confirmButton = document.querySelector('.Button.confirm-dialog-button.default.primary.text');
        const alternativeButton = document.querySelector('.popup-button.btn.primary.rp'); // Альтернативный селектор

        if (confirmButton) {
            // Нажатие кнопки с эмуляцией событий
            confirmButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
            confirmButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
            confirmButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
            confirmButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            confirmButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

            console.log('Кнопка "Confirm" найдена и нажата!');
            isButtonClicked = true; // Устанавливаем флаг, что кнопка нажата
            clearInterval(intervalId); // Останавливаем дальнейшие проверки
        } else if (alternativeButton) {
            // Если альтернативная кнопка найдена
            alternativeButton.click();
            console.log('Альтернативная кнопка нажата!');
            clearInterval(intervalId); // Останавливаем дальнейшие проверки
        } else {
            console.log('Кнопка "Confirm" и альтернативная кнопка не найдены. Повторная проверка через 10 секунд.');
        }
    }

    // Таймер для повторной проверки
    function startChecking() {
        let countdown = 10;

        intervalId = setInterval(() => {
            if (countdown === 0) {
                countdown = 10; // Сброс таймера
                clickConfirmButton(); // Проверяем кнопки каждые 10 секунд
            } else {
                console.log(`Повторная проверка через: ${countdown} секунд.`);
                countdown--; // Уменьшаем таймер
            }
        }, 1000); // Интервал в 1 секунду
    }

    // Запускаем скрипт после загрузки страницы
    window.addEventListener('load', () => {
        console.log('Скрипт запущен. Начинаем поиск кнопки "Confirm".');
        clickConfirmButton(); // Первая попытка нажатия
        if (!isButtonClicked) {
            startChecking(); // Если кнопка не нажата, запускаем проверку
        }
    });
})();

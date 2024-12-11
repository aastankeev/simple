// ==UserScript==
// @name        Not Pixel Autoclicker
// @namespace   Violentmonkey Scripts
// @version     126
// @description halloween fix 18.11.24/27.11.2024 / фикс главноего всплывающего окна турнира/ просмотр рекламы / кофе брейк
// @downloadURL https://github.com/aastankeev/simple/raw/main/traf.user.js
// @updateURL   https://github.com/aastankeev/simple/raw/main/traf.user.js
// @homepage    https://github.com/aastankeev/simple
// @icon        https://notpx.app/favicon.ico
// @match       *://*.notpx.app/*
// @grant       none
// @author      lab404
// ==/UserScript==

(function () {
    'use strict';

// Функция для закрытия всплывающего окна (если оно присутствует)
function closePopupIfExists() {
    setTimeout(() => {  // Добавляем задержку перед поиском кнопки
        const closeButtonContainer = document.querySelector('div._container_1df7o_14');
        if (closeButtonContainer) {
            const closeButton = closeButtonContainer.querySelector('div._close_gb8eq_23');
            if (closeButton) {
                closeButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
                closeButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
                closeButton.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
                console.log('Всплывающее окно закрыто');
            } else {
                console.log('Кнопка закрытия не найдена');
            }
        } else {
            console.log('Контейнер для кнопки закрытия не найден');
        }
    }, 2000); // Задержка в 2 секунды (можно изменить по необходимости)
}

// Вызываем функцию для закрытия всплывающего окна при запуске
closePopupIfExists();


    let isSecondButtonClicked = false; // Флаг для отслеживания состояния нажатия кнопки

    function logCounterValueAndClick() {
        const counterElement = document.querySelector('._counter_oxfjd_32 span:last-child');

        if (counterElement) {
            const counterValueText = counterElement.textContent.trim();
            let counterValue = parseInt(counterValueText, 10);

            if (counterValueText === "max") {
                counterValue = 24;
            }

            if (counterValue > 1) {
                console.log('Текущее значение энергии:', counterValue);
                startDrawingCycle(counterValue);
            } else {
                console.log('Энергия недостаточна или не найдена');
                clickEnergyRefreshButtons(); // Если энергии недостаточно, нажимаем на нужные кнопки
            }
        }
    }

    function clickEnergyRefreshButtons() {
        const firstButton = document.querySelector('._button_rjvnl_1');
        if (firstButton) {
            firstButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
            firstButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
            firstButton.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
            console.log('Меню открыто');

            setTimeout(() => {
                const secondButton = document.querySelector('._button_13oyr_11');
                if (secondButton) {
                    secondButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
                    secondButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
                    secondButton.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
                    console.log('Награда собрана');
                } else {
                    console.log('Награда не найдена');
                }
                setTimeout(clickFinalButton, 500); // После попытки сбора награды нажимаем финальную кнопку
            }, 300); // Ждем 300 мс перед нажатием второй кнопки
        } else {
            console.log('Меню не найдено');
            setTimeout(clickFinalButton, 500); // Если меню не найдено, сразу нажимаем финальную кнопку
        }
    }

    // Функция для начала цикла рисования
  function startDrawingCycle(initialEnergy) {
        if (initialEnergy > 1 && !isSecondButtonClicked) {
            const secondButton = document.querySelectorAll('button._button_xsy81_2')[0];

            if (secondButton) {
                secondButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
                secondButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
                secondButton.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));

                console.log('Трафарет выбран');
                isSecondButtonClicked = true;

                openColorPalette(() => {
                    setTimeout(() => {
                        changeColorToWhite(initialEnergy);
                    }, 500); // Ждем 500 мс перед выбором белого цвета
                });
            } else {
                console.log('Трафарет не найден');
            }
        }
    }

    function openColorPalette(callback) {
        const activeColorButton = document.querySelector('._active_color_dvy5p_48');

        if (activeColorButton) {
            activeColorButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
            activeColorButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
            activeColorButton.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));

            console.log('Палитра цветов открыта');

            if (typeof callback === 'function') {
                setTimeout(callback, 300); // Добавляем задержку перед выполнением callback
            }
        } else {
            console.log('Кнопка для открытия палитры не найдена');
        }
    }

    function changeColorToWhite(currentEnergy) {
        const colorItems = document.querySelectorAll('._color_item_epppt_22');
        let foundColorItem = null;

        colorItems.forEach(item => {
            const bgColor = window.getComputedStyle(item).backgroundColor;
            if (bgColor === 'rgb(255, 255, 255)') {
                foundColorItem = item;
            }
        });

        if (foundColorItem) {
            foundColorItem.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
            foundColorItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
            foundColorItem.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));

            console.log('Белый цвет выбран');

            setTimeout(() => {
                clickPaintButton(() => {
                    console.log('Рисуем белым цветом');
                    setTimeout(() => {
                        changeColorToBlack(currentEnergy);
                    }, 1000); // Ждем 1 секунду перед выбором черного цвета
                });
            }, 500);
        } else {
            console.log('Белый цвет не найден');
        }
    }

    function clickPaintButton(callback) {
        const paintButton = [...document.querySelectorAll('span._button_text_1ley0_167')]
            .find(button => button.textContent.trim() === 'Paint');

        if (paintButton) {
            paintButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
            paintButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
            paintButton.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));

            console.log('Нарисовали');

            if (typeof callback === 'function') {
                setTimeout(callback, 300);
            }
        } else {
            console.log('Кнопка "Paint" не найдена');
        }
    }
    function changeColorToBlack(currentEnergy) {
        const colorItems = document.querySelectorAll('._color_item_epppt_22');
        let foundColorItem = null;

        colorItems.forEach(item => {
            const bgColor = window.getComputedStyle(item).backgroundColor;
            if (bgColor === 'rgb(0, 0, 0)') {
                foundColorItem = item;
            }
        });

        if (foundColorItem) {
            foundColorItem.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
            foundColorItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
            foundColorItem.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));

            console.log('черный цвет выбран');

            setTimeout(() => {
                clickPaintButton(() => {
                    console.log('Нарисовали черным цветом');
                    setTimeout(() => {
                        updateEnergyAndContinue(currentEnergy); // Обновляем энергию и продолжаем цикл
                    }, 500); // Ждем перед обновлением энергии и продолжением
                });
            }, 500); // Ждем 500 мс перед нажатием на кнопку "Paint"
        } else {
            console.log('черный цвет не найден');
        }
    }

    function updateEnergyAndContinue(previousEnergy) {
        // Находим элемент счетчика энергии снова, чтобы обновить значение
        const counterElement = document.querySelector('._counter_oxfjd_32 span:last-child');
        const newEnergyText = counterElement.textContent.trim();
        let newEnergy = parseInt(newEnergyText, 10);

        // Проверяем, является ли значение "max"
        if (newEnergyText === "max") {
            newEnergy = Infinity; // Устанавливаем как бесконечность для удобства
        }

        console.log('Обновленное значение энергии:', newEnergy);

        // Если энергии больше 1, продолжаем рисование
        if (newEnergy > 1 && newEnergy < previousEnergy) {
            console.log('Продолжаем рисование, энергии достаточно');
            setTimeout(() => {
                isSecondButtonClicked = false;
                startDrawingCycle(newEnergy);
            }, 1000); // Ждем перед началом нового цикла
        } else {
            console.log('Недостаточно энергии для продолжения');
            clickEnergyRefreshButtons(); // Если энергии недостаточно, нажимаем на нужные кнопки
        }
    }
// Функция для проверки и нажатия финальной кнопки с циклом каждые 10 секунд
function clickFinalButton() {
    const element = document.querySelector('div._info_row_bt2qf_35');
    if (element) {
        element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
        element.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
        element.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
        console.log('Финальная кнопка нажата');
    } else {
        console.log('Финальная кнопка не найдена');
    }

    // Начинаем цикл проверки каждые 10 секунд
    const intervalId = setInterval(() => {
        const retryElement = document.querySelector('div._info_row_bt2qf_35');
        if (retryElement) {
            retryElement.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
            retryElement.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
            retryElement.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
            console.log('Финальная кнопка снова нажата');
        } else {
            console.log('Финальная кнопка пока недоступна');
        }
    }, 10000); // Проверка каждые 10 секунд

    // Остановку цикла можно предусмотреть при необходимости
}


    setInterval(logCounterValueAndClick, 2000);
})();

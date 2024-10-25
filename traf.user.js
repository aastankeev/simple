// ==UserScript==
// @name        Not Pixel Autoclicker
// @namespace   Violentmonkey Scripts
// @version     106
// @description тест 3 автообновления
// @downloadURL https://github.com/aastankeev/simple/raw/main/traf.user.js
// @updateURL   https://github.com/aastankeev/simple/raw/main/traf.user.js
// @homepage    https://github.com/aastankeev/simple
// @icon        https://notpx.app/favicon.ico
// @match       *://*.notpx.app/*
// @grant       none
// @author      lab404
// ==/UserScript==

(function() {
    'use strict';

    let isSecondButtonClicked = false; // Флаг для отслеживания состояния нажатия кнопки

    // Функция для получения и вывода значения энергии
    function logCounterValueAndClick() {
        const counterElement = document.querySelector('._counter_oxfjd_32 span:last-child'); // Находим второй span внутри div

        if (counterElement) {
            const counterValueText = counterElement.textContent.trim(); // Получаем текстовое значение
            let counterValue = parseInt(counterValueText, 10); // Пробуем преобразовать в число

            // Проверяем, является ли значение "max"
            if (counterValueText === "max") {
                counterValue = Infinity; // Устанавливаем как бесконечность для удобства
            }

            if (counterValue > 0) {
                console.log('Текущее значение энергии:', counterValue);
                startDrawingCycle(counterValue);
            } else {
                console.log('Энергия недостаточна или не найдена');
                clickEnergyRefreshButtons(); // Если энергии недостаточно, нажимаем на нужные кнопки
            }
        }
    }

    // Функция для начала цикла рисования
    function startDrawingCycle(initialEnergy) {
        if (initialEnergy > 0 && !isSecondButtonClicked) {
            const secondButton = document.querySelectorAll('._buttons_container_b4e6p_17 ._button_xsy81_2')[0];

            if (secondButton) {
                secondButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
                secondButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
                secondButton.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));

                console.log('трафарет выбран');
                isSecondButtonClicked = true;

                openColorPalette(() => {
                    setTimeout(() => {
                        changeColorToWhite(initialEnergy); // Передаем текущее значение энергии
                    }, 500); // Ждем 500 мс перед выбором белого цвета
                });
            } else {
                console.log('трафарет не найден');
            }
        }
    }

    function openColorPalette(callback) {
        const activeColorButton = document.querySelector('._active_color_hqiqj_51');

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

            console.log('белый цвет выбран');

            setTimeout(() => {
                clickPaintButton(() => {
                    console.log('Рисуем белым цветом');
                    setTimeout(() => {
                        changeColorToBlack(currentEnergy); // Передаем текущее значение энергии
                    }, 1000); // Ждем 1 секунду перед выбором черного цвета
                });
            }, 500); // Ждем 500 мс перед нажатием на кнопку "Paint"
        } else {
            console.log('белый цвет не найден');
        }
    }

    function clickPaintButton(callback) {
        const paintButton = [...document.querySelectorAll('span._button_text_hqiqj_171')]
            .find(button => button.textContent.trim() === 'Paint');

        if (paintButton) {
            paintButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
            paintButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
            paintButton.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));

            console.log('Нарисовали');

            if (typeof callback === 'function') {
                setTimeout(callback, 300); // Добавляем задержку перед вызовом callback
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

    // Функция для нажатия кнопок при недостатке энергии
    function clickEnergyRefreshButtons() {
        // Нажимаем на первую кнопку _button_1tu7a_1
        const firstButton = document.querySelector('._button_1tu7a_1');
        if (firstButton) {
            firstButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
            firstButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
            firstButton.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
            console.log('Нажата первая кнопка _button_1tu7a_1');
        } else {
            console.log('Первая кнопка _button_1tu7a_1 не найдена');
        }

        // Нажимаем на вторую кнопку _button_13oyr_11
        setTimeout(() => {
            const secondButton = document.querySelector('._button_13oyr_11');
            if (secondButton) {
                secondButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
                secondButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
                secondButton.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
                console.log('Нажата вторая кнопка _button_13oyr_11');
            } else {
                console.log('Вторая кнопка _button_13oyr_11 не найдена');
            }
        }, 300); // Ждем 300 мс перед нажатием второй кнопки
    }

    // Запускаем основной цикл
    setInterval(logCounterValueAndClick, 2000); // Проверяем каждые 2 секунды
})();

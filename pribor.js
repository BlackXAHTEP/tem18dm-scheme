// === УПРАВЛЕНИЕ ПРИБОРАМИ (МАНОМЕТРАМИ) И РЕЛЕ ДАВЛЕНИЯ ===

// === ГЛОБАЛЬНЫЕ ПОКАЗАНИЯ ДАВЛЕНИЯ И ТЕМПЕРАТУРЫ ===
window.gauges = {
    fuelPressure: 0,
    oilPressure: 0,
    rpm: 0,
    batteryVoltage: 0,
    waterTemperature: 65,   // °C, вода
    oilTemperature: 50      // °C, масло
};

// === РЕЛЕ ДАВЛЕНИЯ МАСЛА (РДМ) ===
// Контакт замыкается при давлении >= 1.5 кгс/см²
const rdm = {
    contact: {
        inX: 543, inY: 1995,
        outX: 515, outY: 1995
    },
    isClosed: false,

    // Обновление состояния по давлению масла
    update() {
        const oilPressure = window.gauges.oilPressure;
        const shouldBeClosed = oilPressure >= 1.5;

        if (this.isClosed !== shouldBeClosed) {
            this.isClosed = shouldBeClosed;
            requestRedraw();
        }
    },

    // Передача напряжения через контакт
    getPropagationRules(plusPoints, minusPoints) {
        this.update();

        if (!this.isClosed) return [];

        const hasInput1 = plusPoints.has(`${this.contact.inX},${this.contact.inY}`);
        const hasInput2 = plusPoints.has(`${this.contact.outX},${this.contact.outY}`);

        const rules = [];

        if (hasInput1) {
            rules.push({
                from: `${this.contact.inX},${this.contact.inY}`,
                to: `${this.contact.outX},${this.contact.outY}`,
                type: 'plus'
            });
        }

        if (hasInput2) {
            rules.push({
                from: `${this.contact.outX},${this.contact.outY}`,
                to: `${this.contact.inX},${this.contact.inY}`,
                type: 'plus'
            });
        }

        return rules;
    },

    // Отрисовка контакта
    draw(ctx, networks) {
        this.update(); // обновляем состояние

        const hasInput = networks.plusPoints.has(`${this.contact.inX},${this.contact.inY}`);
        const inputColor = hasInput ? '#c00' : '#000';
        const contactColor = this.isClosed && hasInput ? '#c00' : '#000';

        // Линия входа
        ctx.beginPath();
        ctx.moveTo(this.contact.inX, this.contact.inY);
        ctx.lineTo(this.contact.inX - 20, this.contact.inY);
        ctx.strokeStyle = inputColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Линия выхода
        ctx.beginPath();
        ctx.moveTo(this.contact.outX, this.contact.outY);
        ctx.lineTo(this.contact.outX + 20, this.contact.outY);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Подвижный контакт
        if (this.isClosed) {
            ctx.beginPath();
            ctx.moveTo(this.contact.inX - 20, this.contact.inY);
            ctx.lineTo(this.contact.outX, this.contact.outY);
            ctx.strokeStyle = inputColor;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.contact.inX - 20, this.contact.inY);
            ctx.lineTo(this.contact.outX - 15, this.contact.outY - 10);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.contact.outX - 15, this.contact.outY - 10);
            ctx.lineTo(this.contact.outX, this.contact.outY);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements = window.schemeElements || [];
window.animatedElements = window.animatedElements || [];
window.schemeElements.push(rdm);
window.animatedElements.push(rdm);

// =========================================================================================================================
// === РЕЛЕ ДАВЛЕНИЯ МАСЛА 2 (SP2) — обновлённая версия, отрисовка как у РДМ ===
const sp2 = {
    contact: {
        inX: 311,
        inY: 498,
        outX: 277,
        outY: 498
    },
    isClosed: false,

    // Обновление состояния по давлению масла
    update() {
        const oilPressure = window.gauges.oilPressure;
        const shouldBeClosed = oilPressure >= 2.0;

        if (this.isClosed !== shouldBeClosed) {
            this.isClosed = shouldBeClosed;
            requestRedraw();
        }
    },

    // Передача напряжения через контакт (если замкнут)
    getPropagationRules(plusPoints, minusPoints) {
        this.update();

        if (!this.isClosed) return [];

        const hasInput1 = plusPoints.has(`${this.contact.inX},${this.contact.inY}`);
        const hasInput2 = plusPoints.has(`${this.contact.outX},${this.contact.outY}`);

        const rules = [];

        if (hasInput1) {
            rules.push({
                from: `${this.contact.inX},${this.contact.inY}`,
                to: `${this.contact.outX},${this.contact.outY}`,
                type: 'plus'
            });
        }

        if (hasInput2) {
            rules.push({
                from: `${this.contact.outX},${this.contact.outY}`,
                to: `${this.contact.inX},${this.contact.inY}`,
                type: 'plus'
            });
        }

        return rules;
    },

    // Отрисовка контакта — стиль РДМ
    draw(ctx, networks) {
        this.update();

        const hasInput = networks.plusPoints.has(`${this.contact.inX},${this.contact.inY}`);
        const inputColor = hasInput ? '#c00' : '#000';
        const contactColor = this.isClosed && hasInput ? '#c00' : '#000';

        // Линия входа (слева)
        ctx.beginPath();
        ctx.moveTo(this.contact.outX, this.contact.outY);
        ctx.lineTo(this.contact.outX + 10, this.contact.outY);
        ctx.strokeStyle = inputColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Линия выхода (справа)
        ctx.beginPath();
        ctx.moveTo(this.contact.inX, this.contact.inY);
        ctx.lineTo(this.contact.inX - 10, this.contact.inY);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Подвижный контакт — диагональное соединение
        if (this.isClosed) {
            // Замкнут — красная линия от входа к выходу
            ctx.beginPath();
            ctx.moveTo(this.contact.inX, this.contact.inY);
            ctx.lineTo(this.contact.outX, this.contact.outY);
            ctx.strokeStyle = inputColor;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.contact.inX - 25, this.contact.outY - 10);
            ctx.lineTo(this.contact.inX - 10, this.contact.outY);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(sp2);
window.animatedElements.push(sp2);

// ========================================================================================================================
// === УПРАВЛЕНИЕ ДАВЛЕНИЕМ МАСЛА — ОТДЕЛЬНЫЙ МОДУЛЬ ===
const oilPressureController = {
    sources: {
        dgu: { value: 0, priority: 10 },        // ДГУ — приоритет 10
        oilPump: { value: 0, priority: 5 },      // Масляный насос — приоритет 5
        leak: { value: 0, priority: 0 }          // Утечка — приоритет 0
    },

    update() {
        const isDguRunning = window.dgu?.isRunning || false;
        const isOilPumpRunning = window.OilPumpMotor?.isActive || false;

        // ДГУ — главный источник давления
        this.sources.dgu.value = isDguRunning ? 0.5 : 0;

        // Масляный насос — работает, только если ДГУ выключено
        // И давление не превышает 1.7
        this.sources.oilPump.value = isOilPumpRunning && !isDguRunning && window.gauges.oilPressure < 1.7 ? 0.15 : 0;

        // Утечка — если ничего не работает
        this.sources.leak.value = !isDguRunning && !isOilPumpRunning ? -0.1 : 0;
    },

    apply() {
        this.update();

        // Сортируем по приоритету (высший — первый)
        const sortedSources = Object.entries(this.sources)
            .sort((a, b) => b[1].priority - a[1].priority);

        let delta = 0;
        for (const [name, source] of sortedSources) {
            if (source.value !== 0) {
                delta = source.value;
                break;
            }
        }

        // Обновляем давление с ограничением
        window.gauges.oilPressure = Math.max(0, Math.min(3.0, window.gauges.oilPressure + delta));

        // Обновляем отображение
        const oilEl = document.getElementById('oil-pressure');
        if (oilEl) {
            oilEl.textContent = window.gauges.oilPressure.toFixed(2);
        }
    }
};

// ========================================================================================================================
// === ОБНОВЛЕНИЕ ПОКАЗАНИЙ ПРИБОРОВ ===
function updateGauges() {
    const isFuelPumpRunning = window.fuelPumpMotor?.isActive || false;

    // Обновляем давление топлива
    if (isFuelPumpRunning) {
        window.gauges.fuelPressure = Math.min(5.4, window.gauges.fuelPressure + 0.3);
    } else {
        window.gauges.fuelPressure = Math.max(0, window.gauges.fuelPressure - 0.1);
    }

    // Управление давлением масла — через контроллер
    oilPressureController.apply();
}

// ========================================================================================================================
// === КОНТРОЛЛЕР ДАВЛЕНИЯ ТОПЛИВА — С ПЛАВАНИЕМ И СКАЧКАМИ ===
const fuelPressureController = {
    baseValue: 0,                  // основное давление (плавно растёт)
    targetFluctuation: 0,          // целевое отклонение
    lastFluctuationTime: 0,        // время последнего изменения отклонения
    fluctuationInterval: 500,      // каждые 500 мс
    isInitialized: false
};

// === ИНИЦИАЛИЗАЦИЯ СЛУЧАЙНОГО ОТКЛОНЕНИЯ ===
function getRandomFluctuation() {
    return (Math.random() > 0.5 ? +1 : -1) * ((Math.random() * 0.07) + 0.05);
}

// === ОБНОВЛЕНИЕ ПОКАЗАНИЙ ТОПЛИВНОГО ДАВЛЕНИЯ ===
function updateFuelPressureWithFluctuation() {
    const isFuelPumpRunning = window.fuelPumpMotor?.isActive || false;

    // === 1. ПЛАВНОЕ ИЗМЕНЕНИЕ БАЗОВОГО ДАВЛЕНИЯ (при запуске насоса) ===
    if (isFuelPumpRunning) {
        fuelPressureController.baseValue = Math.min(5.4, fuelPressureController.baseValue + 0.1);
    } else {
        fuelPressureController.baseValue = Math.max(0, fuelPressureController.baseValue - 0.05);
    }

    // === 2. СБРОС ИЛИ ИНИЦИАЛИЗАЦИЯ ОТКЛОНЕНИЯ КАЖДЫЕ 500 МС ===
    const now = performance.now();

    if (!fuelPressureController.isInitialized) {
        fuelPressureController.targetFluctuation = getRandomFluctuation();
        fuelPressureController.lastFluctuationTime = now;
        fuelPressureController.isInitialized = true;
    } else if (isFuelPumpRunning && now - fuelPressureController.lastFluctuationTime >= fuelPressureController.fluctuationInterval) {
        // Полностью случайный скачок: ±[0.05, 0.12]
        fuelPressureController.targetFluctuation = getRandomFluctuation();
        fuelPressureController.lastFluctuationTime = now;
    }

    // === 3. ТЕПЕРЬ — ПОЛНЫЙ СКАЧОК ДО ЦЕЛЕВОГО ЗНАЧЕНИЯ (НЕ ПЛАВНО!) ===
    const currentValue = window.gauges.fuelPressure;
    const targetTotal = fuelPressureController.baseValue + fuelPressureController.targetFluctuation;

    // ✅ ПРЯМОЙ СКАЧОК — без шагов
    window.gauges.fuelPressure = parseFloat(targetTotal.toFixed(2));

    // Ограничение
    window.gauges.fuelPressure = Math.max(0, Math.min(5.45, window.gauges.fuelPressure));

    // === 4. ОБНОВЛЕНИЕ ОТОБРАЖЕНИЯ ===
    const fuelEl = document.getElementById('fuel-pressure');
    if (fuelEl) {
        fuelEl.textContent = window.gauges.fuelPressure.toFixed(2);
    }
}

// ========================================================================================================================
// === ТАХОМЕТР "ОБ/МИН" ===
function createTachometer() {
    const panel = document.getElementById('gauge-panel');
    if (!panel) return console.error('❌ #gauge-panel не найден');

    // Удаляем старый индикатор ДГУ (если есть)
    const oldIndicator = document.getElementById('dgu-indicator');
    if (oldIndicator) {
        oldIndicator.remove();
        const oldLabel = oldIndicator.nextElementSibling;
        if (oldLabel && oldLabel.tagName === 'DIV') oldLabel.remove();
    }

    // Создаём блок тахометра — текстовый
    const tachometer = document.createElement('div');
    tachometer.id = 'tachometer';
    tachometer.style.cssText = `
        width: 40px;
        height: 40px;
        border: 2px solid #000;
        border-radius: 8px;
        margin: 10px auto;
        background: #f8f8f8;
        text-align: center;
        font-family: 'Courier New', monospace;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    const label = document.createElement('div');
    label.textContent = 'Об/мин';
    label.style.cssText = `
        font: bold 10px Arial;
        color: #333;
        margin-top: 4px;
    `;

    const value = document.createElement('div');
    value.id = 'tachometer-value';
    value.textContent = '0';
    value.style.cssText = `
        font: bold 14px Arial;
        color: #c00;
        margin: 3px 0;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.2);
    `;

    tachometer.appendChild(label);
    tachometer.appendChild(value);
    panel.appendChild(tachometer);
}

// === АНИМАЦИЯ ТАХОМЕТРА ===
function animateTachometer() {
    let lastTime = performance.now();
    const minRPM = 0;
    const idleRPM = 240;
    const stepUp = 30;    // +30 об/мин за секунду
    const stepDown = 30;  // -30 об/мин за секунду

    // Для плавающих оборотов
    let lastFluctuationTime = performance.now();
    const fluctuationInterval = 2000; // каждые 2 секунды
    let fluctuationPhase = 0; // 0: номинал, 1: -3, 2: +4

    const animate = (currentTime) => {
        const deltaTime = (currentTime - lastTime) / 1000; // в секундах

        // Основное изменение оборотов (набор/падение)
        if (deltaTime >= 0.1) {
            const dguRunning = window.dgu?.isRunning || false;

            if (dguRunning && window.gauges.rpm < idleRPM) {
                window.gauges.rpm = Math.min(idleRPM, window.gauges.rpm + stepUp * deltaTime * 10);
            } else if (!dguRunning && window.gauges.rpm > minRPM) {
                window.gauges.rpm = Math.max(minRPM, window.gauges.rpm - stepDown * deltaTime * 10);
            }
        }

        // === КОЛЕБАНИЯ ОБОРОТОВ КАЖДЫЕ 2 СЕКУНДЫ ===
        if (window.dgu?.isRunning) {
            if (currentTime - lastFluctuationTime >= fluctuationInterval) {
                if (fluctuationPhase === 0) {
                    window.gauges.rpm = idleRPM - 3; // 237
                } else if (fluctuationPhase === 1) {
                    window.gauges.rpm = idleRPM + 4; // 244
                } else {
                    window.gauges.rpm = idleRPM; // 240
                }
                fluctuationPhase = (fluctuationPhase + 1) % 3;
                lastFluctuationTime = currentTime;
            }
        }

        // Обновляем отображение
        const valueEl = document.getElementById('tachometer-value');
        if (valueEl) {
            valueEl.textContent = Math.round(window.gauges.rpm);
        }

        lastTime = currentTime;
        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
}

// ========================================================================================================================
// === ВОЛЬТМЕТР "НАПРЯЖЕНИЕ БОРТОВОЙ СЕТИ" ===
const voltageMeter = {
    value: 0,

    update(plusPoints, minusPoints) {
        const hasMainPower = plusPoints?.has('1982,871') || false;
        const hasBrnInput = (
            plusPoints?.has('1988,268') &&
            minusPoints?.has('1988,295')
        ) || false;
        const isBrnActive = window.brn?.isActive === true;

        this.value = (hasMainPower && isBrnActive && hasBrnInput) ? 75 : (hasMainPower ? 65 : 0);
    },

    draw(ctx, networks) {
        const plusPoints = networks?.plusPoints || new Set();
        const minusPoints = networks?.minusPoints || new Set();
        this.update(plusPoints, minusPoints);
    }
};

// === ДОБАВЛЕНИЕ ВОЛЬТМЕТРА НА ПАНЕЛЬ ===
function createVoltageMeter() {
    const panel = document.getElementById('gauge-panel');
    if (!panel) return console.error('❌ #gauge-panel не найден');

    const voltBox = document.createElement('div');
    voltBox.id = 'voltage-meter';
    voltBox.style.cssText = `
        width: 40px;
        height: 40px;
        border: 2px solid #000;
        border-radius: 8px;
        margin: 15px auto;
        background: #f8f8f8;
        text-align: center;
        font-family: 'Courier New', monospace;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    const label = document.createElement('div');
    label.textContent = 'Вольт';
    label.style.cssText = `
        font: bold 10px Arial;
        color: #333;
        margin-top: 2px;
    `;

    const value = document.createElement('div');
    value.id = 'voltage-value';
    value.textContent = '0';
    value.style.cssText = `
        font: bold 14px Arial;
        color: #c00;
        margin: 2px 0;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.2);
    `;

    voltBox.appendChild(label);
    voltBox.appendChild(value);
    panel.appendChild(voltBox);

    window.updateVoltageDisplay = () => {
        const el = document.getElementById('voltage-value');
        if (el) el.textContent = voltageMeter.value;
    };

    window.updateVoltageDisplay();
}

// ========================================================================================================================
// === ТЕРМОМЕТРЫ: ТЕМПЕРАТУРА ВОДЫ И МАСЛА ===
const temperatureController = {
    lastUpdateTime: performance.now(),

    update() {
        const now = performance.now();
        const deltaTime = (now - this.lastUpdateTime) / 60000; // в минутах
        this.lastUpdateTime = now;

        const isDguRunning = window.dgu?.isRunning || false;
        const delta = isDguRunning ? 1 : -1;

        window.gauges.waterTemperature = Math.max(0, Math.min(100, window.gauges.waterTemperature + delta * deltaTime));
        window.gauges.oilTemperature = Math.max(0, Math.min(100, window.gauges.oilTemperature + delta * deltaTime));

        const waterEl = document.getElementById('water-temperature');
        const oilEl = document.getElementById('oil-temperature');

        if (waterEl) waterEl.textContent = window.gauges.waterTemperature.toFixed(1);
        if (oilEl) oilEl.textContent = window.gauges.oilTemperature.toFixed(1);
    }
};

// ========================================================================================================================
// === ИНИЦИАЛИЗАЦИЯ ПРИБОРОВ ===
document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('gauge-panel');
    if (!panel) return console.error('❌ #gauge-panel не найден');

    // --- ДАВЛЕНИЕ ТОПЛИВА ---
    const fuelMeter = document.createElement('div');
    fuelMeter.id = 'fuel-pressure-meter';
    fuelMeter.style.cssText = `
        width: 40px;
        height: 40px;
        border: 2px solid #000;
        border-radius: 8px;
        margin: 10px auto;
        background: #f8f8f8;
        text-align: center;
        font-family: 'Courier New', monospace;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    const fuelLabel = document.createElement('div');
    fuelLabel.innerHTML = 'Рт<br>кгс/см²';
    fuelLabel.style.cssText = `
        font: bold 9px Arial;
        color: #333;
        margin-top: 2px;
        text-align: center;
        line-height: 1.1;
    `;

    const fuelValue = document.createElement('div');
    fuelValue.id = 'fuel-pressure';
    fuelValue.textContent = window.gauges.fuelPressure.toFixed(2);
    fuelValue.style.cssText = `
        font: bold 14px Arial;
        color: #c00;
        margin: 2px 0;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.2);
    `;

    fuelMeter.appendChild(fuelLabel);
    fuelMeter.appendChild(fuelValue);
    panel.appendChild(fuelMeter);

    // --- ДАВЛЕНИЕ МАСЛА ---
    const oilMeter = document.createElement('div');
    oilMeter.id = 'oil-pressure-meter';
    oilMeter.style.cssText = `
        width: 40px;
        height: 40px;
        border: 2px solid #000;
        border-radius: 8px;
        margin: 10px auto;
        background: #f8f8f8;
        text-align: center;
        font-family: 'Courier New', monospace;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    const oilLabel = document.createElement('div');
    oilLabel.innerHTML = 'Рм<br>кгс/см²';
    oilLabel.style.cssText = `
        font: bold 9px Arial;
                color: #333;
                margin-top: 2px;
                text-align: center;
                line-height: 1.1;
    `;

    const oilValue = document.createElement('div');
    oilValue.id = 'oil-pressure';
    oilValue.textContent = window.gauges.oilPressure.toFixed(2);
    oilValue.style.cssText = `
        font: bold 14px Arial;
        color: #c00;
        margin: 2px 0;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.2);
    `;

    oilMeter.appendChild(oilLabel);
    oilMeter.appendChild(oilValue);
    panel.appendChild(oilMeter);

    // --- ТЕРМОМЕТР ВОДЫ ---
    const waterMeter = document.createElement('div');
    waterMeter.id = 'water-temperature-meter';
    waterMeter.style.cssText = `
        width: 40px;
        height: 40px;
        border: 2px solid #000;
        border-radius: 8px;
        margin: 10px auto;
        background: #f8f8f8;
        text-align: center;
        font-family: 'Courier New', monospace;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    const waterLabel = document.createElement('div');
    waterLabel.textContent = '°C Вода';
    waterLabel.style.cssText = `
        font: bold 9px Arial;
        color: #333;
        margin-top: 2px;
    `;

    const waterValue = document.createElement('div');
    waterValue.id = 'water-temperature';
    waterValue.textContent = window.gauges.waterTemperature.toFixed(1);
    waterValue.style.cssText = `
        font: bold 14px Arial;
        color: #c00;
        margin: 2px 0;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.2);
    `;

    waterMeter.appendChild(waterLabel);
    waterMeter.appendChild(waterValue);
    panel.appendChild(waterMeter);

    // --- ТЕРМОМЕТР МАСЛА ---
    const oilTempMeter = document.createElement('div');
    oilTempMeter.id = 'oil-temperature-meter';
    oilTempMeter.style.cssText = `
        width: 40px;
        height: 40px;
        border: 2px solid #000;
        border-radius: 8px;
        margin: 10px auto;
        background: #f8f8f8;
        text-align: center;
        font-family: 'Courier New', monospace;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    const oilTempLabel = document.createElement('div');
    oilTempLabel.textContent = '°C Масло';
    oilTempLabel.style.cssText = `
        font: bold 9px Arial;
        color: #333;
        margin-top: 2px;
    `;

    const oilTempValue = document.createElement('div');
    oilTempValue.id = 'oil-temperature';
    oilTempValue.textContent = window.gauges.oilTemperature.toFixed(1);
    oilTempValue.style.cssText = `
        font: bold 14px Arial;
        color: #c00;
        margin: 2px 0;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.2);
    `;

    oilTempMeter.appendChild(oilTempLabel);
    oilTempMeter.appendChild(oilTempValue);
    panel.appendChild(oilTempMeter);

    // Создаём приборы
    createTachometer();
    createVoltageMeter();

    // Инициализация
    temperatureController.update();
    window.updateVoltageDisplay();
});

// === ДОБАВЛЕНИЕ В АНИМАЦИЮ ===
window.animatedElements.push({ animate: updateGauges });
window.animatedElements.push({ animate: updateFuelPressureWithFluctuation });
window.animatedElements.push({ animate: () => temperatureController.update() });
window.schemeElements.push(voltageMeter);

// === ПЕРЕХВАТ ОТРИСОВКИ ===
window.addEventListener('load', () => {
    const originalRedraw = window.requestRedraw;
    if (typeof originalRedraw === 'function') {
        window.requestRedraw = function() {
            originalRedraw();
            window.updateVoltageDisplay();
        };
    }
});

// === ЗАПУСК АНИМАЦИЙ ===
animateTachometer();
// ===================================================================================================================

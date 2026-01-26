// === ТОРМОЗНЫЕ МАНОМЕТРЫ + РЕСИВЕР + КОМПРЕССОР + КВТ + КМ-395 (brakes.js) ===
// Полная реализация пневматики с физически корректным поведением
// Источники:
// - Объём ресивера: 1050 л (по техдокументации ТЭМ18ДМ)
// - Производительность компрессора: 28 л/с (паспортное значение)
// - Модель: идеальный газ, изотермическое сжатие (P ∝ масса воздуха)
// - Объём ТМ: 25 л — на каждые 1 кгс/см² требуется 25 л воздуха

// === ГЛОБАЛЬНЫЕ ДАННЫЕ ТОРМОЗНОЙ СИСТЕМЫ ===
window.brakeGauges = {
    UR: 0,  // Управляющее реле — теперь дублирует ТМ
    TM: 5.0,  // Тормозная магистраль — начальное давление
    PM: 6.5,  // Питательная магистраль — отражает давление в ресивере
    TC: 0    // Тормозные цилиндры
};

// =====================================================================================================================
// === РЕСИВЕР (логический элемент) ===
// Физическая модель: ресивер объёмом 1050 л, давление зависит от массы воздуха
window.receiver = {
    volumeLiters: 1050,        // физический объём ресивера — 1050 литров (по ТД)
    airMass: 6.5 * 1050,       // начальная масса воздуха: 6.5 кгс/см² × 1050 л
    maxPressure: 9.5,          // максимальное допустимое давление
    pressure: 6.5,             // текущее давление в кгс/см²

    /**
     * Обновляет давление на основе текущей массы воздуха
     * P = m / V, где m — условная масса, V — объём
     */
    update() {
        this.pressure = this.airMass / this.volumeLiters;
        if (this.pressure > this.maxPressure) this.pressure = this.maxPressure;
        if (this.pressure < 0) this.pressure = 0;
        return this.pressure;
    },

    /**
     * Добавляет воздух в ресивер
     * @param liters - объём воздуха под давлением 1 атм (условные литры)
     */
    fill(liters) {
        this.airMass += liters;
        this.update();
    },

    /**
     * Удаляет воздух (утечка)
     * @param litersPerSecond - скорость утечки в л/с
     */
    leak(litersPerSecond) {
        this.airMass -= litersPerSecond;
        if (this.airMass < 0) this.airMass = 0;
        this.update();
    },

    /**
     * Возвращает текущее давление
     */
    getPressure() {
        return this.update();
    }
};

// =====================================================================================================================
// === РЕЛЕ ДАВЛЕНИЯ ВОЗДУХА 3РД ===
const rd3 = {
    isActive: true, // По умолчанию включён, пока PM < 9.5

    update() {
        const pm = window.receiver.pressure;

        if (!this.isActive && pm < 7.5) {
            this.isActive = true;
        } else if (this.isActive && pm >= 9.5) {
            this.isActive = false;
        }
    },

    isOn() {
        this.update();
        return this.isActive;
    }
};

// =====================================================================================================================
// === КОМПРЕССОР ===
// Паспортная производительность: 28 л/с (при 1 атм) — подаёт сжатый воздух в ресивер
const compressor = {
    name: 'compressor',
    x: 50,
    y: 50,
    width: 40,
    height: 40,
    radius: 20,
    canvas: null,
    ctx: null,
    angle: 0,
    isActive: false,
    baseFlowRate: 28, // 28 л/с — паспортное значение

    /**
     * Учитывает сопротивление: чем выше давление в ресивере,
     * тем труднее качать — снижение на 5% на каждый 1 кгс/см²
     */
    getEffectiveFlow() {
        const pm = window.receiver.pressure;
        const reductionPerKg = 0.05;
        const totalReduction = pm * reductionPerKg;
        const efficiency = Math.max(1 - totalReduction, 0.2); // Минимум 20%
        return this.baseFlowRate * efficiency;
    },

    update() {
        const dguRunning = window.dgu?.isRunning || false;
        const rd3Active = window.rd3?.isOn() || false;

        this.isActive = dguRunning && rd3Active;

        if (this.isActive) {
            const dt = 16 / 1000; // ~60 FPS
            const effectiveFlow = this.getEffectiveFlow();
            const airToAdd = effectiveFlow * dt; // литров за кадр
            window.receiver.fill(airToAdd);
        }
    },

    animate() {
        if (this.isActive) {
            this.angle += 0.1;
        }
        this.draw();
    },

    draw() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const cx = this.x + this.radius;
        const cy = this.y + this.radius;

        ctx.clearRect(0, 0, 130, 150);

        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#333';
        ctx.fillText('Компрессор', cx, 30);

                // === Отрисовка прямоугольника (рама/корпус) ===
                const rectWidth = 80;
                const rectHeight = 20;
                const rectX = cx - rectWidth / 2; // слева от круга
                const rectY = cy - rectHeight / 2;

                ctx.beginPath();
                ctx.rect(rectX, rectY, rectWidth, rectHeight);
                ctx.fillStyle = '#f0f0f0'; // светлый серый цвет
                ctx.fill();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1.5;
                ctx.stroke();



        ctx.beginPath();
        ctx.arc(cx, cy, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f0f0f0'; // заполнение — непрозрачный светлый фон
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(this.angle);

        ctx.beginPath();
        ctx.moveTo(0, -this.radius * 0.6);
        ctx.lineTo(0, this.radius * 0.6);
        ctx.moveTo(-this.radius * 0.6, 0);
        ctx.lineTo(this.radius * 0.6, 0);
        ctx.strokeStyle = this.isActive ? '#c00' : '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    },

    init() {
        const panel = document.getElementById('control-panel');
        if (!panel) return;

        let canvas = panel.querySelector('canvas#compressor-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'compressor-canvas';
            canvas.width = 130;
            canvas.height = 150;
            canvas.style.display = 'block';
            canvas.style.margin = '0 auto';
            panel.appendChild(canvas);
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.draw();
    }
};

// =====================================================================================================================
// === ПАССИВНЫЕ УТЕЧКИ В ПМ И ТМ ===
function updatePmLeakage() {
    const dt = 16 / 1000;
    const leakRateLitersPerSecond = 1.5; // Условная утечка: 1.5 л/с
    window.receiver.leak(leakRateLitersPerSecond * dt);
}

function updateTmLeakage() {
    const dt = 16 / 1000;
    const leakRate = 0.01; // 0.01 кгс/см²/с
    window.brakeGauges.TM -= leakRate * dt;
    if (window.brakeGauges.TM < 0) window.brakeGauges.TM = 0;
}

// =====================================================================================================================
// === ОБНОВЛЕНИЕ ДАВЛЕНИЯ ПМ ===
function updateBrakePressures() {
    window.brakeGauges.PM = window.receiver.getPressure();
}

// =====================================================================================================================
// === СОЗДАНИЕ КРУГЛЫХ МАНОМЕТРОВ ===
function createBrakeGauges() {
    const panel = document.getElementById('gauge-panel');
    if (!panel) return;

    const gauges = [
        { id: 'ur-gauge', label: 'УР', value: window.brakeGauges.UR },
        { id: 'tm-gauge', label: 'ТМ', value: window.brakeGauges.TM },
        { id: 'pm-gauge', label: 'ПМ', value: window.brakeGauges.PM },
        { id: 'tc-gauge', label: 'ТЦ', value: window.brakeGauges.TC }
    ];

    gauges.forEach(g => {
        const container = document.createElement('div');
        container.id = g.id;
        container.style.cssText = `
            width: 40px;
            height: 40px;
            border: 2px solid #000;
            border-radius: 50%;
            margin: 15px auto;
            background: #f0f0f0;
            text-align: center;
            font-family: Arial, sans-serif;
            position: relative;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        const label = document.createElement('div');
        label.textContent = g.label;
        label.style.cssText = `
            font: bold 12px Arial;
            color: #333;
            margin-top: 0px;
        `;

        const value = document.createElement('div');
        value.id = `${g.id}-value`;
        value.textContent = g.value.toFixed(1);
        value.style.cssText = `
            font: bold 12px Arial;
            color: #c00;
            margin: 2px 0;
        `;

        const unit = document.createElement('div');
        unit.textContent = 'кгс/см²';
        unit.style.cssText = `
            font: 7px Arial;
            color: #555;
        `;

        container.appendChild(label);
        container.appendChild(value);
        container.appendChild(unit);
        panel.appendChild(container);
    });
}

// === ОБНОВЛЕНИЕ ПОКАЗАНИЙ МАНОМЕТРОВ ===
function updateGaugeDisplays() {
    // УР теперь дублирует ТМ
    window.brakeGauges.UR = window.brakeGauges.TM;

    const urValue = document.getElementById('ur-gauge-value');
    const tmValue = document.getElementById('tm-gauge-value');
    const pmValue = document.getElementById('pm-gauge-value');
    const tcValue = document.getElementById('tc-gauge-value');

    if (urValue) urValue.textContent = (window.brakeGauges.UR || 0).toFixed(1);
    if (tmValue) tmValue.textContent = (window.brakeGauges.TM || 0).toFixed(1);
    if (pmValue) pmValue.textContent = (window.brakeGauges.PM || 0).toFixed(1);
    if (tcValue) tcValue.textContent = (window.brakeGauges.TC || 0).toFixed(1);
}

// =====================================================================================================================
// === КРАН ВСПОМОГАТЕЛЬНОГО ТОРМОЗА (КВТ) ===
const brakeAuxValve = {
    name: 'brakeAuxValve',
    x: 75,
    y: 50,
    radius: 12.5,
    pinRadius: 2.5,
    handLength: 40,
    dotRadius: 1.5,
    numDots: 6,
    startAngle: 360,
    endAngle: 180,
    currentDot: 1, // Поездное (по умолчанию)
    canvas: null,
    ctx: null,
    dotPositions: [],
    wasElevatedByKVT: false,

    init() {
        const panel = document.getElementById('control-panel');
        if (!panel) return;

        let canvas = panel.querySelector('canvas#brake-aux-valve-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'brake-aux-valve-canvas';
            canvas.width = 200;
            canvas.height = 100;
            canvas.style.display = 'block';
            canvas.style.margin = '10px auto';
            panel.appendChild(canvas);
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.calculateDotPositions();
        this.draw();
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    },

    calculateDotPositions() {
        this.dotPositions = [];
        const stepDegrees = (this.endAngle - this.startAngle) / (this.numDots - 1);

        for (let i = 0; i < this.numDots; i++) {
            const angleDegrees = this.startAngle + i * stepDegrees;
            const angleRad = (angleDegrees - 90) * Math.PI / 180;
            const distanceFromCenter = this.radius + 10 + this.handLength / 2;
            const x = this.x + Math.cos(angleRad) * distanceFromCenter;
            const y = this.y + Math.sin(angleRad) * distanceFromCenter;
            this.dotPositions.push({ x, y, angleRad, angleDegrees });
        }
    },

    draw() {
        if (!this.ctx) return;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, 200, 100);

        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#333';
        ctx.fillText('КВТ', this.x, this.y - 40);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f0f0f0';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.pinRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
        ctx.fill();

        this.dotPositions.forEach((dot, i) => {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, this.dotRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#555';
            ctx.fill();

            if (i === this.currentDot) {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, 4, 0, Math.PI * 2);
                ctx.strokeStyle = '#c00';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        });

        const target = this.dotPositions[this.currentDot];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / len;
        const uy = dy / len;
        const endX = this.x + ux * this.handLength;
        const endY = this.y + uy * this.handLength;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#c00';
        ctx.lineWidth = 2;
        ctx.stroke();
    },

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        for (let i = 0; i < this.dotPositions.length; i++) {
            const dot = this.dotPositions[i];
            const dist = Math.sqrt((clickX - dot.x) ** 2 + (clickY - dot.y) ** 2);
            if (dist <= 10) {
                this.currentDot = i;
                this.onPositionChange(i);
                this.draw();
                return;
            }
        }
    },

    safeValue(val, fallback) {
        return (typeof val === 'number' && !isNaN(val)) ? val : fallback;
    },

    onPositionChange(pos) {
        const pm = this.safeValue(window.brakeGauges.PM, 0);
        const tc = this.safeValue(window.brakeGauges.TC, 0);

        switch (pos) {
            case 0: // Отпуск
                window.brakeGauges.TC = 0;
                this.wasElevatedByKVT = false;
                break;

            case 1: // Поездное
                if (this.wasElevatedByKVT) {
                    window.brakeGauges.TC = 0;
                    this.wasElevatedByKVT = false;
                }
                break;

            case 2: // Тормозное 1 → ТЦ = 1.0
            case 3: // Тормозное 2 → ТЦ = 2.0
            case 4: // Тормозное 3 → ТЦ = 3.0
            case 5: // Тормозное 4 → ТЦ = 4.0
                const target = pos - 1;
                if (target > tc) {
                    // Повышение
                    const requiredLiters = (target - tc) * 60;
                    if (window.receiver.airMass >= requiredLiters) {
                        window.receiver.airMass -= requiredLiters;
                        window.receiver.update();
                        window.brakeGauges.TC = target;
                        this.wasElevatedByKVT = true;
                    } else {
                        const maxTc = tc + (window.receiver.airMass / 60);
                        window.brakeGauges.TC = Math.min(target, maxTc);
                        window.receiver.airMass = 0;
                        window.receiver.update();
                        this.wasElevatedByKVT = true;
                    }
                } else if (target < tc && this.wasElevatedByKVT) {
                    // Снижение — только если TC был установлен КВТ
                    window.brakeGauges.TC = target;
                }
                break;
        }
    }
};

// =====================================================================================================================
// === КРАН МАШИНИСТА (КМ-395) ===
const brakeMasterValve = {
    name: 'brakeMasterValve',
    x: 75,
    y: 60,
    radius: 12.5,
    pinRadius: 2.5,
    handLength: 40,
    labelRadius: 30,
    numPositions: 6,
    startAngle: 360,
    endAngle: 180,
    currentPosition: 1,
    canvas: null,
    ctx: null,
    positions: [],
    labels: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    chargePressure: 5.0, // Целевое давление ТОЛЬКО для положения II (поездное)
    holdPressure: 0,

    init() {
        const panel = document.getElementById('control-panel');
        if (!panel) return;

        let canvas = panel.querySelector('canvas#brake-master-valve-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'brake-master-valve-canvas';
            canvas.width = 200;
            canvas.height = 150;
            canvas.style.display = 'block';
            canvas.style.margin = '20px auto';
            canvas.style.border = '1px solid #ccc';
            panel.appendChild(canvas);
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.calculatePositions();
        this.draw();
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        console.log('✅ КМ-395: инициализирован');
    },

    calculatePositions() {
        this.positions = [];
        const stepDegrees = (this.endAngle - this.startAngle) / (this.numPositions - 1);

        for (let i = 0; i < this.numPositions; i++) {
            const angleDegrees = this.startAngle + i * stepDegrees;
            const angleRad = (angleDegrees - 90) * Math.PI / 180;
            const distanceFromCenter = this.radius + 10 + this.handLength / 2;
            const x = this.x + Math.cos(angleRad) * distanceFromCenter;
            const y = this.y + Math.sin(angleRad) * distanceFromCenter;
            const labelX = this.x + Math.cos(angleRad) * this.labelRadius;
            const labelY = this.y + Math.sin(angleRad) * this.labelRadius;
            this.positions.push({ x, y, labelX, labelY, angleRad, angleDegrees });
        }
    },

    draw() {
        if (!this.ctx) return;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, 200, 150);

        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#333';
        ctx.fillText('КМ-395', this.x, this.y - 40);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f0f0f0';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.pinRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
        ctx.fill();

        this.positions.forEach((pos, i) => {
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#000';
            ctx.fillText(this.labels[i], pos.labelX, pos.labelY);

            // 🔴 Рисуем кликабельные точки (радиус 2 пикселя)
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#000';
            ctx.fill();

            if (i === this.currentPosition) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
                ctx.strokeStyle = '#c00';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        });

        const target = this.positions[this.currentPosition];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / len;
        const uy = dy / len;
        const endX = this.x + ux * this.handLength;
        const endY = this.y + uy * this.handLength;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#c00';
        ctx.lineWidth = 2;
        ctx.stroke();
    },

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        for (let i = 0; i < this.positions.length; i++) {
            const pos = this.positions[i];
            const dist = Math.sqrt((clickX - pos.x) ** 2 + (clickY - pos.y) ** 2);
            if (dist <= 10) {
                this.currentPosition = i;
                this.onPositionChange(i);
                this.draw();
                return;
            }
        }
    },

    animate() {
        const dt = 16 / 1000;
        const tm = window.brakeGauges.TM;

        // === II — Поездное (1) ===
        if (this.currentPosition === 1) {
            // Поддержание давления 5.0 кгс/см² — ЕДИНСТВЕННОЕ целевое давление
            if (tm < this.chargePressure) {
                const flowRate = 0.05 * dt;
                window.brakeGauges.TM += flowRate;
                if (window.brakeGauges.TM > this.chargePressure) {
                    window.brakeGauges.TM = this.chargePressure;
                }
            } else if (tm > this.chargePressure) {
                window.brakeGauges.TM -= 0.002 * dt;
                if (window.brakeGauges.TM < this.chargePressure) {
                    window.brakeGauges.TM = this.chargePressure;
                }
            }
        }

        // === V — Тормозное (4) ===
        else if (this.currentPosition === 4) {
            // Снижение на 0.2 кгс/см² в секунду
            window.brakeGauges.TM -= 0.2 * dt;
            if (window.brakeGauges.TM < 0) window.brakeGauges.TM = 0;
        }

        // === VI — Экстренное (5) ===
        else if (this.currentPosition === 5) {
            // Снижение на 1.0 кгс/см² в секунду
            window.brakeGauges.TM -= 1.0 * dt;
            if (window.brakeGauges.TM < 0) window.brakeGauges.TM = 0;
        }

        // Остальные позиции (I, III, IV) — обрабатываются в updateTmPressure()
    },

    onPositionChange(pos) {
        const tm = window.brakeGauges.TM;

        switch (pos) {
            case 1: // II — Поездное
                console.log('🔧 КМ-395: положение II — поездное (целевое 5.0 кгс/см²)');
                break;
            case 3: // IV — Перекрыша с питанием
                this.holdPressure = tm;
                break;
        }
    }
};

// =====================================================================================================================
// === ОБНОВЛЕНИЕ ДАВЛЕНИЯ В ТМ (для всех режимов) ===
function updateTmPressure() {
    const dt = 16 / 1000;
    const valve = brakeMasterValve;
    const tm = window.brakeGauges.TM;
    const pm = window.brakeGauges.PM;

    switch (valve.currentPosition) {
        case 0: // I — Зарядка и отпуск: широкий канал между ПМ и ТМ
            if (pm > tm) {
                const pressureRiseRate = 0.4; // 0.4 кгс/см² в секунду
                const deltaP = Math.min(pressureRiseRate * dt, pm - tm);

                // ТМ имеет объём 25 литров → для повышения давления на ΔP требуется: ΔP × 25
                const airNeeded = deltaP * 25;

                // Проверяем, достаточно ли воздуха в ресивере
                if (window.receiver.airMass >= airNeeded) {
                    window.receiver.airMass -= airNeeded; // расходуем воздух из ресивера
                    window.receiver.update(); // обновляем давление в ПМ
                    window.brakeGauges.TM += deltaP; // повышаем давление в ТМ
                } else {
                    // Если воздуха не хватает — повышаем пропорционально
                    const maxDeltaP = window.receiver.airMass / 25;
                    window.brakeGauges.TM += maxDeltaP;
                    window.receiver.airMass = 0;
                    window.receiver.update();
                }
            }
            break;

        case 3: // IV — Перекрыша с питанием
            if (tm < valve.holdPressure) {
                const flowRate = 5 * dt;
                const transfer = Math.min(flowRate, (valve.holdPressure - tm) * 1050);
                if (window.receiver.airMass >= transfer) {
                    window.receiver.airMass -= transfer;
                    window.receiver.update();
                    window.brakeGauges.TM += transfer / 1050;
                }
            }
            break;
    }
}

// =====================================================================================================================

// =====================================================================================================================
// === КОНТРОЛЛЕР МАШИНИСТА (КМ) — аналогично КМ-395 и КВТ ===
const masterController = {
    name: 'masterController',
    x: 60,
    y: 80,
    width: 100,
    height: 30,
    positions: [],
    selected: 0,
    indicatorHeight: 40,
    canvas: null,
    ctx: null,
    dotRadius: 4,

    // Координаты 9 точек (0–8)
    init() {
        const panel = document.getElementById('control-panel');
        if (!panel) return;

        let canvas = panel.querySelector('canvas#master-controller-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'master-controller-canvas';
            canvas.width = 200;
            canvas.height = 130;
            canvas.style.display = 'block';
            canvas.style.margin = '20px auto';
            panel.appendChild(canvas);
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.calculatePositions();
        this.draw();
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    },

    calculatePositions() {
        this.positions = [];
        const step = this.width / 8;
        for (let i = 0; i < 9; i++) {
            const x = this.x - this.width / 2 + step * i;
            const y = this.y - this.height - 15; // над прямоугольником
            this.positions.push({ x, y, index: i });
        }
    },

    draw() {
        if (!this.ctx) return;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, 200, 130);

        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#333';
        ctx.fillText('Контр.Машиниста', this.x, this.y - 65);

        // === Отрисовка корпуса (прямоугольник 100×30) ===
        ctx.fillStyle = '#f0f0f0';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        // === Отрисовка 9 точек ===
        this.positions.forEach((pos) => {
            const isSelected = pos.index === this.selected;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, isSelected ? 6 : 4, 0, Math.PI * 2);
            ctx.fillStyle = isSelected ? '#c00' : '#000';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = isSelected ? 2 : 1;
            ctx.stroke();
        });

        // === Отрисовка вертикального указателя ===
        const targetX = this.positions[this.selected].x;
        const topY = this.positions[this.selected].y - this.indicatorHeight / 2;
        const bottomY = this.y - this.height / 2;

        ctx.beginPath();
        ctx.moveTo(targetX, topY);
        ctx.lineTo(targetX, bottomY);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Метка-стрелка вниз
        ctx.beginPath();
        ctx.moveTo(targetX - 5, bottomY);
        ctx.lineTo(targetX + 5, bottomY);
        ctx.lineTo(targetX, bottomY + 8);
        ctx.closePath();
        ctx.fillStyle = '#c00';
        ctx.fill();
    },

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        for (let i = 0; i < this.positions.length; i++) {
            const pos = this.positions[i];
            const dx = clickX - pos.x;
            const dy = clickY - pos.y;
            if (dx * dx + dy * dy <= 36) { // радиус ~6 пикселей
                this.selected = pos.index;
                this.onPositionChange();
                this.draw();
                return;
            }
        }
    },

    onPositionChange() {
        // Можно добавить логику при смене позиции
        console.log('🔧 Контроллер машиниста: позиция', this.selected);
    },

getPropagationRules(plusPoints) {
    const rules = [];

    // Позиция "0" — передача питания на 237,1076
    if (this.selected === 0) {
        const hasInput = plusPoints.has('251,812');
        if (hasInput) {
            rules.push({
                from: '251,812',
                to: '237,1076',
                type: 'plus'
            });
        }
    }

    // Позиция "1" — передача питания на 236,900
    if (this.selected === 1) {
        const hasInput = plusPoints.has('251,812');
        if (hasInput) {
            rules.push({
                from: '251,812',
                to: '236,900',
                type: 'plus'
            });
        }
    }

    // Позиция "2" — передача питания на 236,900 и 236,922
    if (this.selected === 2) {
        const hasInput = plusPoints.has('251,812');
        if (hasInput) {
            rules.push({
                from: '251,812',
                to: '236,900',
                type: 'plus'
            });
            rules.push({
                from: '251,812',
                to: '236,922',
                type: 'plus'
            });
        }
    }

    // Позиция "3" — передача питания на 236,900, 236,922, 236,944
    if (this.selected === 3) {
        const hasInput = plusPoints.has('251,812');
        if (hasInput) {
            rules.push({
                from: '251,812',
                to: '236,900',
                type: 'plus'
            });
            rules.push({
                from: '251,812',
                to: '236,922',
                type: 'plus'
            });
            rules.push({
                from: '251,812',
                to: '236,944',
                type: 'plus'
            });
        }
    }

    // Позиция "4" — передача питания на 236,900, 236,922, 236,944, 236,967
    if (this.selected === 4) {
        const hasInput = plusPoints.has('251,812');
        if (hasInput) {
            rules.push({
                from: '251,812',
                to: '236,900',
                type: 'plus'
            });
            rules.push({
                from: '251,812',
                to: '236,922',
                type: 'plus'
            });
            rules.push({
                from: '251,812',
                to: '236,944',
                type: 'plus'
            });
            rules.push({
                from: '251,812',
                to: '236,967',
                type: 'plus'
            });
        }
    }

    // Позиция "5" — передача питания на 236,900, 236,922, 236,988, 236,1011
    if (this.selected === 5) {
        const hasInput = plusPoints.has('251,812');
        if (hasInput) {
            rules.push({
                from: '251,812',
                to: '236,900',
                type: 'plus'
            });
            rules.push({
                from: '251,812',
                to: '236,922',
                type: 'plus'
            });
            rules.push({
                from: '251,812',
                to: '236,988',
                type: 'plus'
            });
            rules.push({
                from: '251,812',
                to: '236,1011',
                type: 'plus'
            });
        }
    }

    // Позиция "6" — передача питания на 236,900, 236,922, 236,944, 236,1011
    if (this.selected === 6) {
        const hasInput = plusPoints.has('251,812');
        if (hasInput) {
            rules.push({
                from: '251,812',
                to: '236,900',
                type: 'plus'
            });
            rules.push({
                from: '251,812',
                to: '236,922',
                type: 'plus'
            });
            rules.push({
                from: '251,812',
                to: '236,944',
                type: 'plus'
            });
            rules.push({
                from: '251,812',
                to: '236,1011',
                type: 'plus'
            });
        }
    }

    // Позиция "7" — передача питания на 236,900, 236,922, 236,988, 236,1011
    if (this.selected === 7) {
        const hasInput = plusPoints.has('251,812');
        if (hasInput) {
            rules.push({
                from: '251,812',
                to: '236,900',
                type: 'plus'
            });
            rules.push({
                from: '251,812',
                to: '236,922',
                type: 'plus'
            });
            rules.push({
                from: '251,812',
                to: '236,988',
                type: 'plus'
            });
            rules.push({
                from: '251,812',
                to: '236,1011',
                type: 'plus'
            });
        }
    }

    // Позиция "8" — передача питания на все точки: 900, 922, 944, 967, 988, 1011
    if (this.selected === 8) {
        const hasInput = plusPoints.has('251,812');
        if (hasInput) {
            const outputs = ['236,900', '236,922', '236,944', '236,967', '236,988', '236,1011'];
            outputs.forEach(output => {
                rules.push({
                    from: '251,812',
                    to: output,
                    type: 'plus'
                });
            });
        }
    }

    return rules;
}
};

// =====================================================================================================================
// === ВИЗУАЛИЗАЦИЯ КОНТРОЛЛЕРА МАШИНИСТА НА СХЕМЕ ===
// Добавляем в конец файла, после объявления masterController
const masterControllerVisual = {
    positions: [
        { x: 104 }, // 0
        { x: 98 },  // 1
        { x: 92 },  // 2
        { x: 86 },  // 3
        { x: 80 },  // 4
        { x: 74 },  // 5
        { x: 68 },  // 6
        { x: 62 },  // 7
        { x: 56 }   // 8
    ],
    startY: 807,
    endY: 1097,

    draw(ctx) {
        if (!ctx || !window.masterController) return;

        const selected = window.masterController.selected;
        const pos = this.positions[selected];
        if (!pos) return;

        ctx.beginPath();
        ctx.moveTo(pos.x, this.startY);
        ctx.lineTo(pos.x, this.endY);
        ctx.strokeStyle = '#c00';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
};

window.schemeElements.push(masterControllerVisual);
window.animatedElements.push(masterControllerVisual);
// =====================================================================================================================
// === ИНИЦИАЛИЗАЦИЯ DOMContentLoaded ===
document.addEventListener('DOMContentLoaded', () => {
    if (!window.brakeGauges) {
        window.brakeGauges = { UR: 0, TM: 0, PM: 0, TC: 0 };
    }

    window.brakeGauges.PM = 6.5;
    window.brakeGauges.TC = 0;
    window.brakeGauges.TM = 5.0;

    createBrakeGauges();
    compressor.init();
    brakeAuxValve.init();
    brakeMasterValve.init();
    masterController.init(); // ✅ Вызов инициализации

    console.log('🔧 Порядок инициализации: Компрессор → КВТ → КМ-395 → КМ');

    window.schemeElements = window.schemeElements || [];
    window.animatedElements = window.animatedElements || [];

    window.schemeElements.push(compressor);
    window.schemeElements.push(brakeAuxValve);
    window.schemeElements.push(brakeMasterValve);
    window.schemeElements.push(masterController);
    window.schemeElements.push(masterControllerVisual); // ✅ Добавляем в инициализации

    window.animatedElements.push(compressor);
    window.animatedElements.push(brakeAuxValve);
    window.animatedElements.push(brakeMasterValve);
    window.animatedElements.push(masterController);
    window.animatedElements.push(masterControllerVisual); // ✅ Анимируем
    window.animatedElements.push(rd3);
    window.animatedElements.push({ animate: updateBrakePressures });
    window.animatedElements.push({ animate: updateGaugeDisplays });
    window.animatedElements.push({ animate: updatePmLeakage });
    window.animatedElements.push({ animate: updateTmLeakage });
    window.animatedElements.push({ animate: updateTmPressure });
    window.animatedElements.push({ animate: () => brakeMasterValve.animate() });

    window.rd3 = rd3;
    window.compressor = compressor;
    window.brakeAuxValve = brakeAuxValve;
    window.brakeMasterValve = brakeMasterValve;
    window.masterController = masterController; // ✅ Экспорт для доступа
});
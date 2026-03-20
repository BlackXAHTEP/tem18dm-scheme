// === УПРАВЛЕНИЕ ДВИГАТЕЛЯМИ И УСТАНОВКАМИ ===

// === ТОПЛИВНЫЙ НАСОС (электродвигатель) ===
const fuelPumpMotor = {
    x: 669,
    y: 76,
    width: 81,
    height: 21,
    inX: 669,
    inY: 98,
    outX: 750,
    outY: 98,
    rotation: 0,
    animActive: false,
    isActive: false,

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.inX},${this.inY}`);
        const hasMinus = minusPoints.has(`${this.outX},${this.outY}`);
        this.isActive = hasPlus && hasMinus;
    },

    setPower(isPowered) {
        if (isPowered && !this.animActive) {
            this.animActive = true;
            animatedElements.push(this);
            startGlobalAnimation();
        } else if (!isPowered && this.animActive) {
            this.animActive = false;
            const index = animatedElements.indexOf(this);
            if (index !== -1) {
                animatedElements.splice(index, 1);
            }
        }
    },

    animate() {
        if (this.isActive) {
            this.rotation += 0.15;
        }
    },

    getPropagationRules() {
        return [];
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);
        this.setPower(this.isActive);

        if (!this.isActive) return;

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radius = Math.min(this.width, this.height) / 2;

        // Фон
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Окружность
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Вращающийся крестик
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.6);
        ctx.lineTo(0, radius * 0.6);
        ctx.moveTo(-radius * 0.6, 0);
        ctx.lineTo(radius * 0.6, 0);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Подпись
        ctx.fillStyle = '#c00';
        ctx.font = '15px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Топливный насос', centerX, centerY - 30);
    }
};

window.fuelPumpMotor = fuelPumpMotor;
window.schemeElements.push(fuelPumpMotor);

// ========================================================================================================================
// === МАСЛЯНЫЙ НАСОС (электродвигатель) ===
const OilPumpMotor = {
    x: 498,
    y: 55,
    width: 81,
    height: 21,
    inX: 498,
    inY: 55,
    outX: 579,
    outY: 55,
    rotation: 0,
    animActive: false,
    isActive: false,

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.inX},${this.inY}`);
        const hasMinus = minusPoints.has(`${this.outX},${this.outY}`);
        this.isActive = hasPlus && hasMinus;
    },

    setPower(isPowered) {
        if (isPowered && !this.animActive) {
            this.animActive = true;
            animatedElements.push(this);
            startGlobalAnimation();
        } else if (!isPowered && this.animActive) {
            this.animActive = false;
            const index = animatedElements.indexOf(this);
            if (index !== -1) {
                animatedElements.splice(index, 1);
            }
        }
    },

    animate() {
        if (this.isActive) {
            this.rotation += 0.15;
        }
    },

    getPropagationRules() {
        return [];
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);
        this.setPower(this.isActive);

        if (!this.isActive) return;

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radius = Math.min(this.width, this.height) / 2;

        // Фон
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Окружность
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Вращающийся крестик
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.6);
        ctx.lineTo(0, radius * 0.6);
        ctx.moveTo(-radius * 0.6, 0);
        ctx.lineTo(radius * 0.6, 0);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Подпись
        ctx.fillStyle = '#c00';
        ctx.font = '15px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Масляный насос', centerX, centerY - 30);
    }
};

window.OilPumpMotor = OilPumpMotor;
window.schemeElements.push(OilPumpMotor);

// ========================================================================================================================
// === ДИЗЕЛЬ-ГЕНЕРАТОРНАЯ УСТАНОВКА (ДГУ) ===
const dgu = {
    name: 'dgu',
    x: 2318,
    y: 506,
    width: 35,
    height: 72,
    inX: 2340,
    inY: 506,
    outX: 2340,
    outY: 585,
    controlX: 2631,
    controlY: 2024,

    rotation: 0,
    isRunning: false,
    wasStartedByPower: false,

    // Таймер для задержки остановки
    holdBreakTimer: null,
    holdBreakDelay: 1000, // 1 секунда

    update(plusPoints, minusPoints) {
        // Проверка питания для запуска
        const hasPlus = plusPoints.has(`${this.inX},${this.inY}`);
        const hasMinus = minusPoints.has(`${this.outX},${this.outY}`);
        const hasPower = hasPlus && hasMinus;

        // Проверка давления топлива — обязательно для удержания
        const fuelPressure = window.gauges.fuelPressure;
        const fuelOk = fuelPressure >= 0.7;

        // Проверка сигнала удержания
        const hasControl = plusPoints.has(`${this.controlX},${this.controlY}`);

        // Условия
        const shouldStart = hasPower;
        const shouldContinue = fuelOk && hasControl;

        // === ЛОГИКА С ЗАДЕРЖКОЙ ===
        if (shouldStart && !this.isRunning) {
            // Запуск по питанию
            this.isRunning = true;
            this.wasStartedByPower = true;
            requestRedraw();

            // Сбрасываем таймер, если был
            if (this.holdBreakTimer) {
                clearTimeout(this.holdBreakTimer);
                this.holdBreakTimer = null;
            }
        } else if (this.isRunning && this.wasStartedByPower) {
            if (shouldContinue) {
                // Условия удержания соблюдены — всё ок
                if (this.holdBreakTimer) {
                    clearTimeout(this.holdBreakTimer);
                    this.holdBreakTimer = null;
                }
            } else {
                // Условия удержания нарушены — запускаем таймер
                if (!this.holdBreakTimer) {
                    this.holdBreakTimer = setTimeout(() => {
                        this.isRunning = false;
                        this.wasStartedByPower = false;
                        requestRedraw();
                    }, this.holdBreakDelay);
                }
            }
        }

        // Если питание вернулось до истечения таймера — сбрасываем
        if (this.holdBreakTimer && shouldContinue) {
            clearTimeout(this.holdBreakTimer);
            this.holdBreakTimer = null;
        }
    },

    animate() {
        if (this.isRunning) {
            this.rotation += 0.1;
        }
    },

    getPropagationRules(plusPoints, minusPoints) {
        const rules = [];

        // Если на обмотке генератора есть + и – (возбуждение), и ДГУ работает
        const hasGenPlus = plusPoints.has('2219,564');
        const hasGenMinus = minusPoints.has('2218,625');

        if (this.isRunning && hasGenPlus && hasGenMinus) {
            // ДГУ начинает вырабатывать напряжение
            rules.push({
                from: '2219,564', // можно оставить как источник
                to: `${this.inX},${this.inY}`,
                type: 'plus'
            });
            rules.push({
                from: '2218,625',
                to: `${this.outX},${this.outY}`,
                type: 'minus'
            });
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        if (!this.isRunning) return;

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radius = Math.min(this.width, this.height) / 2;

        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.7);
        ctx.lineTo(0, radius * 0.7);
        ctx.moveTo(-radius * 0.7, 0);
        ctx.lineTo(radius * 0.7, 0);
        ctx.strokeStyle = '#c00';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#c00';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ДГУ', centerX + 35, centerY);
    }
};

window.dgu = dgu;
window.schemeElements.push(dgu);
window.animatedElements.push(dgu);
// ========================================================================================================================
// === ЭЛЕМЕНТ ВСТ — ВОЗБУДИТЕЛЬ ГЕНЕРАТОРА ===
const vst = {
    x: 1800,
    y: 268,
    diameter: 50,
    radius: 25,
    centerX: 1815,
    centerY: 281.5, // середина между 268 и 295

    inX: 1800,
    inY: 268,
    outX: 1800,
    outY: 295,

    armatureInX: 1831,
    armatureInY: 268,
    armatureOutX: 1831,
    armatureOutY: 295,

    rotation: 0,
    isActive: false,

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.inX},${this.inY}`);
        const hasMinus = minusPoints.has(`${this.outX},${this.outY}`);
        const dguRunning = window.dgu?.isRunning || false;

        this.isActive = dguRunning && hasPlus && hasMinus;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update(plusPoints, minusPoints);

        const rules = [];

        // Если ВСТ активен (ДГУ работает + питается), то передаём + и - на якорь
        if (this.isActive) {
            rules.push({
                from: `${this.inX},${this.inY}`,
                to: `${this.armatureInX},${this.armatureInY}`,
                type: 'plus'
            });
            rules.push({
                from: `${this.outX},${this.outY}`,
                to: `${this.armatureOutX},${this.armatureOutY}`,
                type: 'minus'
            });
        }

        return rules;
    },

    animate() {
        if (window.dgu?.isRunning) {
            this.rotation += 0.12;
        }
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        const centerX = this.centerX;
        const centerY = this.centerY;
        const radius = this.radius;

        // Фон — светло-серый круг
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#e0e0e0';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Крестик
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);

        // Цвет крестика: красный, если ВСТ активен, иначе чёрный
        const color = this.isActive ? '#c00' : '#000';

        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.5);
        ctx.lineTo(0, radius * 0.5);
        ctx.moveTo(-radius * 0.5, 0);
        ctx.lineTo(radius * 0.5, 0);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Подпись
        ctx.fillStyle = '#c00';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ВСТ', centerX, centerY - 40);
    }
};

window.schemeElements.push(vst);
window.animatedElements.push(vst);
window.vst = vst;

// ========================================================================================================================
// === ЭЛЕМЕНТ БРН — БЛОК РЕГУЛИРОВКИ НАПРЯЖЕНИЯ ===
const brn = {
    // Границы прямоугольника
    x1: 1478, y1: 276,  // лево-низ
    x2: 1551, y2: 211,  // право-верх
    width: 73,
    height: 65,

    // Координаты входа и выхода
    inX: 1522,
    inY: 276,
    outX: 1506,
    outY: 275,

    // Состояние
    isActive: false,
    time: 0,

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.inX},${this.inY}`);
        const hasMinus = minusPoints.has(`${this.outX},${this.outY}`);

        this.isActive = hasPlus && hasMinus;
    },

    getPropagationRules(plusPoints, minusPoints) {
        // БРН не пропускает напряжение дальше — только потребляет
        return [];
    },

    animate() {
        this.time += 0.016; // ~60 FPS
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        const x = this.x1;
        const y = this.y2;
        const w = this.width;
        const h = this.height;

        // Отрисовка прямоугольника
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fillStyle = this.isActive ? '#e0e0e0' : '#fff'; // светло-серый при активности
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Надпись над блоком
        ctx.fillStyle = '#c00';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('БРН', x + w / 2, y - 10);

        // Отрисовка синусоиды (только при активности)
        if (this.isActive) {
            const centerX = x + w / 2;
            const centerY = y + h / 2;
            const amp = 15; // амплитуда
            const freq = 4; // 4 полных цикла за 1 сек
            const period = 1000; // 1 сек — период изменения направления

            // Определяем направление синусоиды (прямое/обратное)
            const direction = Math.floor(this.time * 1000 / period) % 2 === 0 ? 1 : -1;

            ctx.beginPath();
            for (let i = 0; i <= w; i++) {
                const t = (i / w) * Math.PI * 4; // 2 периода
                const ySin = Math.sin(t) * amp * direction;
                const xPlot = x + i;
                const yPlot = centerY + ySin;

                if (i === 0) {
                    ctx.moveTo(xPlot, yPlot);
                } else {
                    ctx.lineTo(xPlot, yPlot);
                }
            }
            ctx.strokeStyle = '#c00';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
};

window.schemeElements.push(brn);
window.animatedElements.push(brn);
window.brn = brn;
// ========================================================================================================================
// === ЭЛЕМЕНТ: ОБМОТКА ГЕНЕРАТОРА (вертикальная спираль) ===
const generatorCoil = {
    name: 'generatorCoil',
    startX: 2219,
    startY: 564,
    endX: 2218,
    endY: 625,
    centerX: 2218.5,
    topY: 564,
    bottomY: 625,
    numTurns: 5,
    width: 20, // ширина фона (с запасом под спираль)
    isActive: false,
    pulsePhase: 0,

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.startX},${this.startY}`);
        const hasMinus = minusPoints.has(`${this.endX},${this.endY}`);
        this.isActive = hasPlus && hasMinus;
    },

    animate() {
        if (this.isActive) {
            this.pulsePhase += 0.1;
        }
    },

    getPropagationRules(plusPoints, minusPoints) {
        return [];
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        const height = this.bottomY - this.topY;
        const radius = 8;
        const coilLeft = this.centerX - radius - 4;
        const coilRight = this.centerX + radius + 4;

        // Фон — белый прямоугольник
        ctx.beginPath();
        ctx.rect(coilLeft, this.topY, coilRight - coilLeft, height);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = 'white'; // тонкая рамка
        ctx.lineWidth = 1;
        ctx.stroke();

        // Определяем цвет пульсации
        let color;
        if (this.isActive) {
            const intensity = Math.abs(Math.sin(this.pulsePhase)) * 0.5 + 0.5;
            const r = Math.floor(200 + intensity * 55);
            const g = Math.floor(60 + intensity * 140);
            color = `rgb(${r},${g},0)`;
        } else {
            color = '#888';
        }

        // Рисуем спираль
        ctx.beginPath();
        for (let i = 0; i <= this.numTurns * 20; i++) {
            const t = (i / (this.numTurns * 20)) * Math.PI * 2 * this.numTurns;
            const y = this.topY + (t / (Math.PI * 2 * this.numTurns)) * height;
            const x = this.centerX + Math.cos(t) * radius;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

    }
};

window.schemeElements.push(generatorCoil);
window.animatedElements.push(generatorCoil);
window.generatorCoil = generatorCoil;
// ========================================================================================================================
// === ТЯГОВЫЕ ЭЛЕКТРОДВИГАТЕЛИ (ТЭД1–ТЭД6) — ЕДИНАЯ СИСТЕМА АНИМАЦИИ ===

/**
 * Универсальная функция для создания ТЭД
 * @param {string} name - Имя двигателя (например, "ТЭД1")
 * @param {number} inY - Y координата входа (+)
 * @param {number} outY - Y координата выхода (–)
 * @param {number} centerX - X центра двигателя
 * @param {string} activationPoint - Контрольная точка активации анимации, например '2601,400'
 * @param {string} busPoint - Точка шины для определения направления, например '2689,618'
 */
function createTractionMotor(name, inY, outY, centerX, activationPoint, busPoint) {
    return {
        name,
        x: centerX - 3, // ширина 6 пикселей
        y: inY,
        width: 6,
        height: 20,
        inX: centerX,
        inY,
        outX: centerX,
        outY,
        centerX,
        centerY: inY + 10,
        radius: 7,
        rotation: 0,
        isActive: false,

        update(plusPoints, minusPoints) {
            const hasPlus = plusPoints.has(`${this.inX},${this.inY}`);
            const hasMinus = minusPoints.has(`${this.outX},${this.outY}`);
            this.isActive = hasPlus && hasMinus;
        },

        getPropagationRules(plusPoints, minusPoints) {
            this.update(plusPoints, minusPoints);
            const rules = [];

            if (plusPoints.has(`${this.inX},${this.inY}`)) {
                rules.push({
                    from: `${this.inX},${this.inY}`,
                    to: `${this.outX},${this.outY}`,
                    type: 'plus'
                });
            }

            if (minusPoints.has(`${this.outX},${this.outY}`)) {
                rules.push({
                    from: `${this.outX},${this.outY}`,
                    to: `${this.inX},${this.inY}`,
                    type: 'minus'
                });
            }

            return rules;
        },

        animate() {
            const networks = window.getNetworks?.();
            if (!networks) return;

            // Проверяем наличие "+" в точке активации
            const isActivated = networks.plusPoints.has(activationPoint);

            // Определяем направление по шине
            const hasPlusBus = networks.plusPoints.has(busPoint);
            const hasMinusBus = networks.minusPoints.has(busPoint);

            if (isActivated) {
                if (hasPlusBus) {
                    this.rotation += 0.1; // вперёд
                } else if (hasMinusBus) {
                    this.rotation -= 0.1; // назад
                }
            }
        },

        draw(ctx, networks) {
            const { plusPoints, minusPoints } = networks;
            this.update(plusPoints, minusPoints);

            const color = this.isActive ? '#c00' : '#000';

            // Прямоугольник
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Окружность
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Вращающийся крестик
            ctx.save();
            ctx.translate(this.centerX, this.centerY);
            ctx.rotate(this.rotation);
            ctx.beginPath();
            ctx.moveTo(0, -this.radius * 0.8);
            ctx.lineTo(0, this.radius * 0.8);
            ctx.moveTo(-this.radius * 0.8, 0);
            ctx.lineTo(this.radius * 0.8, 0);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }
    };
}

// === ГРУППА 1: ТЭД1, ТЭД2, ТЭД3 (первая тележка) ===
const ted1 = createTractionMotor('ТЭД1', 400, 420, 2601, '2601,400', '2689,618');
const ted2 = createTractionMotor('ТЭД2', 460, 480, 2601, '2601,400', '2689,618');
const ted3 = createTractionMotor('ТЭД3', 520, 540, 2601, '2601,400', '2689,618');

window.schemeElements.push(ted1, ted2, ted3);
window.animatedElements.push(ted1, ted2, ted3);
window.ted1 = ted1;
window.ted2 = ted2;
window.ted3 = ted3;

// === ГРУППА 2: ТЭД4, ТЭД5, ТЭД6 (вторая тележка) ===
const ted4 = createTractionMotor('ТЭД4', 400, 420, 2901, '2901,400', '2990,618');
const ted5 = createTractionMotor('ТЭД5', 460, 480, 2901, '2901,400', '2990,618');
const ted6 = createTractionMotor('ТЭД6', 520, 540, 2901, '2901,400', '2990,618');

window.schemeElements.push(ted4, ted5, ted6);
window.animatedElements.push(ted4, ted5, ted6);
window.ted4 = ted4;
window.ted5 = ted5;
window.ted6 = ted6;

// ========================================================================================================================
// === ОБМОТКИ ТЭД (спирали) — ЕДИНАЯ ЛОГИКА ДЛЯ ОБЕИХ ТЕЛЕЖЕК ===
let coilPulsePhase = 0;

/**
 * Создаёт объект-аниматор для группы обмоток
 * @param {Array} coils - Массив описаний обмоток
 * @param {string} busPoint - Точка шины для активации (например, '2689,618')
 * @param {number} phaseOffset - Сдвиг фазы для синхронизации волн
 */
function createCoilsAnimator(coils, busPoint, phaseOffset = 0) {
    return {
        animate() {
            const networks = window.getNetworks?.();
            if (!networks) return;

            const hasPlus = networks.plusPoints.has(busPoint);
            const hasMinus = networks.minusPoints.has(busPoint);

            if (hasPlus || hasMinus) {
                coilPulsePhase += 0.1;
            }
        },

        draw(ctx, networks) {
            const { plusPoints, minusPoints } = networks;
            const hasPlus = plusPoints.has(busPoint);
            const hasMinus = minusPoints.has(busPoint);

            if (!hasPlus && !hasMinus) {
                // Пассивное состояние — чёрные спирали
                coils.forEach(coil => drawStaticCoil(ctx, coil));
                return;
            }

            const direction = hasMinus ? -1 : 1; // – → вверх, + → вниз

            coils.forEach((coil, index) => {
                const t = coilPulsePhase + phaseOffset + index * 0.3;
                const height = coil.endY - coil.startY;
                const radius = coil.radius;
                const coilLeft = coil.centerX - radius - 4;
                const coilRight = coil.centerX + radius + 4;

                // Фон
                ctx.beginPath();
                ctx.rect(coilLeft, coil.startY, coilRight - coilLeft, height);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.beginPath();
                for (let i = 0; i <= coil.numTurns * 20; i++) {
                    const p = i / (coil.numTurns * 20);
                    const y = coil.startY + p * height;
                    const x = coil.centerX + Math.cos(p * Math.PI * 2 * coil.numTurns) * radius;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }

                    const dirOffset = direction === 1 ? p : 1 - p;
                    const alpha = Math.abs(Math.sin(t * 2 + dirOffset * Math.PI * 4)) * 0.7 + 0.3;
                    const g = 165 + Math.abs(Math.sin(t + p * 10)) * 90;

                    ctx.strokeStyle = `rgb(255,${Math.floor(g)},0)`;
                    ctx.lineWidth = 2;
                    ctx.globalAlpha = alpha;
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                }
                ctx.globalAlpha = 1.0;
            });
        }
    };
}

function drawStaticCoil(ctx, coil) {
    const height = coil.endY - coil.startY;
    const radius = coil.radius;
    const coilLeft = coil.centerX - radius - 4;
    const coilRight = coil.centerX + radius + 4;

    ctx.beginPath();
    ctx.rect(coilLeft, coil.startY, coilRight - coilLeft, height);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i <= coil.numTurns * 20; i++) {
        const p = i / (coil.numTurns * 20);
        const y = coil.startY + p * height;
        const x = coil.centerX + Math.cos(p * Math.PI * 2 * coil.numTurns) * radius;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// === Аниматор для обмоток первой тележки ===
const tedCoilsAnimator = createCoilsAnimator([
    { name: 'tedCoil1', startX: 2690, startY: 618, endX: 2690, endY: 657, centerX: 2690, radius: 8, numTurns: 5 },
    { name: 'tedCoil2', startX: 2690, startY: 674, endX: 2690, endY: 713, centerX: 2690, radius: 8, numTurns: 5 },
    { name: 'tedCoil3', startX: 2690, startY: 728, endX: 2690, endY: 767, centerX: 2690, radius: 8, numTurns: 5 }
], '2689,618', 0);

window.schemeElements.push(tedCoilsAnimator);
window.animatedElements.push(tedCoilsAnimator);

// === Аниматор для обмоток второй тележки ===
const tedCoilsAnimator2 = createCoilsAnimator([
    { name: 'tedCoil4', startX: 2990, startY: 618, endX: 2990, endY: 657, centerX: 2990, radius: 8, numTurns: 5 },
    { name: 'tedCoil5', startX: 2990, startY: 674, endX: 2990, endY: 713, centerX: 2990, radius: 8, numTurns: 5 },
    { name: 'tedCoil6', startX: 2990, startY: 728, endX: 2990, endY: 767, centerX: 2990, radius: 8, numTurns: 5 }
], '2990,618', 0.6);

window.schemeElements.push(tedCoilsAnimator2);
window.animatedElements.push(tedCoilsAnimator2);
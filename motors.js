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
// === ТЯГОВЫЕ ЭЛЕКТРОДВИГАТЕЛИ (ТЭД1, ТЭД2, ТЭД3) ===
function createTractionMotor(name, inY, outY, x = 2601) {
    const centerX = 2601;
    const centerY = inY + 10;
    const radius = 7;

    return {
        name,
        x: 2598, // прямоугольник сдвинут, чтобы центр был на 2601
        y: inY,
        width: 6,
        height: 20,
        inX: 2601,
        inY,
        outX: 2601,
        outY,
        centerX,
        centerY,
        radius,
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

    // Передаём "+" от входа к выходу, если он есть
    if (plusPoints.has(`${this.inX},${this.inY}`)) {
        rules.push({
            from: `${this.inX},${this.inY}`,
            to: `${this.outX},${this.outY}`,
            type: 'plus'
        });
    }

    // Опционально: передаём "–" от выхода к входу, если цепь замкнута
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
    console.log('ТЭД animate вызван');

    const networks = window.getNetworks?.();
    if (!networks) {
        console.log('networks не доступен');
        return;
    }

    console.log('plusPoints:', networks.plusPoints);
    console.log('minusPoints:', networks.minusPoints);

    const hasPlus = networks.plusPoints.has('2689,618');
    const hasMinus = networks.minusPoints.has('2689,618');

    console.log('hasPlus:', hasPlus);
    console.log('hasMinus:', hasMinus);

    if (hasPlus) {
        this.rotation += 0.1;
        console.log('rotation увеличен:', this.rotation);
    } else if (hasMinus) {
        this.rotation -= 0.1;
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

const ted1 = createTractionMotor('ТЭД1', 400, 420);
const ted2 = createTractionMotor('ТЭД2', 460, 480);
const ted3 = createTractionMotor('ТЭД3', 520, 540);

window.schemeElements.push(ted1, ted2, ted3);
window.animatedElements.push(ted1, ted2, ted3);
window.ted1 = ted1;
window.ted2 = ted2;
window.ted3 = ted3;
// ========================================================================================================================
// === ОБМОТКИ ТЭД1, ТЭД2, ТЭД3 (вертикальные спирали) ===
const tedCoils = [
    {
        name: 'tedCoil1',
        startX: 2690, startY: 618,
        endX: 2690, endY: 657,
        centerX: 2690,
        width: 20,
        radius: 8,
        numTurns: 5
    },
    {
        name: 'tedCoil2',
        startX: 2690, startY: 674,
        endX: 2690, endY: 713,
        centerX: 2690,
        width: 20,
        radius: 8,
        numTurns: 5
    },
    {
        name: 'tedCoil3',
        startX: 2690, startY: 728,
        endX: 2690, endY: 767,
        centerX: 2690,
        width: 20,
        radius: 8,
        numTurns: 5
    }
];

// Общая анимация и состояние
let coilPulsePhase = 0;

// Объект для анимации обмоток
const tedCoilsAnimator = {
    update(plusPoints, minusPoints) {
        // Обновляется автоматически
    },

    animate() {
        const networks = window.getNetworks?.();
        if (!networks) return;

        const hasPlus = networks.plusPoints.has('2689,618');
        const hasMinus = networks.minusPoints.has('2689,618');

        // Анимируем только если есть сигнал
        if (hasPlus || hasMinus) {
            coilPulsePhase += 0.1;
        }
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;

        const hasPlus = plusPoints.has('2689,618');
        const hasMinus = minusPoints.has('2689,618');

        // Если нет ни +, ни – → просто чёрные обмотки, без анимации
        if (!hasPlus && !hasMinus) {
            tedCoils.forEach(coil => {
                const height = coil.endY - coil.startY;
                const radius = coil.radius;
                const coilLeft = coil.centerX - radius - 4;
                const coilRight = coil.centerX + radius + 4;

                // Фон — белый прямоугольник
                ctx.beginPath();
                ctx.rect(coilLeft, coil.startY, coilRight - coilLeft, height);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Чёрная спираль
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
                }
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.stroke();
            });
            return;
        }

        // Направление "бегущей волны": + → вниз, – → вверх
        const direction = hasMinus ? -1 : 1; // -1 = снизу вверх, +1 = сверху вниз

        tedCoils.forEach(coil => {
            const height = coil.endY - coil.startY;
            const radius = coil.radius;
            const coilLeft = coil.centerX - radius - 4;
            const coilRight = coil.centerX + radius + 4;

            // Фон — белый прямоугольник
            ctx.beginPath();
            ctx.rect(coilLeft, coil.startY, coilRight - coilLeft, height);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Определяем сдвиг фазы для каждой обмотки
            const t = coilPulsePhase + (coil.name === 'tedCoil1' ? 0 : coil.name === 'tedCoil2' ? 0.3 : 0.6);

            ctx.beginPath();
            for (let i = 0; i <= coil.numTurns * 20; i++) {
                const p = i / (coil.numTurns * 20);
                const y = coil.startY + p * height;
                const wavePos = (p * 4 + t) % 2;
                const intensity = wavePos <= 1 ? wavePos : 2 - wavePos;
                const r = Math.floor(255);
                const g = Math.floor(165 + intensity * 90); // оранжевый → жёлтый

                const x = coil.centerX + Math.cos(p * Math.PI * 2 * coil.numTurns) * radius;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                // Направление волны: + → сверху вниз, – → снизу вверх
                const dirOffset = direction === 1 ? p : 1 - p;
                const alpha = Math.abs(Math.sin(t * 2 + dirOffset * Math.PI * 4)) * 0.7 + 0.3;

                ctx.strokeStyle = `rgb(${r},${g},0)`;
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

window.schemeElements.push(tedCoilsAnimator);
window.animatedElements.push(tedCoilsAnimator);
// ========================================================================================================================
// ========================================================================================================================
// === ТЯГОВЫЕ ЭЛЕКТРОДВИГАТЕЛИ (ТЭД4, ТЭД5, ТЭД6) — вторая тележка ===

function createTractionMotor2(name, inY, outY, x = 2901) {
    const centerX = 2901;
    const centerY = inY + 10;
    const radius = 7;

    return {
        name,
        x: 2897, // прямоугольник сдвинут, чтобы центр был на 2900
        y: inY,
        width: 6,
        height: 20,
        inX: 2901,
        inY,
        outX: 2901,
        outY,
        centerX,
        centerY,
        radius,
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

            // Передаём "+" от входа к выходу, если он есть
            if (plusPoints.has(`${this.inX},${this.inY}`)) {
                rules.push({
                    from: `${this.inX},${this.inY}`,
                    to: `${this.outX},${this.outY}`,
                    type: 'plus'
                });
            }

            // Передаём "–" от выхода к входу, если цепь замкнута
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

            const hasPlus = networks.plusPoints.has('2990,618');
            const hasMinus = networks.minusPoints.has('2990,618');

            if (hasPlus) {
                this.rotation += 0.1;
            } else if (hasMinus) {
                this.rotation -= 0.1;
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

const ted4 = createTractionMotor2('ТЭД4', 400, 420);
const ted5 = createTractionMotor2('ТЭД5', 460, 480);
const ted6 = createTractionMotor2('ТЭД6', 520, 540);

window.schemeElements.push(ted4, ted5, ted6);
window.animatedElements.push(ted4, ted5, ted6);
window.ted4 = ted4;
window.ted5 = ted5;
window.ted6 = ted6;

// ========================================================================================================================
// === ОБМОТКИ ТЭД4, ТЭД5, ТЭД6 (вертикальные спирали) ===
const tedCoils2 = [
    {
        name: 'tedCoil4',
        startX: 2990, startY: 618,
        endX: 2990, endY: 657,
        centerX: 2990,
        width: 20,
        radius: 8,
        numTurns: 5
    },
    {
        name: 'tedCoil5',
        startX: 2990, startY: 674,
        endX: 2990, endY: 713,
        centerX: 2990,
        width: 20,
        radius: 8,
        numTurns: 5
    },
    {
        name: 'tedCoil6',
        startX: 2990, startY: 728,
        endX: 2990, endY: 767,
        centerX: 2990,
        width: 20,
        radius: 8,
        numTurns: 5
    }
];

// Объект для анимации обмоток второй тележки
const tedCoilsAnimator2 = {
    update(plusPoints, minusPoints) {
        // Обновляется автоматически
    },

    animate() {
        const networks = window.getNetworks?.();
        if (!networks) return;

        const hasPlus = networks.plusPoints.has('2990,618');
        const hasMinus = networks.minusPoints.has('2990,618');

        // Анимируем только если есть сигнал
        if (hasPlus || hasMinus) {
            coilPulsePhase += 0.1;
        }
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;

        const hasPlus = plusPoints.has('2990,618');
        const hasMinus = minusPoints.has('2990,618');

        // Если нет ни +, ни – → просто чёрные обмотки
        if (!hasPlus && !hasMinus) {
            tedCoils2.forEach(coil => {
                const height = coil.endY - coil.startY;
                const radius = coil.radius;
                const coilLeft = coil.centerX - radius - 4;
                const coilRight = coil.centerX + radius + 4;

                // Фон — белый прямоугольник
                ctx.beginPath();
                ctx.rect(coilLeft, coil.startY, coilRight - coilLeft, height);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Чёрная спираль
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
                }
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.stroke();
            });
            return;
        }

        // Направление "бегущей волны"
        const direction = hasMinus ? -1 : 1;

        tedCoils2.forEach(coil => {
            const height = coil.endY - coil.startY;
            const radius = coil.radius;
            const coilLeft = coil.centerX - radius - 4;
            const coilRight = coil.centerX + radius + 4;

            // Фон — белый прямоугольник
            ctx.beginPath();
            ctx.rect(coilLeft, coil.startY, coilRight - coilLeft, height);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Определяем сдвиг фазы
            const t = coilPulsePhase + (coil.name === 'tedCoil4' ? 0 : coil.name === 'tedCoil5' ? 0.3 : 0.6);

            ctx.beginPath();
            for (let i = 0; i <= coil.numTurns * 20; i++) {
                const p = i / (coil.numTurns * 20);
                const y = coil.startY + p * height;
                const wavePos = (p * 4 + t) % 2;
                const intensity = wavePos <= 1 ? wavePos : 2 - wavePos;
                const r = Math.floor(255);
                const g = Math.floor(165 + intensity * 90);

                const x = coil.centerX + Math.cos(p * Math.PI * 2 * coil.numTurns) * radius;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                const dirOffset = direction === 1 ? p : 1 - p;
                const alpha = Math.abs(Math.sin(t * 2 + dirOffset * Math.PI * 4)) * 0.7 + 0.3;

                ctx.strokeStyle = `rgb(${r},${g},0)`;
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

window.schemeElements.push(tedCoilsAnimator2);
window.animatedElements.push(tedCoilsAnimator2);

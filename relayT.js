// === РЕЛЕ КВ (с задержкой отключения 0.2 сек) ===
const kv = {
    coil: {
        inX: 758,
        inY: 531,
        outX: 768,
        outY: 530
    },
    contactNC: { // Нормально замкнутый
        inX: 283,
        inY: 1940,
        outX: 311,
        outY: 1940
    },
    contactNO: { // Нормально разомкнутый
        inX: 2173,
        inY: 430,
        outX: 2217,
        outY: 430
    },
    contactNO2: { // НО контакт — новая добавка (403,448 → 434,448)
        inX: 403,
        inY: 448,
        outX: 434,
        outY: 448
    },
    isForcedOn: false,
    isPowered: false,
    isActive: false,
    isTimerActive: false,
    timer: null,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        requestRedraw();
    },

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = this.isForcedOn || (hasPlus && hasMinus);

        // Включение — мгновенно
        if (isPowered && !this.isPowered) {
            this.isActive = true;
            this.stopTimer();
        }

        // Выключение — стартуем таймер
        if (!isPowered && this.isPowered && this.isActive) {
            this.startDelayTimer();
        }

        this.isPowered = isPowered;
    },

    startDelayTimer() {
        if (this.isTimerActive) return;

        this.isTimerActive = true;

        this.timer = setTimeout(() => {
            this.isActive = false;
            this.isTimerActive = false;
            requestRedraw();
        }, 200); // 0.2 секунды
    },

    stopTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.isTimerActive = false;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update(plusPoints, minusPoints);

        const rules = [];

        // НО контакты — работают при isActive
        if (this.isActive) {
            rules.push({
                from: `${this.contactNO.inX},${this.contactNO.inY}`,
                to: `${this.contactNO.outX},${this.contactNO.outY}`,
                type: 'plus'
            });
            rules.push({
                from: `${this.contactNO2.inX},${this.contactNO2.inY}`,
                to: `${this.contactNO2.outX},${this.contactNO2.outY}`,
                type: 'plus'
            });
        }

        // НЗ контакт — работает при !isActive
        if (!this.isActive) {
            rules.push({
                from: `${this.contactNC.inX},${this.contactNC.inY}`,
                to: `${this.contactNC.outX},${this.contactNC.outY}`,
                type: 'plus'
            });
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // Отрисовка катушки
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = hasPlus && hasMinus;
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Отрисовка НЗ контакта
        const nc = this.contactNC;
        const hasInputNC = plusPoints.has(`${nc.inX},${nc.inY}`);
        ctx.beginPath();
        ctx.moveTo(nc.inX, nc.inY);
        ctx.lineTo(nc.inX + 10, nc.inY);
        ctx.lineTo(nc.inX + 10, nc.inY + 15);
        ctx.strokeStyle = hasInputNC ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(nc.outX, nc.outY);
        ctx.lineTo(nc.outX - 7, nc.inY);
        ctx.lineTo(nc.outX - 7, nc.inY + 15);
        ctx.strokeStyle = hasInputNC ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!this.isActive) {
            ctx.beginPath();
            ctx.moveTo(nc.inX + 10, nc.inY + 5);
            ctx.lineTo(nc.outX - 7, nc.outY + 13);
            ctx.strokeStyle = hasInputNC ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(nc.inX + 16, nc.inY);
            ctx.lineTo(nc.inX + 16, nc.outY + 15);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }

        // Отрисовка НО контактов
        const drawNOContact = (contact, hasInput, isActive) => {
            ctx.beginPath();
            ctx.moveTo(contact.inX, contact.inY);
            ctx.lineTo(contact.inX + 8, contact.inY);
            ctx.strokeStyle = hasInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(contact.outX, contact.outY);
            ctx.lineTo(contact.outX - 8, contact.outY);
            ctx.strokeStyle = hasInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            if (isActive) {
                ctx.beginPath();
                ctx.moveTo(contact.inX, contact.inY);
                ctx.lineTo(contact.outX, contact.outY);
                ctx.strokeStyle = hasInput ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(contact.outX - 8, contact.outY);
                ctx.lineTo(contact.inX + 8, contact.inY - 8);
                ctx.strokeStyle = hasInput ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        };

        drawNOContact(this.contactNO, plusPoints.has(`${this.contactNO.inX},${this.contactNO.inY}`), this.isActive);
        drawNOContact(this.contactNO2, plusPoints.has(`${this.contactNO2.inX},${this.contactNO2.inY}`), this.isActive);
    }
};

window.schemeElements.push(kv);
window.animatedElements.push(kv);
// ========================================================================================================================
// === РЕЛЕ КУ10 ===
const ku10 = {
    coil: {
        inX: 713,
        inY: 280,
        outX: 723,
        outY: 280
    },
    contactNC: { // Нормально замкнутый
        inX: 455,
        inY: 254,
        outX: 483,
        outY: 254
    },
    contactNO: { // Нормально разомкнутый
        inX: 674,
        inY: 280,
        outX: 648,
        outY: 280
    },
    isForcedOn: false,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        requestRedraw();
    },

    getPropagationRules(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = this.isForcedOn || (hasPlus && hasMinus);

        const rules = [];

        // НО контакт — замыкается при включении
        if (isPowered) {
            rules.push({
                from: `${this.contactNO.inX},${this.contactNO.inY}`,
                to: `${this.contactNO.outX},${this.contactNO.outY}`,
                type: 'plus'
            });
        }

        // НЗ контакт — замыкается при ОТКЛЮЧЕНИИ
        if (!isPowered) {
            rules.push({
                from: `${this.contactNC.inX},${this.contactNC.inY}`,
                to: `${this.contactNC.outX},${this.contactNC.outY}`,
                type: 'plus'
            });
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = this.isForcedOn || (hasPlus && hasMinus);

        // Отрисовка катушки
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');
        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Отрисовка НЗ контакта (455,254 → 483,254)
        const nc = this.contactNC;
        const hasInputNC = plusPoints.has(`${nc.inX},${nc.inY}`);
        // вход
        ctx.beginPath();
        ctx.moveTo(nc.inX, nc.inY);
        ctx.lineTo(nc.inX + 10, nc.inY);
        ctx.lineTo(nc.inX + 10, nc.inY + 15);
        ctx.strokeStyle = hasInputNC ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();
        // выход
        ctx.beginPath();
        ctx.moveTo(nc.outX, nc.outY);
        ctx.lineTo(nc.outX - 7, nc.inY);
        ctx.lineTo(nc.outX - 7, nc.inY + 15);
        ctx.strokeStyle = hasInputNC ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!isPowered) {
            // Замкнут
            ctx.beginPath();
            ctx.moveTo(nc.inX + 10, nc.inY + 5);
            ctx.lineTo(nc.outX - 7, nc.outY + 13);
            ctx.strokeStyle = hasInputNC ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнут
            ctx.beginPath();
            ctx.moveTo(nc.inX + 16, nc.inY);
            ctx.lineTo(nc.inX + 16, nc.outY + 15);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }

        // Отрисовка НО контакта (674,280 → 648,280)
        const no = this.contactNO;
        const hasInputNO = plusPoints.has(`${no.inX},${no.inY}`);
        ctx.beginPath();
        ctx.moveTo(no.inX, no.inY);
        ctx.lineTo(no.inX + 10, no.inY);
        ctx.strokeStyle = hasInputNO ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isPowered) {
            // Замкнут — красная линия
            ctx.beginPath();
            ctx.moveTo(no.inX + 10, no.inY);
            ctx.lineTo(no.outX, no.outY);
            ctx.strokeStyle = hasInputNO ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {

            ctx.beginPath();
            ctx.moveTo(no.inX, no.inY);
            ctx.lineTo(no.inX - 18, no.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

window.schemeElements.push(ku10);
window.animatedElements.push(ku10);
// ========================================================================================================================
// === РЕЛЕ РВ4 (задержка включения 1.5 секунды) ===
const rv4 = {
    coil: {
        inX: 725,
        inY: 470,
        outX: 735,
        outY: 470
    },
    contact: {
        inX: 567,
        inY: 379,
        outX: 593,
        outY: 378
    },
    isForcedOn: false,
    isPowered: false,
    isActive: false,
    countdown: 0,
    timer: null,
    isTimerStarted: false,
    isPowerDirty: false,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        if (this.isForcedOn) {
            this.isActive = true;
            this.isTimerStarted = false;
            this.countdown = 0;
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        } else {
            this.isActive = false;
            this.stopCountdown();
        }
        requestRedraw();
    },

    startCountdown(seconds) {
        if (this.isTimerStarted) return;

        this.isTimerStarted = true;
        this.countdown = seconds;
        console.log('RV4: startCountdown запущен на', seconds);

        this.timer = setInterval(() => {
            this.countdown -= 0.1; // Обновление каждые 100мс
            if (this.countdown <= 0) {
                clearInterval(this.timer);
                this.timer = null;
                this.isActive = true;
                this.isTimerStarted = false;
                this.isPowerDirty = true;
                console.log('RV4: Задержка включения завершена — контакт замкнут');
            }
            requestRedraw(); // Обновляем отображение
        }, 100); // Каждые 100мс (0.1 сек)
    },

    stopCountdown() {
        if (this.timer) {
            console.log('RV4: stopCountdown — таймер остановлен');
            clearInterval(this.timer);
            this.timer = null;
        }
        this.countdown = 0;
        this.isTimerStarted = false;
        this.isActive = false;
        this.isPowerDirty = true;
    },

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = this.isForcedOn || (hasPlus && hasMinus);

        this.isPowered = isPowered;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        const wasPowered = this.isPoweredPrev !== undefined ? this.isPoweredPrev : false;
        const isPowered = this.isPowered;

        if (isPowered && !wasPowered && !this.isTimerStarted && !this.isActive) {
            this.startCountdown(1.5);
        } else if (!isPowered && wasPowered) {
            this.stopCountdown();
        }

        this.isPoweredPrev = isPowered;

        if (this.isPowerDirty || !window.isStabilizingNetworks) {
            this.isPowerDirty = false;

            const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
            const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
            const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

            // Отрисовка катушки
            ctx.beginPath();
            ctx.rect(this.coil.inX, this.coil.inY - 15, 10, 20);
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 3;
            ctx.stroke();

            // Отображение таймера у катушки
            if (this.countdown > 0 && !this.isActive) {
                const timerX = this.coil.inX + 5;
                const timerY = this.coil.inY + 3;

                ctx.fillStyle = '#fff';
                ctx.fillRect(timerX - 10, timerY - 10, 20, 10);

                ctx.fillStyle = '#000';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${this.countdown.toFixed(1)}`, timerX, timerY);
            }

            // Отрисовка контакта
            const c = this.contact;
            const hasInput = plusPoints.has(`${c.inX},${c.inY}`);

            ctx.beginPath();
            ctx.moveTo(c.inX, c.inY);
            ctx.lineTo(c.inX + 10, c.inY);
            ctx.strokeStyle = hasInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            if (this.isActive) {
                ctx.beginPath();
                ctx.moveTo(c.inX + 10, c.inY);
                ctx.lineTo(c.outX, c.outY);
                ctx.strokeStyle = hasInput ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(c.inX + 10, c.inY);
                ctx.lineTo(c.outX, c.outY);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 5;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(c.outX, c.outY);
                ctx.lineTo(c.outX - 20, c.outY - 10);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            // Отображение таймера у контакта
            if (this.countdown > 0 && !this.isActive) {
                const timerX = c.outX - 10;
                const timerY = c.outY + 15;

                ctx.fillStyle = '#fff';
                ctx.fillRect(timerX - 10, timerY - 10, 20, 10);

                ctx.fillStyle = '#000';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${this.countdown.toFixed(1)}`, timerX, timerY);
            }
        }
    },

    getPropagationRules() {
        if (this.isActive) {
            return [
                {
                    from: `${this.contact.inX},${this.contact.inY}`,
                    to: `${this.contact.outX},${this.contact.outY}`,
                    type: 'plus'
                }
            ];
        }
        return [];
    }
};

window.schemeElements.push(rv4);
window.animatedElements.push(rv4);
// ========================================================================================================================
// === РЕЛЕ РУ24 (обновлённое) ===
const ru24 = {
    coil: {
        inX: 293,
        inY: 1445,
        outX: 303,
        outY: 1445
    },
    contactNC: { // Нормально замкнутый (как у КВ)
        inX: 625,
        inY: 378,
        outX: 645,
        outY: 378
    },
    contactNC_Plus: { // Новый НЗ контакт по "+" (300,530 → 325,530), как у РУ15
        inX: 300,
        inY: 530,
        outX: 325,
        outY: 530
    },
    isForcedOn: false,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        requestRedraw();
    },

    getPropagationRules(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = this.isForcedOn || (hasPlus && hasMinus);

        const rules = [];

        // НЗ контакт 1 — замыкается при ОТКЛЮЧЕНИИ реле (625,378 → 645,378)
        if (!isPowered) {
            rules.push({
                from: `${this.contactNC.inX},${this.contactNC.inY}`,
                to: `${this.contactNC.outX},${this.contactNC.outY}`,
                type: 'plus'
            });
        }

        // НЗ контакт 2 по "+" (300,530 → 325,530)
        if (!isPowered) {
            const inPoint = `${this.contactNC_Plus.inX},${this.contactNC_Plus.inY}`;
            const outPoint = `${this.contactNC_Plus.outX},${this.contactNC_Plus.outY}`;
            const hasPlusIn = plusPoints.has(inPoint);

            if (hasPlusIn) {
                rules.push({
                    from: inPoint,
                    to: outPoint,
                    type: 'plus'
                });
            }
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = this.isForcedOn || (hasPlus && hasMinus);

        // Отрисовка катушки
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');
        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // === Отрисовка НЗ контакта (625,378 → 645,378) ===
        const nc = this.contactNC;
        const hasInputNC = plusPoints.has(`${nc.inX},${nc.inY}`);

        ctx.beginPath();
        ctx.moveTo(nc.inX, nc.inY);
        ctx.lineTo(nc.inX + 3, nc.inY);
        ctx.lineTo(nc.inX + 3, nc.inY + 15);
        ctx.strokeStyle = hasInputNC ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(nc.outX, nc.outY);
        ctx.lineTo(nc.outX - 2, nc.outY);
        ctx.lineTo(nc.outX - 2, nc.outY + 15);
        ctx.strokeStyle = hasInputNC ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!isPowered) {
            ctx.beginPath();
            ctx.moveTo(nc.inX + 3, nc.inY + 5);
            ctx.lineTo(nc.outX - 2, nc.outY + 13);
            ctx.strokeStyle = hasInputNC ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(nc.inX + 10, nc.inY);
            ctx.lineTo(nc.inX + 10, nc.outY + 15);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }

        // === Отрисовка нового НЗ контакта по "+" (300,530 → 325,530) как у РУ15 ===
        const ncPlus = this.contactNC_Plus;
        const hasInput = plusPoints.has(`${ncPlus.inX},${ncPlus.inY}`);
        const color = hasInput ? '#c00' : '#000';

        // Вход (левая часть)
        ctx.beginPath();
        ctx.moveTo(ncPlus.inX, ncPlus.inY);
        ctx.lineTo(ncPlus.inX + 6, ncPlus.inY);
        ctx.lineTo(ncPlus.inX + 6, ncPlus.inY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Выход (правая часть)
        ctx.beginPath();
        ctx.moveTo(ncPlus.outX, ncPlus.outY);
        ctx.lineTo(ncPlus.outX - 6, ncPlus.outY);
        ctx.lineTo(ncPlus.outX - 6, ncPlus.outY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!isPowered) {
            // Замкнут — соединяем диагональю
            ctx.beginPath();
            ctx.moveTo(ncPlus.inX + 6, ncPlus.inY + 2);
            ctx.lineTo(ncPlus.outX - 6, ncPlus.outY + 10);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнут — белая полоса
            ctx.beginPath();
            ctx.moveTo(ncPlus.inX + 12, ncPlus.inY);
            ctx.lineTo(ncPlus.inX + 12, ncPlus.inY + 15);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }
    }
};

window.schemeElements.push(ru24);
window.animatedElements.push(ru24);
// ========================================================================================================================
// === РЕЛЕ РЕВЕРСОР ВПЕРЁД ===
const revForward = {
    coil: {
        inX: 712,
        inY: 227,
        outX: 722,
        outY: 227
    },
    contact1: { // НО, +
        inX: 512,
        inY: 254,
        outX: 545,
        outY: 254
    },
    contact2: { // НО, +
        inX: 384,
        inY: 2228,
        outX: 412,
        outY: 2228
    },
    contact3: { // НО, двунаправленный, ±
        inX: 2618,
        inY: 699,
        outX: 2618,
        outY: 651
    },
    contact4: { // НО, двунаправленный, ±
        inX: 2637,
        inY: 699,
        outX: 2637,
        outY: 746
    },
    contact5: { // НО, двунаправленный, ±
        inX: 2919,
        inY: 699,
        outX: 2919,
        outY: 652
    },
    contact6: { // НО, двунаправленный, ±
        inX: 2938,
        inY: 699,
        outX: 2938,
        outY: 746
    },
    isForcedOn: false,
    isPowered: false,
    isActive: false,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        requestRedraw();
    },

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        this.isPowered = hasPlus && hasMinus;
        this.isActive = this.isForcedOn || this.isPowered;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update(plusPoints, minusPoints);

        const rules = [];

        // Контакты 1 и 2 — НО по "+", замыкаются при ВКЛЮЧЕНИИ
        if (this.isActive) {
            rules.push(
                {
                    from: `${this.contact1.inX},${this.contact1.inY}`,
                    to: `${this.contact1.outX},${this.contact1.outY}`,
                    type: 'plus'
                },
                {
                    from: `${this.contact2.inX},${this.contact2.inY}`,
                    to: `${this.contact2.outX},${this.contact2.outY}`,
                    type: 'plus'
                }
            );
        }

        // Контакты 3-6 — двунаправленные, НО, пропускают + и -
        if (this.isActive) {
            const in3 = `${this.contact3.inX},${this.contact3.inY}`;
            const out3 = `${this.contact3.outX},${this.contact3.outY}`;
            const in4 = `${this.contact4.inX},${this.contact4.inY}`;
            const out4 = `${this.contact4.outX},${this.contact4.outY}`;
            const in5 = `${this.contact5.inX},${this.contact5.inY}`;
            const out5 = `${this.contact5.outX},${this.contact5.outY}`;
            const in6 = `${this.contact6.inX},${this.contact6.inY}`;
            const out6 = `${this.contact6.outX},${this.contact6.outY}`;

            const hasPlus3 = plusPoints.has(in3);
            const hasMinus3 = minusPoints.has(in3);
            const hasPlus4 = plusPoints.has(in4);
            const hasMinus4 = minusPoints.has(in4);
            const hasPlus5 = plusPoints.has(in5);
            const hasMinus5 = minusPoints.has(in5);
            const hasPlus6 = plusPoints.has(in6);
            const hasMinus6 = minusPoints.has(in6);

            if (hasPlus3) {
                rules.push({ from: in3, to: out3, type: 'plus' }, { from: out3, to: in3, type: 'plus' });
            }
            if (hasMinus3) {
                rules.push({ from: in3, to: out3, type: 'minus' }, { from: out3, to: in3, type: 'minus' });
            }
            if (hasPlus4) {
                rules.push({ from: in4, to: out4, type: 'plus' }, { from: out4, to: in4, type: 'plus' });
            }
            if (hasMinus4) {
                rules.push({ from: in4, to: out4, type: 'minus' }, { from: out4, to: in4, type: 'minus' });
            }
            if (hasPlus5) {
                rules.push({ from: in5, to: out5, type: 'plus' }, { from: out5, to: in5, type: 'plus' });
            }
            if (hasMinus5) {
                rules.push({ from: in5, to: out5, type: 'minus' }, { from: out5, to: in5, type: 'minus' });
            }
            if (hasPlus6) {
                rules.push({ from: in6, to: out6, type: 'plus' }, { from: out6, to: in6, type: 'plus' });
            }
            if (hasMinus6) {
                rules.push({ from: in6, to: out6, type: 'minus' }, { from: out6, to: in6, type: 'minus' });
            }
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // Отрисовка катушки
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = hasPlus && hasMinus;
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // === Отрисовка контакта 1 (512,254 → 545,254) НО, +
        const c1 = this.contact1;
        const hasInput1 = plusPoints.has(`${c1.inX},${c1.inY}`);
        {
            ctx.beginPath();
            ctx.moveTo(c1.inX, c1.inY);
            ctx.lineTo(c1.inX + 9, c1.inY);
            ctx.lineTo(c1.inX + 9, c1.inY + 12);
            ctx.strokeStyle = hasInput1 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c1.outX, c1.outY);
            ctx.lineTo(c1.outX - 10, c1.outY);
            ctx.lineTo(c1.outX - 10, c1.inY + 12);
            ctx.strokeStyle = hasInput1 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            if (this.isActive) {
                ctx.beginPath();
                ctx.moveTo(c1.inX + 9, c1.inY + 3);
                ctx.lineTo(c1.outX - 10, c1.outY + 12);
                ctx.strokeStyle = hasInput1 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(c1.inX + 15, c1.inY);
                ctx.lineTo(c1.inX + 15, c1.inY + 15);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 7;
                ctx.stroke();
            }
        }

        // === Отрисовка контакта 2 (384,2228 → 412,2228) НО, +
        const c2 = this.contact2;
        const hasInput2 = plusPoints.has(`${c2.inX},${c2.inY}`);
        {
            ctx.beginPath();
            ctx.moveTo(c2.inX, c2.inY);
            ctx.lineTo(c2.inX + 3, c2.inY);
            ctx.lineTo(c2.inX + 3, c2.inY + 12);
            ctx.strokeStyle = hasInput2 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c2.outX, c2.outY);
            ctx.lineTo(c2.outX - 10, c2.outY);
            ctx.lineTo(c2.outX - 10, c2.inY + 12);
            ctx.strokeStyle = hasInput2 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            if (this.isActive) {
                ctx.beginPath();
                ctx.moveTo(c2.inX + 3, c2.inY + 3);
                ctx.lineTo(c2.outX - 10, c2.outY + 12);
                ctx.strokeStyle = hasInput2 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(c2.inX + 10, c2.inY);
                ctx.lineTo(c2.inX + 10, c2.inY + 15);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 7;
                ctx.stroke();
            }
        }

        // === Отрисовка контакта 3 (2618,699 → 2618,651) НО, ±, вертикальный
        const c3 = this.contact3;
        const hasPlus3 = plusPoints.has(`${c3.inX},${c3.inY}`);
        const hasMinus3 = minusPoints.has(`${c3.inX},${c3.inY}`);
        const color3 = hasPlus3 ? '#c00' : (hasMinus3 ? '#008000' : '#000');
        {
            // Вход (вверх)
            ctx.beginPath();
            ctx.moveTo(c3.inX, c3.inY);
            ctx.lineTo(c3.inX, c3.inY - 21);
            ctx.lineTo(c3.inX - 12, c3.inY - 21);
            ctx.strokeStyle = color3;
            ctx.lineWidth = 3;
            ctx.stroke();

            // Выход (вниз)
            ctx.beginPath();
            ctx.moveTo(c3.outX, c3.outY);
            ctx.lineTo(c3.outX, c3.outY + 16);
            ctx.lineTo(c3.outX - 12, c3.outY + 16);
            ctx.strokeStyle = color3;
            ctx.lineWidth = 3;
            ctx.stroke();

            if (this.isActive) {
                ctx.beginPath();
                ctx.moveTo(c3.inX - 10, c3.inY - 21);
                ctx.lineTo(c3.inX - 5, c3.inY - 34);
                ctx.strokeStyle = color3;
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(c3.inX - 15, c3.inY - 26);
                ctx.lineTo(c3.inX, c3.inY - 26);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 7;
                ctx.stroke();
            }
        }

        // === Отрисовка контакта 4 (2637,699 → 2637,746) НО, ±, вертикальный
        const c4 = this.contact4;
        const hasPlus4 = plusPoints.has(`${c4.inX},${c4.inY}`);
        const hasMinus4 = minusPoints.has(`${c4.inX},${c4.inY}`);
        const color4 = hasPlus4 ? '#c00' : (hasMinus4 ? '#008000' : '#000');
        {
            ctx.beginPath();
            ctx.moveTo(c4.inX, c4.inY);
            ctx.lineTo(c4.inX, c4.inY + 21);
            ctx.lineTo(c4.inX - 12, c4.inY + 21);
            ctx.strokeStyle = color4;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c4.outX, c4.outY);
            ctx.lineTo(c4.outX, c4.outY - 14);
            ctx.lineTo(c4.outX - 12, c4.outY - 14);
            ctx.strokeStyle = color4;
            ctx.lineWidth = 3;
            ctx.stroke();

            if (this.isActive) {
                ctx.beginPath();
                ctx.moveTo(c4.inX - 5, c4.inY + 14);
                ctx.lineTo(c4.inX - 12, c4.inY + 34);
                ctx.strokeStyle = color4;
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(c4.inX - 15, c4.inY + 26);
                ctx.lineTo(c4.inX, c4.inY + 26);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 7;
                ctx.stroke();
            }
        }

        // === Отрисовка контакта 5 (2919,699 → 2919,652) НО, ±, вертикальный
        const c5 = this.contact5;
        const hasPlus5 = plusPoints.has(`${c5.inX},${c5.inY}`);
        const hasMinus5 = minusPoints.has(`${c5.inX},${c5.inY}`);
        const color5 = hasPlus5 ? '#c00' : (hasMinus5 ? '#008000' : '#000');
        {
            ctx.beginPath();
            ctx.moveTo(c5.inX, c5.inY);
            ctx.lineTo(c5.inX, c5.inY - 21);
            ctx.lineTo(c5.inX -12, c5.inY - 21);
            ctx.strokeStyle = color5;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c5.outX, c5.outY);
            ctx.lineTo(c5.outX, c5.outY + 16);
            ctx.lineTo(c5.outX - 12, c5.outY + 16);
            ctx.strokeStyle = color5;
            ctx.lineWidth = 3;
            ctx.stroke();

            if (this.isActive) {
                ctx.beginPath();
                ctx.moveTo(c5.inX - 10, c5.inY - 21);
                ctx.lineTo(c5.inX - 5, c5.inY - 34);
                ctx.strokeStyle = color5;
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(c5.inX - 15, c5.inY - 26);
                ctx.lineTo(c5.inX, c5.inY - 26);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 7;
                ctx.stroke();
            }
        }

        // === Отрисовка контакта 6 (2938,699 → 2938,746) НО, ±, вертикальный
        const c6 = this.contact6;
        const hasPlus6 = plusPoints.has(`${c6.inX},${c6.inY}`);
        const hasMinus6 = minusPoints.has(`${c6.inX},${c6.inY}`);
        const color6 = hasPlus6 ? '#c00' : (hasMinus6 ? '#008000' : '#000');
        {
             ctx.beginPath();
             ctx.moveTo(c6.inX, c6.inY);
             ctx.lineTo(c6.inX, c6.inY + 21);
             ctx.lineTo(c6.inX - 12, c6.inY + 21);
             ctx.strokeStyle = color6;
             ctx.lineWidth = 3;
             ctx.stroke();

             ctx.beginPath();
             ctx.moveTo(c6.outX, c6.outY);
             ctx.lineTo(c6.outX, c6.outY - 14);
             ctx.lineTo(c6.outX - 12, c6.outY - 14);
             ctx.strokeStyle = color6;
             ctx.lineWidth = 3;
             ctx.stroke();

             if (this.isActive) {
                 ctx.beginPath();
                 ctx.moveTo(c6.inX - 5, c6.inY + 14);
                 ctx.lineTo(c6.inX - 12, c6.inY + 34);
                 ctx.strokeStyle = color6;
                 ctx.lineWidth = 3;
                 ctx.stroke();
            } else {
                 ctx.beginPath();
                 ctx.moveTo(c6.inX - 15, c6.inY + 26);
                 ctx.lineTo(c6.inX, c6.inY + 26);
                 ctx.strokeStyle = '#ffffff';
                 ctx.lineWidth = 7;
                 ctx.stroke();
             }
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(revForward);
window.animatedElements.push(revForward);
// =======================================================================================================================
// === РЕЛЕ РЕВЕРСОР НАЗАД ===
const revBackward = {
    coil: {
        inX: 746,
        inY: 253,
        outX: 756,
        outY: 253
    },
    contact1: { // НО, +
        inX: 614,
        inY: 253,
        outX: 586,
        outY: 254
    },
    contact2: { // НО, +
        inX: 441,
        inY: 2229,
        outX: 473,
        outY: 2229
    },
    contact3: { // НО, ±, двунаправленный
        inX: 2618,
        inY: 699,
        outX: 2618,
        outY: 747
    },
    contact4: { // НО, ±, двунаправленный
        inX: 2637,
        inY: 699,
        outX: 2637,
        outY: 652
    },
    contact5: { // НО, ±, двунаправленный
        inX: 2919,
        inY: 699,
        outX: 2919,
        outY: 747
    },
    contact6: { // НО, ±, двунаправленный
        inX: 2938,
        inY: 699,
        outX: 2938,
        outY: 652
    },
    isForcedOn: false,
    isPowered: false,
    isActive: false,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        requestRedraw();
    },

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        this.isPowered = hasPlus && hasMinus;
        this.isActive = this.isForcedOn || this.isPowered;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update(plusPoints, minusPoints);

        const rules = [];

        // Контакты 1 и 2 — НО по "+", замыкаются при ВКЛЮЧЕНИИ
        if (this.isActive) {
            rules.push(
                {
                    from: `${this.contact1.inX},${this.contact1.inY}`,
                    to: `${this.contact1.outX},${this.contact1.outY}`,
                    type: 'plus'
                },
                {
                    from: `${this.contact2.inX},${this.contact2.inY}`,
                    to: `${this.contact2.outX},${this.contact2.outY}`,
                    type: 'plus'
                }
            );
        }

        // Контакты 3-6 — двунаправленные, НО, пропускают + и -
        if (this.isActive) {
            const in3 = `${this.contact3.inX},${this.contact3.inY}`;
            const out3 = `${this.contact3.outX},${this.contact3.outY}`;
            const in4 = `${this.contact4.inX},${this.contact4.inY}`;
            const out4 = `${this.contact4.outX},${this.contact4.outY}`;
            const in5 = `${this.contact5.inX},${this.contact5.inY}`;
            const out5 = `${this.contact5.outX},${this.contact5.outY}`;
            const in6 = `${this.contact6.inX},${this.contact6.inY}`;
            const out6 = `${this.contact6.outX},${this.contact6.outY}`;

            const hasPlus3 = plusPoints.has(in3);
            const hasMinus3 = minusPoints.has(in3);
            const hasPlus4 = plusPoints.has(in4);
            const hasMinus4 = minusPoints.has(in4);
            const hasPlus5 = plusPoints.has(in5);
            const hasMinus5 = minusPoints.has(in5);
            const hasPlus6 = plusPoints.has(in6);
            const hasMinus6 = minusPoints.has(in6);

            if (hasPlus3) {
                rules.push({ from: in3, to: out3, type: 'plus' }, { from: out3, to: in3, type: 'plus' });
            }
            if (hasMinus3) {
                rules.push({ from: in3, to: out3, type: 'minus' }, { from: out3, to: in3, type: 'minus' });
            }
            if (hasPlus4) {
                rules.push({ from: in4, to: out4, type: 'plus' }, { from: out4, to: in4, type: 'plus' });
            }
            if (hasMinus4) {
                rules.push({ from: in4, to: out4, type: 'minus' }, { from: out4, to: in4, type: 'minus' });
            }
            if (hasPlus5) {
                rules.push({ from: in5, to: out5, type: 'plus' }, { from: out5, to: in5, type: 'plus' });
            }
            if (hasMinus5) {
                rules.push({ from: in5, to: out5, type: 'minus' }, { from: out5, to: in5, type: 'minus' });
            }
            if (hasPlus6) {
                rules.push({ from: in6, to: out6, type: 'plus' }, { from: out6, to: in6, type: 'plus' });
            }
            if (hasMinus6) {
                rules.push({ from: in6, to: out6, type: 'minus' }, { from: out6, to: in6, type: 'minus' });
            }
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // Отрисовка катушки
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = hasPlus && hasMinus;
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // === Отрисовка контакта 1 (614,253 → 586,254) НО, +
        const c1 = this.contact1;
        const hasInput1 = plusPoints.has(`${c1.inX},${c1.inY}`);
        {
            ctx.beginPath();
            ctx.moveTo(c1.inX, c1.inY);
            ctx.lineTo(c1.inX - 5, c1.inY);
            ctx.strokeStyle = hasInput1 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c1.outX, c1.outY);
            ctx.lineTo(c1.outX + 7, c1.outY);
            ctx.strokeStyle = hasInput1 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            if (this.isActive) {
                ctx.beginPath();
                ctx.moveTo(c1.inX, c1.inY);
                ctx.lineTo(c1.outX, c1.outY);
                ctx.strokeStyle = hasInput1 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(c1.inX - 7, c1.inY);
                ctx.lineTo(c1.outX + 7, c1.inY - 8);
                ctx.strokeStyle = hasInput1 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        }

        // === Отрисовка контакта 2 (439,2229 → 274,2229) НО, +
        const c2 = this.contact2;
        const hasInput2 = plusPoints.has(`${c2.inX},${c2.inY}`);
        {
            ctx.beginPath();
            ctx.moveTo(c2.inX, c2.inY);
            ctx.lineTo(c2.inX - 5, c2.inY);
            ctx.strokeStyle = hasInput2 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c2.outX, c2.outY);
            ctx.lineTo(c2.outX + 7, c2.outY);
            ctx.strokeStyle = hasInput2 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            if (this.isActive) {
                ctx.beginPath();
                ctx.moveTo(c2.inX, c2.inY);
                ctx.lineTo(c2.outX, c2.outY);
                ctx.strokeStyle = hasInput2 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(c2.inX -7, c2.inY);
                ctx.lineTo(c2.outX + 7, c2.inY -8);
                ctx.strokeStyle = hasInput2 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        }

        // === Отрисовка контакта 3 (2618,699 → 2618,747) НО, ±, вертикальный
        const c3 = this.contact3;
        const hasPlus3 = plusPoints.has(`${c3.inX},${c3.inY}`);
        const hasMinus3 = minusPoints.has(`${c3.inX},${c3.inY}`);
        const color3 = hasPlus3 ? '#c00' : (hasMinus3 ? '#008000' : '#000');
        {
            ctx.beginPath();
            ctx.moveTo(c3.inX, c3.inY);
            ctx.lineTo(c3.inX, c3.inY + 21);
            ctx.lineTo(c3.inX - 12, c3.inY + 21);
            ctx.strokeStyle = color3;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c3.outX, c3.outY);
            ctx.lineTo(c3.outX, c3.outY - 14);
            ctx.lineTo(c3.outX - 12, c3.outY - 14);
            ctx.strokeStyle = color3;
            ctx.lineWidth = 3;
            ctx.stroke();

            if (this.isActive) {
                ctx.beginPath();
                ctx.moveTo(c3.inX - 5, c3.inY + 14);
                ctx.lineTo(c3.inX - 12, c3.inY + 34);
                ctx.strokeStyle = color3;
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(c3.inX - 15, c3.inY + 26);
                ctx.lineTo(c3.inX, c3.inY + 26);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 7;
                ctx.stroke();
            }
        }

        // === Отрисовка контакта 4 (2637,699 → 2637,652) НО, ±, вертикальный
        const c4 = this.contact4;
        const hasPlus4 = plusPoints.has(`${c4.inX},${c4.inY}`);
        const hasMinus4 = minusPoints.has(`${c4.inX},${c4.inY}`);
        const color4 = hasPlus4 ? '#c00' : (hasMinus4 ? '#008000' : '#000');
        {
            ctx.beginPath();
            ctx.moveTo(c4.inX, c4.inY);
            ctx.lineTo(c4.inX, c4.inY - 21);
            ctx.lineTo(c4.inX - 12, c4.inY - 21);
            ctx.strokeStyle = color4;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c4.outX, c4.outY);
            ctx.lineTo(c4.outX, c4.outY + 16);
            ctx.lineTo(c4.outX - 12, c4.outY + 16);
            ctx.strokeStyle = color4;
            ctx.lineWidth = 3;
            ctx.stroke();

            if (this.isActive) {
                ctx.beginPath();
                ctx.moveTo(c4.inX - 10, c4.inY - 21);
                ctx.lineTo(c4.inX - 5, c4.inY - 34);
                ctx.strokeStyle = color4;
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(c4.inX - 15, c4.inY - 26);
                ctx.lineTo(c4.inX, c4.inY - 26);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 7;
                ctx.stroke();
            }
        }

        // === Отрисовка контакта 5 (2919,699 → 2919,747) НО, ±, вертикальный
        const c5 = this.contact5;
        const hasPlus5 = plusPoints.has(`${c5.inX},${c5.inY}`);
        const hasMinus5 = minusPoints.has(`${c5.inX},${c5.inY}`);
        const color5 = hasPlus5 ? '#c00' : (hasMinus5 ? '#008000' : '#000');
        {
            ctx.beginPath();
            ctx.moveTo(c5.inX, c5.inY);
            ctx.lineTo(c5.inX, c5.inY + 21);
            ctx.lineTo(c5.inX - 12, c5.inY + 21);
            ctx.strokeStyle = color5;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c5.outX, c5.outY);
            ctx.lineTo(c5.outX, c5.outY - 14);
            ctx.lineTo(c5.outX - 12, c5.outY - 14);
            ctx.strokeStyle = color5;
            ctx.lineWidth = 3;
            ctx.stroke();

            if (this.isActive) {
                ctx.beginPath();
                ctx.moveTo(c5.inX - 5, c5.inY + 14);
                ctx.lineTo(c5.inX - 12, c5.inY + 34);
                ctx.strokeStyle = color5;
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(c5.inX - 15, c5.inY + 26);
                ctx.lineTo(c5.inX, c5.inY + 26);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 7;
                ctx.stroke();
            }
        }

        // === Отрисовка контакта 6 (2938,699 → 2938,652) НО, ±, вертикальный
        const c6 = this.contact6;
        const hasPlus6 = plusPoints.has(`${c6.inX},${c6.inY}`);
        const hasMinus6 = minusPoints.has(`${c6.inX},${c6.inY}`);
        const color6 = hasPlus6 ? '#c00' : (hasMinus6 ? '#008000' : '#000');
        {
            ctx.beginPath();
            ctx.moveTo(c6.inX, c6.inY);
            ctx.lineTo(c6.inX, c6.inY - 21);
            ctx.lineTo(c6.inX - 12, c6.inY - 21);
            ctx.strokeStyle = color6;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c6.outX, c6.outY);
            ctx.lineTo(c6.outX, c6.outY + 16);
            ctx.lineTo(c6.outX - 12, c6.outY + 16);
            ctx.strokeStyle = color6;
            ctx.lineWidth = 3;
            ctx.stroke();

            if (this.isActive) {
                ctx.beginPath();
                ctx.moveTo(c6.inX - 10, c6.inY - 21);
                ctx.lineTo(c6.inX - 5, c6.inY - 34);
                ctx.strokeStyle = color6;
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(c6.inX - 15, c6.inY - 26);
                ctx.lineTo(c6.inX, c6.inY - 26);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 7;
                ctx.stroke();
            }
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(revBackward);
window.animatedElements.push(revBackward);
// =====================================================================================================================

// =====================================================================================================================

// ====================================================================================================================
// === РЕЛЕ РКВ (обновлённое) ===
const rkv = {
    coil: {
        inX: 758,
        inY: 565,
        outX: 768,
        outY: 565
    },
    contactNO_Minus: { // НО контакт (по "-")
        inX: 800,
        inY: 227,
        outX: 825,
        outY: 227
    },
    contactNO_Plus: { // НО контакт (по "+")
        inX: 1753,
        inY: 592,
        outX: 1786,
        outY: 592
    },
    isForcedOn: false,
    isPowered: false,
    isActive: false,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        requestRedraw();
    },

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        this.isPowered = hasPlus && hasMinus;
        this.isActive = this.isForcedOn || this.isPowered;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update(plusPoints, minusPoints);

        const rules = [];

        // === Двунаправленный пропуск "-" на НО контакте (800,227 ⇄ 825,227) ===
        if (this.isActive) {
            const inPoint = `${this.contactNO_Minus.inX},${this.contactNO_Minus.inY}`;
            const outPoint = `${this.contactNO_Minus.outX},${this.contactNO_Minus.outY}`;

            // Проверяем, есть ли минус на входе или выходе — если да, распространяем в обе стороны
            const hasMinusIn = minusPoints.has(inPoint);
            const hasMinusOut = minusPoints.has(outPoint);

            if (hasMinusIn) {
                rules.push(
                    { from: inPoint, to: outPoint, type: 'minus' },
                    { from: outPoint, to: inPoint, type: 'minus' }  // двунаправленный
                );
            }
            if (hasMinusOut && !hasMinusIn) {
                rules.push(
                    { from: outPoint, to: inPoint, type: 'minus' },
                    { from: inPoint, to: outPoint, type: 'minus' }  // двунаправленный
                );
            }
        }

        // === Пропуск "+" на НО контакте (1753,592 → 1786,592) — как раньше (однонаправленный) ===
        if (this.isActive) {
            rules.push({
                from: `${this.contactNO_Plus.inX},${this.contactNO_Plus.inY}`,
                to: `${this.contactNO_Plus.outX},${this.contactNO_Plus.outY}`,
                type: 'plus'
            });
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // Отрисовка катушки
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = hasPlus && hasMinus;
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // === Отрисовка НО контакта по "-" (800,227 → 825,227) — как у П1, но с двунаправленной логикой
        const cNOm = this.contactNO_Minus;
        const hasInputNOm = minusPoints.has(`${cNOm.inX},${cNOm.inY}`);
        const colorNOm = hasInputNOm ? '#008000' : '#000';

        ctx.beginPath();
        ctx.moveTo(cNOm.inX, cNOm.inY);
        ctx.lineTo(cNOm.inX + 10, cNOm.inY);
        ctx.strokeStyle = colorNOm;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isActive) {
            // Замкнут — зелёная линия
            ctx.beginPath();
            ctx.moveTo(cNOm.inX + 10, cNOm.inY);
            ctx.lineTo(cNOm.outX, cNOm.outY);
            ctx.strokeStyle = colorNOm;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнут — белая полоса + косая линия
            ctx.beginPath();
            ctx.moveTo(cNOm.inX + 10, cNOm.inY);
            ctx.lineTo(cNOm.outX, cNOm.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cNOm.outX, cNOm.outY);
            ctx.lineTo(cNOm.outX - 18, cNOm.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // === Отрисовка НО контакта по "+" (1753,592 → 1786,592)
        const cNOp = this.contactNO_Plus;
        const hasInputNOp = plusPoints.has(`${cNOp.inX},${cNOp.inY}`);

        ctx.beginPath();
        ctx.moveTo(cNOp.inX, cNOp.inY);
        ctx.lineTo(cNOp.inX + 10, cNOp.inY);
        ctx.strokeStyle = hasInputNOp ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isActive) {
            ctx.beginPath();
            ctx.moveTo(cNOp.inX + 10, cNOp.inY);
            ctx.lineTo(cNOp.outX, cNOp.outY);
            ctx.strokeStyle = hasInputNOp ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(cNOp.inX + 10, cNOp.inY);
            ctx.lineTo(cNOp.outX, cNOp.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cNOp.outX, cNOp.outY);
            ctx.lineTo(cNOp.outX - 18, cNOp.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(rkv);
window.animatedElements.push(rkv);
// =====================================================================================================================
// === РЕЛЕ П1 (обновлённое) ===
const p1 = {
    coil: {
        inX: 763,
        inY: 378,
        outX: 773,
        outY: 378
    },
    contactNC_Minus: {
        inX: 830,
        inY: 355,
        outX: 830,
        outY: 325
    },
    contactNO_Plus: { // НО контакт по "+"
        inX: 143,
        inY: 530,
        outX: 173,
        outY: 530
    },
    contactNO_Plus_Vertical: { // НО контакт по "+", вертикальный (2601,252 → 2601,291)
        inX: 2601,
        inY: 252,
        outX: 2601,
        outY: 291
    },
    isForcedOn: false,
    lastPowered: false,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        requestRedraw();
    },

    getState(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        return this.isForcedOn || (hasPlus && hasMinus);
    },

    update(plusPoints, minusPoints) {
        const isPowered = this.getState(plusPoints, minusPoints);
        this.lastPowered = isPowered;
    },

    getPropagationRules(plusPoints, minusPoints) {
        const isPowered = this.getState(plusPoints, minusPoints);
        const inPoint = `${this.contactNC_Minus.inX},${this.contactNC_Minus.inY}`;
        const outPoint = `${this.contactNC_Minus.outX},${this.contactNC_Minus.outY}`;

        const rules = [];

        // НЗ контакт по минусу — пропускает при ОТКЛЮЧЕНИИ
        if (!isPowered) {
            if (minusPoints.has(inPoint) || minusPoints.has(outPoint)) {
                rules.push(
                    { from: inPoint, to: outPoint, type: 'minus' },
                    { from: outPoint, to: inPoint, type: 'minus' }
                );
            }
        }

        // НО контакт по плюсу — пропускает при ВКЛЮЧЕНИИ
        if (isPowered) {
            rules.push({
                from: `${this.contactNO_Plus.inX},${this.contactNO_Plus.inY}`,
                to: `${this.contactNO_Plus.outX},${this.contactNO_Plus.outY}`,
                type: 'plus'
            });

            // НО вертикальный контакт — плюс (2601,252 → 2601,291)
            rules.push({
                from: `${this.contactNO_Plus_Vertical.inX},${this.contactNO_Plus_Vertical.inY}`,
                to: `${this.contactNO_Plus_Vertical.outX},${this.contactNO_Plus_Vertical.outY}`,
                type: 'plus'
            });
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = this.isForcedOn || (hasPlus && hasMinus);

        // Отрисовка катушки
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');
        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // === Отрисовка НЗ контакта по "-" (830,355 → 830,325) ===
        const nc = this.contactNC_Minus;
        const hasMinusContact = minusPoints.has(`${nc.inX},${nc.inY}`) || minusPoints.has(`${nc.outX},${nc.outY}`);
        const color = hasMinusContact ? '#008000' : '#000';

        ctx.beginPath();
        ctx.moveTo(nc.inX, nc.inY);
        ctx.lineTo(nc.inX, nc.inY - 8);
        ctx.lineTo(nc.inX + 14, nc.inY - 8);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(nc.outX, nc.outY);
        ctx.lineTo(nc.outX, nc.outY + 8);
        ctx.lineTo(nc.outX + 16, nc.outY + 8);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!isPowered) {
            ctx.beginPath();
            ctx.moveTo(nc.inX + 10, nc.inY - 8);
            ctx.lineTo(nc.outX + 16, nc.outY + 5);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(nc.inX + 16, nc.inY);
            ctx.lineTo(nc.inX + 16, nc.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 8;
            ctx.stroke();
        }

        // === Отрисовка НО контакта по "+" (143,530 → 173,530) ===
        const no = this.contactNO_Plus;
        const hasInput = plusPoints.has(`${no.inX},${no.inY}`);

        ctx.beginPath();
        ctx.moveTo(no.inX, no.inY);
        ctx.lineTo(no.inX + 10, no.inY);
        ctx.strokeStyle = hasInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isPowered) {
            ctx.beginPath();
            ctx.moveTo(no.inX + 10, no.inY);
            ctx.lineTo(no.outX, no.outY);
            ctx.strokeStyle = hasInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(no.inX + 10, no.inY);
            ctx.lineTo(no.outX, no.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(no.outX, no.outY);
            ctx.lineTo(no.outX - 18, no.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // === Отрисовка НО вертикального контакта по "+" (2601,252 → 2601,291) ===
        const noVert = this.contactNO_Plus_Vertical;
        const hasInputVert = plusPoints.has(`${noVert.inX},${noVert.inY}`);

        ctx.beginPath();
        ctx.moveTo(noVert.inX, noVert.inY);
        ctx.lineTo(noVert.inX, noVert.inY + 10);
        ctx.lineTo(noVert.inX - 12, noVert.inY + 10);
        ctx.strokeStyle = hasInputVert ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(noVert.outX, noVert.outY);
        ctx.lineTo(noVert.outX, noVert.outY - 10);
        ctx.lineTo(noVert.outX - 12, noVert.outY - 10);
        ctx.strokeStyle = hasInputVert ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isPowered) {
            ctx.beginPath();
            ctx.moveTo(noVert.inX - 10, noVert.inY + 10);
            ctx.lineTo(noVert.inX - 5, noVert.inY + 23);
            ctx.strokeStyle = hasInputVert ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(noVert.inX - 15, noVert.inY + 15);
            ctx.lineTo(noVert.inX, noVert.inY + 15);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(p1);
window.animatedElements.push(p1);
// ========================================================================================================================
// === РЕЛЕ П2 (обновлённое) ===
const p2 = {
    coil: {
        inX: 779,
        inY: 406,
        outX: 789,
        outY: 406
    },
    contactNC_Minus: {
        inX: 831,
        inY: 304,
        outX: 831,
        outY: 277
    },
    contactNO_Plus: {
        inX: 211,
        inY: 530,
        outX: 245,
        outY: 530
    },
    contactNO_Plus_Vertical: { // НО контакт по "+", вертикальный (2901,252 → 2901,291)
        inX: 2901,
        inY: 252,
        outX: 2901,
        outY: 291
    },
    isForcedOn: false,
    isPowered: false,
    isActive: false,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        requestRedraw();
    },

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        this.isPowered = hasPlus && hasMinus;
        this.isActive = this.isForcedOn || this.isPowered;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update(plusPoints, minusPoints);

        const rules = [];

        // === НЗ контакт по "-" (831,304 ⇄ 831,277) — замыкается при ОТКЛЮЧЕНИИ реле ===
        if (!this.isActive) {
            const inPoint = `${this.contactNC_Minus.inX},${this.contactNC_Minus.inY}`;
            const outPoint = `${this.contactNC_Minus.outX},${this.contactNC_Minus.outY}`;
            const hasMinusIn = minusPoints.has(inPoint);
            const hasMinusOut = minusPoints.has(outPoint);

            if (hasMinusIn) {
                rules.push(
                    { from: inPoint, to: outPoint, type: 'minus' },
                    { from: outPoint, to: inPoint, type: 'minus' }
                );
            }
            if (hasMinusOut && !hasMinusIn) {
                rules.push(
                    { from: outPoint, to: inPoint, type: 'minus' },
                    { from: inPoint, to: outPoint, type: 'minus' }
                );
            }
        }

        // === НО контакт по "+" (211,530 → 245,530) — замыкается при ВКЛЮЧЕНИИ реле ===
        if (this.isActive) {
            rules.push({
                from: `${this.contactNO_Plus.inX},${this.contactNO_Plus.inY}`,
                to: `${this.contactNO_Plus.outX},${this.contactNO_Plus.outY}`,
                type: 'plus'
            });

            // НО вертикальный контакт — плюс (2901,252 → 2901,291)
            rules.push({
                from: `${this.contactNO_Plus_Vertical.inX},${this.contactNO_Plus_Vertical.inY}`,
                to: `${this.contactNO_Plus_Vertical.outX},${this.contactNO_Plus_Vertical.outY}`,
                type: 'plus'
            });
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // Отрисовка катушки
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = hasPlus && hasMinus;
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // === Отрисовка НЗ контакта по "-" (831,304 → 831,277) ===
        const cNCm = this.contactNC_Minus;
        const hasMinusContact = minusPoints.has(`${cNCm.inX},${cNCm.inY}`) || minusPoints.has(`${cNCm.outX},${cNCm.outY}`);
        const color = hasMinusContact ? '#008000' : '#000';

        ctx.beginPath();
        ctx.moveTo(cNCm.inX, cNCm.inY);
        ctx.lineTo(cNCm.inX, cNCm.inY - 8);
        ctx.lineTo(cNCm.inX + 14, cNCm.inY - 8);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cNCm.outX, cNCm.outY);
        ctx.lineTo(cNCm.outX, cNCm.outY + 8);
        ctx.lineTo(cNCm.outX + 16, cNCm.outY + 8);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!this.isActive) {
            ctx.beginPath();
            ctx.moveTo(cNCm.inX + 10, cNCm.inY - 8);
            ctx.lineTo(cNCm.outX + 16, cNCm.outY + 5);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(cNCm.inX + 16, cNCm.inY);
            ctx.lineTo(cNCm.inX + 16, cNCm.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 8;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cNCm.inX + 16, cNCm.inY);
            ctx.lineTo(cNCm.inX + 22, cNCm.inY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // === Отрисовка НО контакта по "+" (211,530 → 245,530) ===
        const cNOp = this.contactNO_Plus;
        const hasInput = plusPoints.has(`${cNOp.inX},${cNOp.inY}`);

        ctx.beginPath();
        ctx.moveTo(cNOp.inX, cNOp.inY);
        ctx.lineTo(cNOp.inX + 10, cNOp.inY);
        ctx.strokeStyle = hasInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isActive) {
            ctx.beginPath();
            ctx.moveTo(cNOp.inX + 10, cNOp.inY);
            ctx.lineTo(cNOp.outX, cNOp.outY);
            ctx.strokeStyle = hasInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(cNOp.inX + 10, cNOp.inY);
            ctx.lineTo(cNOp.outX, cNOp.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cNOp.outX, cNOp.outY);
            ctx.lineTo(cNOp.outX - 18, cNOp.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // === Отрисовка НО вертикального контакта по "+" (2901,252 → 2901,291) ===
        const noVert = this.contactNO_Plus_Vertical;
        const hasInputVert = plusPoints.has(`${noVert.inX},${noVert.inY}`);

        ctx.beginPath();
        ctx.moveTo(noVert.inX, noVert.inY);
        ctx.lineTo(noVert.inX, noVert.inY + 10);
        ctx.lineTo(noVert.inX - 12, noVert.inY + 10);
        ctx.strokeStyle = hasInputVert ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(noVert.outX, noVert.outY);
        ctx.lineTo(noVert.outX, noVert.outY - 10);
        ctx.lineTo(noVert.outX - 12, noVert.outY - 10);
        ctx.strokeStyle = hasInputVert ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isActive) {
            ctx.beginPath();
            ctx.moveTo(noVert.inX - 10, noVert.inY + 10);
            ctx.lineTo(noVert.inX - 5, noVert.inY + 23);
            ctx.strokeStyle = hasInputVert ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(noVert.inX - 15, noVert.inY + 15);
            ctx.lineTo(noVert.inX, noVert.inY + 15);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(p2);
window.animatedElements.push(p2);
// ========================================================================================================================
// === РЕЛЕ РЭТ ===
const ret = {
    coil: {
        inX: 811,
        inY: 685,
        outX: 821,
        outY: 685
    },
    contactNC: { // Нормально замкнутый контакт
        inX: 279,
        inY: 420,
        outX: 302,
        outY: 420
    },
    isForcedOn: false,
    isPowered: false,
    isActive: false,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        requestRedraw();
    },

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        this.isPowered = hasPlus && hasMinus;
        this.isActive = this.isForcedOn || this.isPowered;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update(plusPoints, minusPoints);

        const rules = [];

        // НЗ контакт — пропускает напряжение, когда реле НЕ активно
        if (!this.isActive) {
            const inPoint = `${this.contactNC.inX},${this.contactNC.inY}`;
            const outPoint = `${this.contactNC.outX},${this.contactNC.outY}`;
            const hasPlusIn = plusPoints.has(inPoint);

            if (hasPlusIn) {
                rules.push({
                    from: inPoint,
                    to: outPoint,
                    type: 'plus'
                });
            }
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // Отрисовка катушки
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = hasPlus && hasMinus;
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // === Отрисовка НЗ контакта (279,420 → 302,420) ===
        const c = this.contactNC;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);
        const color = hasInput ? '#c00' : '#000';

        // Вход (горизонтальная линия)
        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 6, c.inY);
        ctx.lineTo(c.inX + 6, c.inY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Выход
        ctx.beginPath();
        ctx.moveTo(c.outX, c.outY);
        ctx.lineTo(c.outX - 6, c.outY);
        ctx.lineTo(c.outX - 6, c.outY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!this.isActive) {
            // Замкнут — соединяем
            ctx.beginPath();
            ctx.moveTo(c.inX + 6, c.inY + 2);
            ctx.lineTo(c.outX - 6, c.outY + 10);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнут — белая полоса
            ctx.beginPath();
            ctx.moveTo(c.inX + 12, c.inY);
            ctx.lineTo(c.inX + 12, c.inY + 15);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(ret);
window.animatedElements.push(ret);
// ========================================================================================================================
// === РЕЛЕ РУ15 ===
const ru15 = {
    coil: {
        inX: 1135,
        inY: 1269,
        outX: 1145,
        outY: 1269
    },
    contactNC: { // Нормально замкнутый контакт
        inX: 314,
        inY: 420,
        outX: 338,
        outY: 420
    },
    isForcedOn: false,
    isPowered: false,
    isActive: false,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        requestRedraw();
    },

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        this.isPowered = hasPlus && hasMinus;
        this.isActive = this.isForcedOn || this.isPowered;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update(plusPoints, minusPoints);

        const rules = [];

        // НЗ контакт — пропускает "+", когда реле НЕ активно
        if (!this.isActive) {
            const inPoint = `${this.contactNC.inX},${this.contactNC.inY}`;
            const outPoint = `${this.contactNC.outX},${this.contactNC.outY}`;
            const hasPlusIn = plusPoints.has(inPoint);

            if (hasPlusIn) {
                rules.push({
                    from: inPoint,
                    to: outPoint,
                    type: 'plus'
                });
            }
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // Отрисовка катушки
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = hasPlus && hasMinus;
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // === Отрисовка НЗ контакта (314,420 → 338,420) ===
        const c = this.contactNC;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);
        const color = hasInput ? '#c00' : '#000';

        // Вход (горизонтальная линия)
        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 6, c.inY);
        ctx.lineTo(c.inX + 6, c.inY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Выход
        ctx.beginPath();
        ctx.moveTo(c.outX, c.outY);
        ctx.lineTo(c.outX - 6, c.outY);
        ctx.lineTo(c.outX - 6, c.outY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!this.isActive) {
            // Замкнут — соединяем
            ctx.beginPath();
            ctx.moveTo(c.inX + 6, c.inY + 2);
            ctx.lineTo(c.outX - 6, c.outY + 10);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнут — белая полоса
            ctx.beginPath();
            ctx.moveTo(c.inX + 12, c.inY);
            ctx.lineTo(c.inX + 12, c.inY + 15);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(ru15);
window.animatedElements.push(ru15);
// ========================================================================================================================
// === ВЫКЛЮЧАТЕЛИ БК1, БК2, БК3 (нормально замкнутые, но по умолчанию включены) ===
const bk1 = {
    inX: 176,
    inY: 470,
    outX: 201,
    outY: 470,
    isClosed: true, // по умолчанию — включён (замкнут)

    isClickable(x, y) {
        return x >= this.inX && x <= this.outX &&
               y >= this.inY - 10 && y <= this.inY + 10;
    },

    onClick() {
        this.isClosed = !this.isClosed;
        requestRedraw();
    },

    getPropagationRules(plusPoints, minusPoints) {
        const rules = [];
        if (this.isClosed) {
            const inPoint = `${this.inX},${this.inY}`;
            const outPoint = `${this.outX},${this.outY}`;
            if (plusPoints.has(inPoint)) {
                rules.push({ from: inPoint, to: outPoint, type: 'plus' });
            }
        }
        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints } = networks;
        const hasInput = plusPoints.has(`${this.inX},${this.inY}`);
        const color = hasInput ? '#c00' : '#000';

        // Линия входа
        ctx.beginPath();
        ctx.moveTo(this.inX, this.inY);
        ctx.lineTo(this.inX + 8, this.inY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isClosed) {
            // Замкнут — соединяем вход и выход
            ctx.beginPath();
            ctx.moveTo(this.inX + 8, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнут — белая полоса + косая линия
            ctx.beginPath();
            ctx.moveTo(this.inX + 8, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.outX, this.outY);
            ctx.lineTo(this.outX - 18, this.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

const bk2 = {
    inX: 227,
    inY: 470,
    outX: 250,
    outY: 470,
    isClosed: true,

    isClickable(x, y) {
        return x >= this.inX && x <= this.outX &&
               y >= this.inY - 10 && y <= this.inY + 10;
    },

    onClick() {
        this.isClosed = !this.isClosed;
        requestRedraw();
    },

    getPropagationRules(plusPoints, minusPoints) {
        const rules = [];
        if (this.isClosed) {
            const inPoint = `${this.inX},${this.inY}`;
            const outPoint = `${this.outX},${this.outY}`;
            if (plusPoints.has(inPoint)) {
                rules.push({ from: inPoint, to: outPoint, type: 'plus' });
            }
        }
        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints } = networks;
        const hasInput = plusPoints.has(`${this.inX},${this.inY}`);
        const color = hasInput ? '#c00' : '#000';

        ctx.beginPath();
        ctx.moveTo(this.inX, this.inY);
        ctx.lineTo(this.inX + 8, this.inY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isClosed) {
            ctx.beginPath();
            ctx.moveTo(this.inX + 8, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.inX + 8, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.outX, this.outY);
            ctx.lineTo(this.outX - 18, this.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

const bk3 = {
    inX: 277,
    inY: 470,
    outX: 307,
    outY: 470,
    isClosed: true,

    isClickable(x, y) {
        return x >= this.inX && x <= this.outX &&
               y >= this.inY - 10 && y <= this.inY + 10;
    },

    onClick() {
        this.isClosed = !this.isClosed;
        requestRedraw();
    },

    getPropagationRules(plusPoints, minusPoints) {
        const rules = [];
        if (this.isClosed) {
            const inPoint = `${this.inX},${this.inY}`;
            const outPoint = `${this.outX},${this.outY}`;
            if (plusPoints.has(inPoint)) {
                rules.push({ from: inPoint, to: outPoint, type: 'plus' });
            }
        }
        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints } = networks;
        const hasInput = plusPoints.has(`${this.inX},${this.inY}`);
        const color = hasInput ? '#c00' : '#000';

        ctx.beginPath();
        ctx.moveTo(this.inX, this.inY);
        ctx.lineTo(this.inX + 8, this.inY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isClosed) {
            ctx.beginPath();
            ctx.moveTo(this.inX + 8, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.inX + 8, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.outX, this.outY);
            ctx.lineTo(this.outX - 18, this.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(bk1, bk2, bk3);
window.animatedElements.push(bk1, bk2, bk3);
// ========================================================================================================================
// === РЕЛЕ РУ2 (полностью переписанное) ===
const ru2 = {
    coil: {
        inX: 750,
        inY: 716,
        outX: 760,
        outY: 716
    },
    contactNC_Minus: { // НЗ контакт по минусу (770,2410 → 806,2410)
        inX: 770,
        inY: 2410,
        outX: 806,
        outY: 2410
    },
    contactNC_Plus: { // НЗ контакт по плюсу (409,470 → 435,470)
        inX: 409,
        inY: 470,
        outX: 435,
        outY: 470
    },
    contactNO_Plus: { // НО контакт по плюсу (1503,632 → 1530,632)
        inX: 1503,
        inY: 632,
        outX: 1530,
        outY: 632
    },
    contactNO_New: { // НО контакт (новый): 2484,1999 → 2511,1999
        inX: 2484,
        inY: 1999,
        outX: 2511,
        outY: 1999
    },
    isForcedOn: false,
    isPowered: false,
    isActive: false,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        requestRedraw();
    },

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        this.isPowered = hasPlus && hasMinus;
        this.isActive = this.isForcedOn || this.isPowered;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update(plusPoints, minusPoints);

        const rules = [];

        // === НЗ контакт по "-" (770,2410 ⇄ 806,2410) — замыкается при ОТКЛЮЧЕНИИ реле ===
        if (!this.isActive) {
            const inPoint = `${this.contactNC_Minus.inX},${this.contactNC_Minus.inY}`;
            const outPoint = `${this.contactNC_Minus.outX},${this.contactNC_Minus.outY}`;
            const hasMinusIn = minusPoints.has(inPoint);
            const hasMinusOut = minusPoints.has(outPoint);

            if (hasMinusIn) {
                rules.push(
                    { from: inPoint, to: outPoint, type: 'minus' },
                    { from: outPoint, to: inPoint, type: 'minus' }
                );
            }
            if (hasMinusOut && !hasMinusIn) {
                rules.push(
                    { from: outPoint, to: inPoint, type: 'minus' },
                    { from: inPoint, to: outPoint, type: 'minus' }
                );
            }
        }

        // === НЗ контакт по "+" (409,470 → 435,470) — замыкается при ОТКЛЮЧЕНИИ реле ===
        if (!this.isActive) {
            const inPoint = `${this.contactNC_Plus.inX},${this.contactNC_Plus.inY}`;
            const outPoint = `${this.contactNC_Plus.outX},${this.contactNC_Plus.outY}`;
            const hasPlusIn = plusPoints.has(inPoint);

            if (hasPlusIn) {
                rules.push({
                    from: inPoint,
                    to: outPoint,
                    type: 'plus'
                });
            }
        }

        // === НО контакт по "+" (1503,632 → 1530,632) — замыкается при ВКЛЮЧЕНИИ реле ===
        if (this.isActive) {
            const inPoint = `${this.contactNO_Plus.inX},${this.contactNO_Plus.inY}`;
            const outPoint = `${this.contactNO_Plus.outX},${this.contactNO_Plus.outY}`;
            const hasPlusIn = plusPoints.has(inPoint);

            if (hasPlusIn) {
                rules.push({
                    from: inPoint,
                    to: outPoint,
                    type: 'plus'
                });
            }
        }

        // === НО контакт (новый): 2484,1999 → 2511,1999 ===
        if (this.isActive) {
            const inPoint = `${this.contactNO_New.inX},${this.contactNO_New.inY}`;
            const outPoint = `${this.contactNO_New.outX},${this.contactNO_New.outY}`;
            const hasPlusIn = plusPoints.has(inPoint);

            if (hasPlusIn) {
                rules.push({
                    from: inPoint,
                    to: outPoint,
                    type: 'plus'
                });
            }
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // Отрисовка катушки
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = hasPlus && hasMinus;
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // === Отрисовка НЗ контакта по "-" (770,2410 → 806,2410) ===
        const cNCm = this.contactNC_Minus;
        const hasMinusContact = minusPoints.has(`${cNCm.inX},${cNCm.inY}`) || minusPoints.has(`${cNCm.outX},${cNCm.outY}`);
        const color = hasMinusContact ? '#008000' : '#000';

        ctx.beginPath();
        ctx.moveTo(cNCm.inX, cNCm.inY);
        ctx.lineTo(cNCm.inX + 6, cNCm.inY);
        ctx.lineTo(cNCm.inX + 6, cNCm.inY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cNCm.outX, cNCm.outY);
        ctx.lineTo(cNCm.outX - 6, cNCm.outY);
        ctx.lineTo(cNCm.outX - 6, cNCm.outY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!this.isActive) {
            ctx.beginPath();
            ctx.moveTo(cNCm.inX + 6, cNCm.inY + 2);
            ctx.lineTo(cNCm.outX - 6, cNCm.outY + 10);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(cNCm.inX + 12, cNCm.inY);
            ctx.lineTo(cNCm.inX + 12, cNCm.inY + 15);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }

        // === Отрисовка НЗ контакта по "+" (409,470 → 435,470) ===
        const cNCp = this.contactNC_Plus;
        const hasInput = plusPoints.has(`${cNCp.inX},${cNCp.inY}`);
        const colorNCp = hasInput ? '#c00' : '#000';

        ctx.beginPath();
        ctx.moveTo(cNCp.inX, cNCp.inY);
        ctx.lineTo(cNCp.inX + 6, cNCp.inY);
        ctx.lineTo(cNCp.inX + 6, cNCp.inY + 12);
        ctx.strokeStyle = colorNCp;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cNCp.outX, cNCp.outY);
        ctx.lineTo(cNCp.outX - 6, cNCp.outY);
        ctx.lineTo(cNCp.outX - 6, cNCp.outY + 12);
        ctx.strokeStyle = colorNCp;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!this.isActive) {
            ctx.beginPath();
            ctx.moveTo(cNCp.inX + 6, cNCp.inY + 2);
            ctx.lineTo(cNCp.outX - 6, cNCp.outY + 10);
            ctx.strokeStyle = colorNCp;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(cNCp.inX + 12, cNCp.inY);
            ctx.lineTo(cNCp.inX + 12, cNCp.inY + 15);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }

        // === Отрисовка НО контакта по "+" (1503,632 → 1530,632) ===
        const cNOp = this.contactNO_Plus;
        const hasInputNOp = plusPoints.has(`${cNOp.inX},${cNOp.inY}`);
        const colorNOp = hasInputNOp ? '#c00' : '#000';

        ctx.beginPath();
        ctx.moveTo(cNOp.inX, cNOp.inY);
        ctx.lineTo(cNOp.inX + 8, cNOp.inY);
        ctx.strokeStyle = colorNOp;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isActive) {
            ctx.beginPath();
            ctx.moveTo(cNOp.inX + 8, cNOp.inY);
            ctx.lineTo(cNOp.outX, cNOp.outY);
            ctx.strokeStyle = colorNOp;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(cNOp.inX + 8, cNOp.inY);
            ctx.lineTo(cNOp.outX, cNOp.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cNOp.outX, cNOp.outY);
            ctx.lineTo(cNOp.outX - 18, cNOp.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // === Отрисовка нового НО контакта (2484,1999 → 2511,1999) ===
        const cNew = this.contactNO_New;
        const hasInputNew = plusPoints.has(`${cNew.inX},${cNew.inY}`);
        const colorNew = hasInputNew ? '#c00' : '#000';

        // Вход (левая часть)
        ctx.beginPath();
        ctx.moveTo(cNew.inX, cNew.inY);
        ctx.lineTo(cNew.inX + 8, cNew.inY);
        ctx.strokeStyle = colorNew;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Выход (правая часть)
        ctx.beginPath();
        ctx.moveTo(cNew.outX, cNew.outY);
        ctx.lineTo(cNew.outX - 8, cNew.outY);
        ctx.strokeStyle = colorNew;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isActive) {
            // Замкнут — соединяем
            ctx.beginPath();
            ctx.moveTo(cNew.inX + 8, cNew.inY);
            ctx.lineTo(cNew.outX, cNew.outY);
            ctx.strokeStyle = colorNew;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнут — белая полоса + косая
            ctx.beginPath();
            ctx.moveTo(cNew.inX + 8, cNew.inY);
            ctx.lineTo(cNew.outX, cNew.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cNew.outX, cNew.outY);
            ctx.lineTo(cNew.outX - 18, cNew.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(ru2);
window.animatedElements.push(ru2);
// ========================================================================================================================
// === РЕЛЕ КВТ1 ===
const kvt1 = {
    coil: {
        inX: 674,
        inY: 808,
        outX: 684,
        outY: 808
    },
    contactNC: { // Нормально замкнутый контакт
        inX: 500,
        inY: 470,
        outX: 524,
        outY: 470
    },
    isForcedOn: false,
    isPowered: false,
    isActive: false,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        requestRedraw();
    },

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        this.isPowered = hasPlus && hasMinus;
        this.isActive = this.isForcedOn || this.isPowered;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update(plusPoints, minusPoints);

        const rules = [];

        // НЗ контакт — пропускает "+", когда реле НЕ активно
        if (!this.isActive) {
            const inPoint = `${this.contactNC.inX},${this.contactNC.inY}`;
            const outPoint = `${this.contactNC.outX},${this.contactNC.outY}`;
            const hasPlusIn = plusPoints.has(inPoint);

            if (hasPlusIn) {
                rules.push({
                    from: inPoint,
                    to: outPoint,
                    type: 'plus'
                });
            }
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // Отрисовка катушки
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = hasPlus && hasMinus;
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // === Отрисовка НЗ контакта (500,470 → 524,470) ===
        const c = this.contactNC;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);
        const color = hasInput ? '#c00' : '#000';

        // Вход (горизонтальная линия)
        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 6, c.inY);
        ctx.lineTo(c.inX + 6, c.inY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Выход
        ctx.beginPath();
        ctx.moveTo(c.outX, c.outY);
        ctx.lineTo(c.outX - 6, c.outY);
        ctx.lineTo(c.outX - 6, c.outY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!this.isActive) {
            // Замкнут — соединяем
            ctx.beginPath();
            ctx.moveTo(c.inX + 6, c.inY + 2);
            ctx.lineTo(c.outX - 6, c.outY + 10);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнут — белая полоса
            ctx.beginPath();
            ctx.moveTo(c.inX + 12, c.inY);
            ctx.lineTo(c.inX + 12, c.inY + 15);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(kvt1);
window.animatedElements.push(kvt1);
// ========================================================================================================================
// === РЕЛЕ РТ (обновлённая отрисовка НЗ контакта — как у РУ15) ===
const rt = {
    coil: {
        inX: 2376,
        inY: 720,
        outX: 2386,
        outY: 720
    },
    contactNC: { // Нормально замкнутый контакт
        inX: 435,
        inY: 498,
        outX: 410,
        outY: 498
    },
    isForcedOn: false,
    isPowered: false,
    isActive: false,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        requestRedraw();
    },

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        this.isPowered = hasPlus && hasMinus;
        this.isActive = this.isForcedOn || this.isPowered;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update(plusPoints, minusPoints);

        const rules = [];

        // НЗ контакт — пропускает "+", когда реле НЕ активно
        if (!this.isActive) {
            const inPoint = `${this.contactNC.inX},${this.contactNC.inY}`;
            const outPoint = `${this.contactNC.outX},${this.contactNC.outY}`;
            const hasPlusIn = plusPoints.has(inPoint);

            if (hasPlusIn) {
                rules.push({
                    from: inPoint,
                    to: outPoint,
                    type: 'plus'
                });
            }
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // Отрисовка катушки
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = hasPlus && hasMinus;
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // === Отрисовка НЗ контакта (435,498 → 410,498) — как у РУ15 ===
        const c = this.contactNC;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);
        const color = hasInput ? '#c00' : '#000';

        // Вход (горизонтальная линия + ножка вниз)
        ctx.beginPath();
        ctx.moveTo(c.outX, c.outY);
        ctx.lineTo(c.outX + 6, c.outY);
        ctx.lineTo(c.outX + 6, c.outY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Выход (горизонтальная линия + ножка вниз)
        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX - 6, c.inY);
        ctx.lineTo(c.inX - 6, c.inY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!this.isActive) {
            // Замкнут — соединяем "ножки" диагональю
            ctx.beginPath();
            ctx.moveTo(c.outX + 6, c.outY + 2);
            ctx.lineTo(c.inX - 6, c.inY + 10);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнут — белая полоса через соединение
            ctx.beginPath();
            ctx.moveTo(c.inX + 12, c.inY);
            ctx.lineTo(c.inX + 12, c.inY + 15);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(rt);
window.animatedElements.push(rt);
// ========================================================================================================================
// === РЕЛЕ РУ14 ===
const ru14 = {
    coil: {
        inX: 798,
        inY: 1010,
        outX: 808,
        outY: 1010
    },
    contactNC: { // Нормально замкнутый контакт (как у РУ15)
        inX: 343,
        inY: 530,
        outX: 366,
        outY: 530
    },
    isForcedOn: false,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        requestRedraw();
    },

    getPropagationRules(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = this.isForcedOn || (hasPlus && hasMinus);

        const rules = [];

        // НЗ контакт — замыкается при ОТКЛЮЧЕНИИ реле (343,530 → 366,530)
        if (!isPowered) {
            const inPoint = `${this.contactNC.inX},${this.contactNC.inY}`;
            const outPoint = `${this.contactNC.outX},${this.contactNC.outY}`;
            const hasPlusIn = plusPoints.has(inPoint);

            if (hasPlusIn) {
                rules.push({
                    from: inPoint,
                    to: outPoint,
                    type: 'plus'
                });
            }
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = this.isForcedOn || (hasPlus && hasMinus);

        // Отрисовка катушки
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');
        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // === Отрисовка НЗ контакта (343,530 → 366,530) — как у РУ15 ===
        const c = this.contactNC;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);
        const color = hasInput ? '#c00' : '#000';

        // Вход (левая часть)
        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 6, c.inY);
        ctx.lineTo(c.inX + 6, c.inY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Выход (правая часть)
        ctx.beginPath();
        ctx.moveTo(c.outX, c.outY);
        ctx.lineTo(c.outX - 6, c.outY);
        ctx.lineTo(c.outX - 6, c.outY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!isPowered) {
            // Замкнут — соединяем диагональю
            ctx.beginPath();
            ctx.moveTo(c.inX + 6, c.inY + 2);
            ctx.lineTo(c.outX - 6, c.outY + 10);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнут — белая полоса
            ctx.beginPath();
            ctx.moveTo(c.inX + 12, c.inY);
            ctx.lineTo(c.inX + 12, c.inY + 15);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(ru14);
window.animatedElements.push(ru14);
// ========================================================================================================================
// ========================================================================================================================
// === РЕЛЕ ПЕРЕГРЕВА МАСЛА РТ6 (без катушки, только по температуре) ===
const rt6 = {
    contactNC: { // Нормально замкнутый контакт (как у РУ15)
        inX: 438,
        inY: 530,
        outX: 466,
        outY: 530
    },
    isActive: false,

    update() {
        // Активно, если температура масла > 75 °C
        const oilTemp = window.gauges?.oilTemp?.value || 0;
        this.isActive = oilTemp > 75;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update();

        const rules = [];

        // НЗ контакт — пропускает "+", когда температура ≤ 75 °C
        if (!this.isActive) {
            const inPoint = `${this.contactNC.inX},${this.contactNC.inY}`;
            const outPoint = `${this.contactNC.outX},${this.contactNC.outY}`;
            const hasPlusIn = plusPoints.has(inPoint);

            if (hasPlusIn) {
                rules.push({
                    from: inPoint,
                    to: outPoint,
                    type: 'plus'
                });
            }
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints } = networks;
        this.update();

        const c = this.contactNC;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);
        const color = hasInput ? '#c00' : '#000';

        // Вход (левая часть)
        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 6, c.inY);
        ctx.lineTo(c.inX + 6, c.inY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Выход (правая часть)
        ctx.beginPath();
        ctx.moveTo(c.outX, c.outY);
        ctx.lineTo(c.outX - 6, c.outY);
        ctx.lineTo(c.outX - 6, c.outY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!this.isActive) {
            // Замкнут — соединяем диагональю
            ctx.beginPath();
            ctx.moveTo(c.inX + 6, c.inY + 2);
            ctx.lineTo(c.outX - 6, c.outY + 10);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнут — белая полоса
            ctx.beginPath();
            ctx.moveTo(c.inX + 12, c.inY);
            ctx.lineTo(c.inX + 12, c.inY + 15);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(rt6);
window.animatedElements.push(rt6);
// =====================================================================================================================
// ========================================================================================================================
// === РЕЛЕ ПЕРЕГРЕВА ВОДЫ РТ3 (без катушки, только по температуре) ===
const rt3 = {
    contactNC: { // Нормально замкнутый контакт (аналогично РУ15 и РТ6)
        inX: 525,
        inY: 530,
        outX: 553,
        outY: 530
    },
    isActive: false,

    update() {
        // Активно, если температура воды > 90 °C
        const waterTemp = window.gauges?.waterTemp?.value || 0;
        this.isActive = waterTemp > 90;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update();

        const rules = [];

        // НЗ контакт — пропускает "+", когда температура ≤ 90 °C
        if (!this.isActive) {
            const inPoint = `${this.contactNC.inX},${this.contactNC.inY}`;
            const outPoint = `${this.contactNC.outX},${this.contactNC.outY}`;
            const hasPlusIn = plusPoints.has(inPoint);

            if (hasPlusIn) {
                rules.push({
                    from: inPoint,
                    to: outPoint,
                    type: 'plus'
                });
            }
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints } = networks;
        this.update();

        const c = this.contactNC;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);
        const color = hasInput ? '#c00' : '#000';

        // Вход (левая часть)
        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 6, c.inY);
        ctx.lineTo(c.inX + 6, c.inY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Выход (правая часть)
        ctx.beginPath();
        ctx.moveTo(c.outX, c.outY);
        ctx.lineTo(c.outX - 6, c.outY);
        ctx.lineTo(c.outX - 6, c.outY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!this.isActive) {
            // Замкнут — соединяем диагональю
            ctx.beginPath();
            ctx.moveTo(c.inX + 6, c.inY + 2);
            ctx.lineTo(c.outX - 6, c.outY + 10);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнут — белая полоса
            ctx.beginPath();
            ctx.moveTo(c.inX + 12, c.inY);
            ctx.lineTo(c.inX + 12, c.inY + 15);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(rt3);
window.animatedElements.push(rt3);
// =======================================================================================================
// === РЕЛЕ ДАВЛЕНИЯ ВОЗДУХА ТМ (ДРТ4) ===
// НО контакт замыкается при давлении в ТМ ≥ 4.0 кгс/см², размыкается при < 4.0
const drt4 = {
    contactNO: { // Нормально разомкнутый контакт (626,530 → 656,530)
        inX: 626,
        inY: 530,
        outX: 656,
        outY: 530
    },
    isClosed: false, // состояние контакта (обновляется при update)

    update() {
        // Получаем давление в ТМ
        const tmPressure = window.brakeGauges?.TM || 0;
        // Контакт ЗАМКНУТ, если давление ≥ 4.0
        this.isClosed = tmPressure >= 4.0;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update();

        const rules = [];

        // НО контакт — пропускает "+", когда давление нормальное (≥ 4.0)
        if (this.isClosed) {
            const inPoint = `${this.contactNO.inX},${this.contactNO.inY}`;
            const outPoint = `${this.contactNO.outX},${this.contactNO.outY}`;
            const hasPlusIn = plusPoints.has(inPoint);

            if (hasPlusIn) {
                rules.push({
                    from: inPoint,
                    to: outPoint,
                    type: 'plus'
                });
            }
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints } = networks;
        this.update();

        const c = this.contactNO;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);
        const color = hasInput ? '#c00' : '#000';

        // === Отрисовка НО контакта (626,530 → 656,530) ===
        // Вход (левая часть)
        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 6, c.inY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Выход (правая часть)
        ctx.beginPath();
        ctx.moveTo(c.outX, c.outY);
        ctx.lineTo(c.outX - 6, c.outY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isClosed) {
            // Замкнут — соединяем диагональной линией
            ctx.beginPath();
            ctx.moveTo(c.inX, c.inY);
            ctx.lineTo(c.outX, c.outY);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнут — белая полоса (разрыв)
            ctx.beginPath();
            ctx.moveTo(c.outX - 6, c.outY);
            ctx.lineTo(c.inX + 6, c.inY - 8);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(drt4);
window.animatedElements.push(drt4);
// =====================================================================================================================
// === РЕЛЕ ЗАЩИТЫ РЗ (обновлённое: НЗ контакт по "минусу") ===
const rz = {
    coil: {
        inX: 643,
        inY: 202,
        outX: 653,
        outY: 202
    },
    contactNC_Minus: { // НЗ контакт по минусу (797,530 ⇄ 820,531)
        inX: 797,
        inY: 530,
        outX: 820,
        outY: 531
    },
    isForcedOn: false,
    isPowered: false,
    isActive: false,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        requestRedraw();
    },

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        this.isPowered = hasPlus && hasMinus;
        this.isActive = this.isForcedOn || this.isPowered;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update(plusPoints, minusPoints);

        const rules = [];

        // НЗ контакт по минусу — пропускает "–" при ОТКЛЮЧЕНИИ реле
        if (!this.isActive) {
            const inPoint = `${this.contactNC_Minus.inX},${this.contactNC_Minus.inY}`;
            const outPoint = `${this.contactNC_Minus.outX},${this.contactNC_Minus.outY}`;
            const hasMinusIn = minusPoints.has(inPoint);
            const hasMinusOut = minusPoints.has(outPoint);

            // Двунаправленный пропуск минуса
            if (hasMinusIn) {
                rules.push(
                    { from: inPoint, to: outPoint, type: 'minus' },
                    { from: outPoint, to: inPoint, type: 'minus' }
                );
            }
            if (hasMinusOut && !hasMinusIn) {
                rules.push(
                    { from: outPoint, to: inPoint, type: 'minus' },
                    { from: inPoint, to: outPoint, type: 'minus' }
                );
            }
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // Отрисовка катушки
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = hasPlus && hasMinus;
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // === Отрисовка НЗ контакта по "минусу" (797,530 → 820,531) ===
        const c = this.contactNC_Minus;
        const hasMinusContact = minusPoints.has(`${c.inX},${c.inY}`) || minusPoints.has(`${c.outX},${c.outY}`);
        const color = hasMinusContact ? '#008000' : '#000'; // Зелёный при наличии минуса

        // Вход (левая часть)
        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 6, c.inY);
        ctx.lineTo(c.inX + 6, c.inY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Выход (правая часть)
        ctx.beginPath();
        ctx.moveTo(c.outX, c.outY);
        ctx.lineTo(c.outX - 6, c.outY);
        ctx.lineTo(c.outX - 6, c.outY + 12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!this.isActive) {
            // Замкнут — соединяем диагональной линией
            ctx.beginPath();
            ctx.moveTo(c.inX + 6, c.inY + 2);
            ctx.lineTo(c.outX - 6, c.outY + 10);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнут — белая полоса (разрыв)
            ctx.beginPath();
            ctx.moveTo(c.inX + 12, c.inY);
            ctx.lineTo(c.inX + 12, c.inY + 15);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(rz);
window.animatedElements.push(rz);
// =====================================================================================================================
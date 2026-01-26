// === ТАЙМЕРЫ ДЛЯ РЕЛЕ ===
const timers = {
    ru12: null,
    ru4: null,
    ru7: null,
    ku17: null,
    rv2: null,
    rv3: null,
    rv5: null,
    rer: null
};

// === РЕЛЕ РУ12 (самоподхват с задержкой отключения) ===
const ru12 = {
    coil: {
        inX: 748, inY: 1700,
        outX: 758, outY: 1700
    },
    contact1: {
        inX: 160, inY: 1562,
        outX: 193, outY: 1562
    },
     contact2: {
            inX: 354, inY: 1888,
            outX: 382, outY: 1888
        },
    isManualOn: false,
    isForcedOn: false,
    isAutoActive: false,
    isClosed: true,

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
        const shouldBeClosed = this.isManualOn || this.isForcedOn || (hasPlus && hasMinus);

        if (shouldBeClosed) {
            if (timers.ru12) {
                clearTimeout(timers.ru12);
                timers.ru12 = null;
            }
            this.isClosed = true;
        } else {
            if (!timers.ru12) {
                timers.ru12 = setTimeout(() => {
                    this.isClosed = false;
                    timers.ru12 = null;
                    requestRedraw();
                }, 50);
            }
        }
    },

    getPropagationRules(plusPoints, minusPoints) {
        if (!this.isClosed) return [];
        return [
            { from: `${this.contact1.inX},${this.contact1.inY}`, to: `${this.contact1.outX},${this.contact1.outY}`, type: 'plus' },
            { from: `${this.contact2.inX},${this.contact2.inY}`, to: `${this.contact2.outX},${this.contact2.outY}`, type: 'plus' }
        ];
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // Отрисовка катушки
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isActive = hasPlus && hasMinus;

        const strokeColor = this.isManualOn || this.isForcedOn ? '#f80' : (isActive ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(748, 1690, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Отрисовка контакта 1
        const c = this.contact1;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);

        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 10, c.inY);
        ctx.strokeStyle = hasInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isClosed) {
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
        // === Отрисовка второго контакта (новый, нормально разомкнутый) ===
                const c2 = this.contact2;
                const hasInput2 = plusPoints.has(`${c2.inX},${c2.inY}`);

                ctx.beginPath();
                ctx.moveTo(c2.inX, c2.inY);
                ctx.lineTo(c2.inX + 10, c2.inY);
                ctx.strokeStyle = hasInput2 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();

                if (this.isClosed) {
                    ctx.beginPath();
                    ctx.moveTo(c2.inX + 10, c2.inY);
                    ctx.lineTo(c2.outX, c2.outY);
                    ctx.strokeStyle = hasInput2 ? '#c00' : '#000';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.moveTo(c2.inX + 10, c2.inY);
                    ctx.lineTo(c2.outX, c2.outY);
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 5;
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(c2.outX, c2.outY);
                    ctx.lineTo(c2.outX - 20, c2.outY - 10);
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                }
    }
};
window.schemeElements.push(ru12);
// =====================================================================================================================
// === РЕЛЕ КБУ (катушка и контакт) ===
const relayKBU = {
    // Катушка реле
    coil: {
        inX: 374,
        inY: 118,
        outX: 384,
        outY: 118
    },
    // Нормально разомкнутый контакт
    contact: {
        inX: 306,
        inY: 202,
        outX: 340,
        outY: 202
    },
    isForcedOn: false,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 && y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        requestRedraw();
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isEnergized = (hasPlus && hasMinus) || this.isForcedOn;

                // Определение цвета катушки
        let strokeColor;
        if (this.isForcedOn) {
            strokeColor = '#f80'; // Оранжевый при принудительном включении
        } else if (hasPlus && hasMinus) {
            strokeColor = '#c00'; // Красный при питании
        } else {
            strokeColor = '#000'; // Чёрный при отключённом состоянии
        }

    // Отрисовка катушки с правильным цветом
    ctx.beginPath();
    ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
    ctx.lineWidth = 3;
    ctx.strokeStyle = strokeColor; // ← ИСПОЛЬЗУЕМ ТО, ЧТО ВЫЧИСЛИЛИ
    ctx.stroke();


        // Отрисовка контакта
        const c = this.contact;
        const hasPowerAtInput = plusPoints.has(`${c.inX},${c.inY}`);

        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 10, c.inY);
        ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isEnergized) {
            ctx.beginPath();
            ctx.moveTo(c.inX + 10, c.inY);
            ctx.lineTo(c.outX, c.outY);
            ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
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
    },

getPropagationRules(plusPoints, minusPoints) {
    const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
    const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
    const isEnergized = (hasPlus && hasMinus) || this.isForcedOn;

    if (isEnergized) {
        return [
            { type: 'plus', from: `${this.contact.inX},${this.contact.inY}`, to: `${this.contact.outX},${this.contact.outY}` }
        ];
    }
    return [];
}
};

window.schemeElements.push(relayKBU);
// ========================================================================================================================
// === РЕЛЕ РУ22 (катушка и нормально замкнутый контакт) ===
const ru22 = {
    coil: {
        inX: 716,
        inY: 1183,
        outX: 726,
        outY: 1183
    },
    contact: {
        inX: 525,
        inY: 1700,
        outX: 555,
        outY: 1700
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
        const isEnergized = (hasPlus && hasMinus) || this.isForcedOn;

        // Нормально замкнутый контакт — размыкается при включении
        if (!isEnergized) {
            return [
                { type: 'plus', from: `${this.contact.inX},${this.contact.inY}`, to: `${this.contact.outX},${this.contact.outY}` }
            ];
        }
        return [];
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isEnergized = (hasPlus && hasMinus) || this.isForcedOn;

        // Определение цвета катушки
        let strokeColor;
        if (this.isForcedOn) {
            strokeColor = '#f80'; // Оранжевый при ручном включении
        } else if (hasPlus && hasMinus) {
            strokeColor = '#c00'; // Красный при питании
        } else {
            strokeColor = '#000'; // Чёрный при отключённом состоянии
        }

        // Отрисовка катушки
        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.lineWidth = 3;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
        // Отрисовка контакта (нормально замкнутый)
        const c = this.contact;
        const hasPowerAtInput = plusPoints.has(`${c.inX},${c.inY}`);
        const hasPowerAtOutput = plusPoints.has(`${c.outX},${c.outY}`);
        // Вход
        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 10, c.inY);
        ctx.lineTo(c.inX + 10, c.inY+12);
        ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();
        // Выход
        ctx.beginPath();
        ctx.moveTo(c.outX, c.outY);
        ctx.lineTo(c.outX - 8, c.outY);
        ctx.lineTo(c.outX - 8, c.inY+12);
        ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isEnergized) {
            // Разомкнуто при включении
            ctx.beginPath();
            ctx.moveTo(c.inX + 16, c.inY);
            ctx.lineTo(c.inX + 16, c.inY+12);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();

        } else {
            // Замкнуто при выключении
            ctx.beginPath();
            ctx.moveTo(c.inX + 10, c.inY+3);
            ctx.lineTo(c.outX -8, c.outY+12);
            ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};
window.schemeElements.push(ru22);
// ========================================================================================================================
// === РЕЛЕ РУ16 (катушка и два нормально замкнутых контакта) ===
const ru16 = {
    coil: {
        inX: 603,
        inY: 1405,
        outX: 613,
        outY: 1405
    },
    contact1: {
        inX: 279,
        inY: 1888,
        outX: 309,
        outY: 1888
    },
    contact2: {
        inX: 235,
        inY: 1909,
        outX: 262,
        outY: 1909
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
        const isEnergized = (hasPlus && hasMinus) || this.isForcedOn;

        if (!isEnergized) {
            return [
                { type: 'plus', from: `${this.contact1.inX},${this.contact1.inY}`, to: `${this.contact1.outX},${this.contact1.outY}` },
                { type: 'plus', from: `${this.contact2.inX},${this.contact2.inY}`, to: `${this.contact2.outX},${this.contact2.outY}` }
            ];
        }
        return [];
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isEnergized = (hasPlus && hasMinus) || this.isForcedOn;

        // Определение цвета катушки
        let strokeColor;
        if (this.isForcedOn) {
            strokeColor = '#f80'; // Оранжевый при ручном включении
        } else if (hasPlus && hasMinus) {
            strokeColor = '#c00'; // Красный при питании
        } else {
            strokeColor = '#000'; // Чёрный при отключённом состоянии
        }

        // Отрисовка катушки
        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.lineWidth = 3;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();

        // Подпись
        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        ctx.fillText('РУ16', this.coil.inX + 12, this.coil.inY + 3);

        // Отрисовка первого контакта (нормально замкнутый)
        const c1 = this.contact1;
        const hasPowerAtInput1 = plusPoints.has(`${c1.inX},${c1.inY}`);

        ctx.beginPath();
        ctx.moveTo(c1.inX, c1.inY);
        ctx.lineTo(c1.inX + 10, c1.inY);
        ctx.lineTo(c1.inX + 10, c1.inY + 12);
        ctx.strokeStyle = hasPowerAtInput1 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(c1.outX, c1.outY);
        ctx.lineTo(c1.outX - 8, c1.outY);
        ctx.lineTo(c1.outX - 8, c1.inY + 12);
        ctx.strokeStyle = hasPowerAtInput1 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isEnergized) {
            ctx.beginPath();
            ctx.moveTo(c1.inX + 16, c1.inY);
            ctx.lineTo(c1.inX + 16, c1.inY + 12);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(c1.inX + 10, c1.inY + 3);
            ctx.lineTo(c1.outX - 8, c1.outY + 12);
            ctx.strokeStyle = hasPowerAtInput1 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Отрисовка второго контакта (нормально замкнутый)
        const c2 = this.contact2;
        const hasPowerAtInput2 = plusPoints.has(`${c2.inX},${c2.inY}`);

        ctx.beginPath();
        ctx.moveTo(c2.inX, c2.inY);
        ctx.lineTo(c2.inX + 8, c2.inY);
        ctx.lineTo(c2.inX + 8, c2.inY + 12);
        ctx.strokeStyle = hasPowerAtInput2 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(c2.outX, c2.outY);
        ctx.lineTo(c2.outX - 8, c2.outY);
        ctx.lineTo(c2.outX - 8, c2.outY + 12);
        ctx.strokeStyle = hasPowerAtInput2 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isEnergized) {
            ctx.beginPath();
            ctx.moveTo(c2.inX + 13, c2.inY);
            ctx.lineTo(c2.inX + 13, c2.inY + 12);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(c2.inX + 8, c2.inY + 4);
            ctx.lineTo(c2.outX - 8, c2.outY + 12);
            ctx.strokeStyle = hasPowerAtInput2 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

window.schemeElements.push(ru16);
// ========================================================================================================================
// === РЕЛЕ КТН (контактор топливного насоса) ===
const ktn = {
    coil: {
        inX: 727,
        inY: 1725,
        outX: 737,
        outY: 1725
    },
    contact1: {
        inX: 185,
        inY: 1909,
        outX: 215,
        outY: 1909
    },
    contact2: {
        inX: 363,
        inY: 1763,
        outX: 389,
        outY: 1763
    },
    contact3: {
        inX: 389,
        inY: 98,
        outX: 412,
        outY: 98
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

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isEnergized = (hasPlus && hasMinus) || this.isForcedOn;

        if (isEnergized) {
            this.isClosed = true;
        } else {
            this.isClosed = false;
        }
    },

    getPropagationRules(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isEnergized = (hasPlus && hasMinus) || this.isForcedOn;

        const rules = [];

        // Контакт 1: нормально замкнутый → размыкается при включении
        if (!isEnergized) {
            rules.push({
                from: `${this.contact1.inX},${this.contact1.inY}`,
                to: `${this.contact1.outX},${this.contact1.outY}`,
                type: 'plus'
            });
        }

        // Контакт 2: нормально разомкнутый → замыкается при включении
        if (isEnergized) {
            rules.push({
                from: `${this.contact2.inX},${this.contact2.inY}`,
                to: `${this.contact2.outX},${this.contact2.outY}`,
                type: 'plus'
            });
        }

        // Контакт 3: нормально разомкнутый → замыкается при включении
        if (isEnergized) {
            rules.push({
                from: `${this.contact3.inX},${this.contact3.inY}`,
                to: `${this.contact3.outX},${this.contact3.outY}`,
                type: 'plus'
            });
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isEnergized = (hasPlus && hasMinus) || this.isForcedOn;

        // Отрисовка катушки
        const strokeColor = this.isForcedOn ? '#f80' : (hasPlus && hasMinus ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // === Отрисовка первого контакта (нормально замкнутый) ===
        const c1 = this.contact1;
        const hasPower1 = plusPoints.has(`${c1.inX},${c1.inY}`);

        ctx.beginPath();
        ctx.moveTo(c1.inX, c1.inY);
        ctx.lineTo(c1.inX + 7, c1.inY);
        ctx.lineTo(c1.inX + 7, c1.inY + 12);
        ctx.strokeStyle = hasPower1 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(c1.outX, c1.outY);
        ctx.lineTo(c1.outX - 10, c1.outY);
        ctx.lineTo(c1.outX - 10, c1.inY + 12);
        ctx.strokeStyle = hasPower1 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isEnergized) {
            // Разомкнуто при включении
            ctx.beginPath();
            ctx.moveTo(c1.inX + 16, c1.inY);
            ctx.lineTo(c1.inX + 16, c1.inY + 12);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        } else {
            // Замкнуто при выключении
            ctx.beginPath();
            ctx.moveTo(c1.inX + 7, c1.inY + 3);
            ctx.lineTo(c1.outX - 10, c1.outY + 12);
            ctx.strokeStyle = hasPower1 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // === Отрисовка второго контакта (нормально разомкнутый) ===
        const c2 = this.contact2;
        const hasPower2 = plusPoints.has(`${c2.inX},${c2.inY}`);

        ctx.beginPath();
        ctx.moveTo(c2.inX, c2.inY);
        ctx.lineTo(c2.inX + 10, c2.inY);
        ctx.strokeStyle = hasPower2 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isEnergized) {
            ctx.beginPath();
            ctx.moveTo(c2.inX + 10, c2.inY);
            ctx.lineTo(c2.outX, c2.outY);
            ctx.strokeStyle = hasPower2 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(c2.inX + 10, c2.inY);
            ctx.lineTo(c2.outX, c2.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c2.outX, c2.outY);
            ctx.lineTo(c2.outX - 20, c2.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // === Отрисовка третьего контакта (нормально разомкнутый) ===
        const c3 = this.contact3;
        const hasPower3 = plusPoints.has(`${c3.inX},${c3.inY}`);

        ctx.beginPath();
        ctx.moveTo(c3.inX, c3.inY);
        ctx.lineTo(c3.inX + 10, c3.inY);
        ctx.strokeStyle = hasPower3 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isEnergized) {
            ctx.beginPath();
            ctx.moveTo(c3.inX + 10, c3.inY);
            ctx.lineTo(c3.outX, c3.outY);
            ctx.strokeStyle = hasPower3 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(c3.inX + 10, c3.inY);
            ctx.lineTo(c3.outX, c3.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c3.outX, c3.outY);
            ctx.lineTo(c3.outX - 20, c3.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

window.schemeElements.push(ktn);
// ========================================================================================================================
// === РЕЛЕ РУ4 (самоподхват с задержкой отключения, как РУ12) ===
const ru4 = {
    coil: {
        inX: 748,
        inY: 2024,
        outX: 758,
        outY: 2024
    },
    contact1: {
        inX: 352,
        inY: 1995,
        outX: 381,
        outY: 1995
    },
    contact2: {
        inX: 416,
        inY: 1787,
        outX: 446,
        outY: 1787
    },
    contact3: {
        inX: 527,
        inY: 1725,
        outX: 556,
        outY: 1725
    },
    isManualOn: false,
    isForcedOn: false,
    isAutoActive: false,
    isClosed: true,

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
        const shouldBeClosed = this.isManualOn || this.isForcedOn || (hasPlus && hasMinus);

        if (shouldBeClosed) {
            if (timers.ru4) {
                clearTimeout(timers.ru4);
                timers.ru4 = null;
            }
            this.isClosed = true;
        } else {
            if (!timers.ru4) {
                timers.ru4 = setTimeout(() => {
                    this.isClosed = false;
                    timers.ru4 = null;
                    requestRedraw();
                }, 50);
            }
        }
    },

    getPropagationRules(plusPoints, minusPoints) {
        const rules = [];

        // Первый контакт: нормально разомкнутый → замыкается при включении
        if (this.isClosed) {
            rules.push({
                from: `${this.contact1.inX},${this.contact1.inY}`,
                to: `${this.contact1.outX},${this.contact1.outY}`,
                type: 'plus'
            });
        }

        // Второй контакт: нормально замкнутый → размыкается при включении
        if (!this.isClosed) {
            rules.push({
                from: `${this.contact2.inX},${this.contact2.inY}`,
                to: `${this.contact2.outX},${this.contact2.outY}`,
                type: 'plus'
            });
        }

        // Третий контакт: нормально замкнутый → размыкается при включении
        if (!this.isClosed) {
            rules.push({
                from: `${this.contact3.inX},${this.contact3.inY}`,
                to: `${this.contact3.outX},${this.contact3.outY}`,
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
        const isActive = hasPlus && hasMinus;

        const strokeColor = this.isManualOn || this.isForcedOn ? '#f80' : (isActive ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Отрисовка первого контакта (нормально разомкнутый, как у РУ12)
        const c1 = this.contact1;
        const hasInput1 = plusPoints.has(`${c1.inX},${c1.inY}`);

        ctx.beginPath();
        ctx.moveTo(c1.inX, c1.inY);
        ctx.lineTo(c1.inX + 10, c1.inY);
        ctx.strokeStyle = hasInput1 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isClosed) {
            ctx.beginPath();
            ctx.moveTo(c1.inX + 10, c1.inY);
            ctx.lineTo(c1.outX, c1.outY);
            ctx.strokeStyle = hasInput1 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(c1.inX + 10, c1.inY);
            ctx.lineTo(c1.outX, c1.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c1.outX, c1.outY);
            ctx.lineTo(c1.outX - 20, c1.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Отрисовка второго контакта (нормально замкнутый, как у РУ16)
        const c2 = this.contact2;
        const hasInput2 = plusPoints.has(`${c2.inX},${c2.inY}`);

        ctx.beginPath();
        ctx.moveTo(c2.inX, c2.inY);
        ctx.lineTo(c2.inX + 10, c2.inY);
        ctx.lineTo(c2.inX + 10, c2.inY + 12);
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

        if (this.isClosed) {
            ctx.beginPath();
            ctx.moveTo(c2.inX + 16, c2.inY);
            ctx.lineTo(c2.inX + 16, c2.inY + 12);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(c2.inX + 10, c2.inY + 3);
            ctx.lineTo(c2.outX - 10, c2.outY + 12);
            ctx.strokeStyle = hasInput2 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Отрисовка третьего контакта (нормально замкнутый, как у РУ16)
        const c3 = this.contact3;
        const hasInput3 = plusPoints.has(`${c3.inX},${c3.inY}`);

        ctx.beginPath();
        ctx.moveTo(c3.inX, c3.inY);
        ctx.lineTo(c3.inX + 10, c3.inY);
        ctx.lineTo(c3.inX + 10, c3.inY + 12);
        ctx.strokeStyle = hasInput3 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(c3.outX, c3.outY);
        ctx.lineTo(c3.outX - 10, c3.outY);
        ctx.lineTo(c3.outX - 10, c3.inY + 12);
        ctx.strokeStyle = hasInput3 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isClosed) {
            ctx.beginPath();
            ctx.moveTo(c3.inX + 16, c3.inY);
            ctx.lineTo(c3.inX + 16, c3.inY + 12);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(c3.inX + 10, c3.inY + 3);
            ctx.lineTo(c3.outX - 10, c3.outY + 12);
            ctx.strokeStyle = hasInput3 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

window.schemeElements.push(ru4);
// ========================================================================================================================

// ========================================================================================================================
// === РЕЛЕ Ш2 (нормально замкнутое, без задержки) ===
const sh2 = {
    coil: {
        inX: 738,
        inY: 1437,
        outX: 748,
        outY: 1437
    },
    contact: {
        inX: 622,
        inY: 1550,
        outX: 650,
        outY: 1550
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

    update(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isEnergized = (hasPlus && hasMinus) || this.isForcedOn;

        this.isClosed = !isEnergized; // Нормально замкнутое: замкнуто, пока катушка не включена
    },

    getPropagationRules(plusPoints, minusPoints) {
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isEnergized = (hasPlus && hasMinus) || this.isForcedOn;

        const rules = [];

        // Контакт нормально замкнутый — пропускает "+", пока реле НЕ включено
        if (!isEnergized) {
            rules.push({
                from: `${this.contact.inX},${this.contact.inY}`,
                to: `${this.contact.outX},${this.contact.outY}`,
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
        const isEnergized = (hasPlus && hasMinus) || this.isForcedOn;

        const strokeColor = this.isForcedOn ? '#f80' : (hasPlus && hasMinus ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Отрисовка контакта (нормально замкнутый, как у РУ16)
        const c = this.contact;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);

        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 10, c.inY);
        ctx.lineTo(c.inX + 10, c.inY + 12);
        ctx.strokeStyle = hasInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(c.outX, c.outY);
        ctx.lineTo(c.outX - 10, c.outY);
        ctx.lineTo(c.outX - 10, c.inY + 12);
        ctx.strokeStyle = hasInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isEnergized) {
            // Разомкнуто при включении
            ctx.beginPath();
            ctx.moveTo(c.inX + 16, c.inY);
            ctx.lineTo(c.inX + 16, c.inY + 12);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        } else {
            // Замкнуто при выключении
            ctx.beginPath();
            ctx.moveTo(c.inX + 10, c.inY + 3);
            ctx.lineTo(c.outX - 10, c.outY + 12);
            ctx.strokeStyle = hasInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

window.schemeElements.push(sh2);
// ========================================================================================================================
// === РЕЛЕ РУ7 (нормально разомкнутое с самоподхватом) ===
const ru7 = {
    coil: {
        inX: 758,
        inY: 1550,
        outX: 768,
        outY: 1550
    },
    contact: {
        inX: 625,
        inY: 1607,
        outX: 656,
        outY: 1607
    },
    isManualOn: false,
    isForcedOn: false,
    isAutoActive: false,
    isClosed: true,

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
        const shouldBeClosed = this.isManualOn || this.isForcedOn || (hasPlus && hasMinus);

        if (shouldBeClosed) {
            if (timers.ru7) {
                clearTimeout(timers.ru7);
                timers.ru7 = null;
            }
            this.isClosed = true;
        } else {
            if (!timers.ru7) {
                timers.ru7 = setTimeout(() => {
                    this.isClosed = false;
                    timers.ru7 = null;
                    requestRedraw();
                }, 50);
            }
        }
    },

    getPropagationRules(plusPoints, minusPoints) {
        const rules = [];

        // Нормально разомкнутый контакт — замыкается при включении
        if (this.isClosed) {
            rules.push({
                from: `${this.contact.inX},${this.contact.inY}`,
                to: `${this.contact.outX},${this.contact.outY}`,
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
        const isActive = hasPlus && hasMinus;

        const strokeColor = this.isManualOn || this.isForcedOn ? '#f80' : (isActive ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Отрисовка контакта (нормально разомкнутый, как у РУ12)
        const c = this.contact;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);

        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 10, c.inY);
        ctx.strokeStyle = hasInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isClosed) {
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
    }
};

window.schemeElements.push(ru7);
// ========================================================================================================================
// === РЕЛЕ РВ2 (исправлено: передача plusPoints, minusPoints) ===
const rv2 = {
    coil: {
        inX: 738,
        inY: 1602,
        outX: 748,
        outY: 1602
    },
    contact: {
        inX: 507,
        inY: 1763,
        outX: 530,
        outY: 1763
    },
    isForcedOn: false,
    isClosed: false,
    countdown: 0,
    timer: null,

    isClickable(x, y) {
        return x >= this.coil.inX - 10 && x <= this.coil.inX + 10 &&
               y >= this.coil.inY - 10 && y <= this.coil.inY + 10;
    },

    onClick() {
        this.isForcedOn = !this.isForcedOn;
        this.updateState(); // будет вызван из draw
        requestRedraw();
    },

    updateState() {
        // Параметры будут переданы через draw → не используем глобальные window.*
        const hasPlus = this.plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = this.minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const shouldBeOn = this.isForcedOn || (hasPlus && hasMinus);

        if (shouldBeOn) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.isClosed = true;
            this.countdown = 0;
        } else {
            if (this.isClosed && !this.timer) {
                this.startCountdown(6);
            }
        }
    },

    startCountdown(seconds) {
        this.countdown = seconds;
        this.timer = setInterval(() => {
            this.countdown--;
            requestRedraw(); // обновляет отображение
            if (this.countdown <= 0) {
                this.isClosed = false;
                clearInterval(this.timer);
                this.timer = null;
                this.countdown = 0;
                requestRedraw();
            }
        }, 1000);
    },

    getPropagationRules(plusPoints, minusPoints) {
        // Сохраняем точки в экземпляре для draw и updateState
        this.plusPoints = plusPoints;
        this.minusPoints = minusPoints;
        this.updateState();

        const rules = [];
        if (this.isClosed) {
            rules.push({
                from: `${this.contact.inX},${this.contact.inY}`,
                to: `${this.contact.outX},${this.contact.outY}`,
                type: 'plus'
            });
        }
        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.plusPoints = plusPoints;
        this.minusPoints = minusPoints;
        this.updateState();

        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isEnergized = this.isForcedOn || (hasPlus && hasMinus);

        const strokeColor = this.isForcedOn ? '#f80' : (isEnergized ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.countdown > 0) {
            ctx.fillStyle = '#000';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.countdown, this.coil.inX + 5, this.coil.inY + 4);
        }

        const c = this.contact;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);

        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 10, c.inY);
        ctx.strokeStyle = hasInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isClosed) {
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

        if (this.countdown > 0) {
            ctx.fillStyle = '#000';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.countdown, c.inX + (c.outX - c.inX) / 2, c.outY + 15);
        }
    }
};

window.schemeElements.push(rv2);
// ========================================================================================================================
// === РЕЛЕ РУ28 (без задержек, мгновенное срабатывание) ===
const ru28 = {
    coil: {
        inX: 748,
        inY: 1749,
        outX: 758,
        outY: 1749
    },
    contact1: {
        inX: 630,
        inY: 1769,
        outX: 658,
        outY: 1769
    },
    contact2: {
        inX: 544,
        inY: 1787,
        outX: 572,
        outY: 1787
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

        // Оба контакта — нормально разомкнутые, замыкаются при подаче питания на катушку
        if (isPowered) {
            rules.push({
                from: `${this.contact1.inX},${this.contact1.inY}`,
                to: `${this.contact1.outX},${this.contact1.outY}`,
                type: 'plus'
            });
            rules.push({
                from: `${this.contact2.inX},${this.contact2.inY}`,
                to: `${this.contact2.outX},${this.contact2.outY}`,
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

        // Отрисовка первого контакта
        const c1 = this.contact1;
        const hasInput1 = plusPoints.has(`${c1.inX},${c1.inY}`);

        ctx.beginPath();
        ctx.moveTo(c1.inX, c1.inY);
        ctx.lineTo(c1.inX + 10, c1.inY);
        ctx.strokeStyle = hasInput1 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isPowered) {
            ctx.beginPath();
            ctx.moveTo(c1.inX + 10, c1.inY);
            ctx.lineTo(c1.outX, c1.outY);
            ctx.strokeStyle = hasInput1 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнуто — белая полоса и косая линия
            ctx.beginPath();
            ctx.moveTo(c1.inX + 10, c1.inY);
            ctx.lineTo(c1.outX, c1.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c1.outX, c1.outY);
            ctx.lineTo(c1.outX - 20, c1.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Отрисовка второго контакта
        const c2 = this.contact2;
        const hasInput2 = plusPoints.has(`${c2.inX},${c2.inY}`);

        ctx.beginPath();
        ctx.moveTo(c2.inX, c2.inY);
        ctx.lineTo(c2.inX + 10, c2.inY);
        ctx.strokeStyle = hasInput2 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isPowered) {
            ctx.beginPath();
            ctx.moveTo(c2.inX + 10, c2.inY);
            ctx.lineTo(c2.outX, c2.outY);
            ctx.strokeStyle = hasInput2 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(c2.inX + 10, c2.inY);
            ctx.lineTo(c2.outX, c2.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c2.outX, c2.outY);
            ctx.lineTo(c2.outX - 20, c2.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

window.schemeElements.push(ru28);
// ========================================================================================================================
// === РЕЛЕ КМН ===
const kmn = {
    coil: {
        inX: 748,
        inY: 1796,
        outX: 758,
        outY: 1796
    },
    contact: {
        inX: 310,
        inY: 55,
        outX: 341,
        outY: 55
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

        // Нормально разомкнутый контакт — замыкается при подаче питания
        if (isPowered) {
            rules.push({
                from: `${this.contact.inX},${this.contact.inY}`,
                to: `${this.contact.outX},${this.contact.outY}`,
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

        // Отрисовка контакта (нормально разомкнутый)
        const c = this.contact;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);

        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 10, c.inY);
        ctx.strokeStyle = hasInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isPowered) {
            // Замкнуто
            ctx.beginPath();
            ctx.moveTo(c.inX + 10, c.inY);
            ctx.lineTo(c.outX, c.outY);
            ctx.strokeStyle = hasInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнуто — белая полоса и косая линия
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
    }
};

window.schemeElements.push(kmn);
// ========================================================================================================================
// === РЕЛЕ КУ17 (задержка включения 3 сек, как у РВ3) ===
const ku17 = {
    coil: {
        inX: 727,
        inY: 2050,
        outX: 737,
        outY: 2050
    },
    contact1: {
        inX: 473,
        inY: 1806,
        outX: 492,
        outY: 1806
    },
    contact2: {
        inX: 419,
        inY: 1763,
        outX: 443,
        outY: 1763
    },
    contact3: {
        inX: 130,
        inY: 1527,
        outX: 160,
        outY: 1527
    },
    contact4: {
        inX: 1236,
        inY: 361,
        outX: 1266,
        outY: 361
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
            window.networkStable = false;
            requestRedraw();
        } else {
            this.isActive = false;
            this.stopCountdown();
            window.networkStable = false;
            requestRedraw();
        }
    },

    startCountdown(seconds) {
        if (this.isTimerStarted) return;

        this.isTimerStarted = true;
        this.countdown = seconds;
        console.log('КУ17: startCountdown запущен на', seconds);

        this.timer = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(this.timer);
                this.timer = null;
                this.isActive = true;
                this.isTimerStarted = false;
                this.isPowerDirty = true;
                console.log('КУ17: Задержка включения завершена — контакт замкнут');
            }
            requestRedraw(); // обновляем отображение таймера
        }, 1000);
    },

    stopCountdown() {
        if (this.timer) {
            console.log('КУ17: stopCountdown — таймер остановлен');
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

        // Запуск таймера при появлении питания
        if (isPowered && !wasPowered && !this.isTimerStarted && !this.isActive) {
            this.startCountdown(1); // ⚠️ Задержка включения — 3 секунды
        }
        // Остановка таймера при пропадании питания
        else if (!isPowered && wasPowered) {
            this.stopCountdown();
        }

        this.isPoweredPrev = isPowered;

        // Отрисовка только если сеть стабильна или после изменений
        if (this.isPowerDirty || !window.isStabilizingNetworks) {
            this.isPowerDirty = false;

            const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
            const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
            const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

            // Отрисовка катушки
            ctx.beginPath();
            ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 3;
            ctx.stroke();

            // Отображение таймера у катушки
            if (this.countdown > 0 && !this.isActive) {
                const timerX = this.coil.inX + 5;
                const timerY = this.coil.inY + 3;

                ctx.fillStyle = '#fff';
                ctx.fillRect(timerX - 8, timerY - 10, 14, 10);

                ctx.fillStyle = '#000';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${Math.ceil(this.countdown)}`, timerX, timerY);
            }

            // Отрисовка контактов
            const c1 = this.contact1;
            const has1 = plusPoints.has(`${c1.inX},${c1.inY}`);
            const c2 = this.contact2;
            const has2 = plusPoints.has(`${c2.inX},${c2.inY}`);
            const c3 = this.contact3;
            const has3 = plusPoints.has(`${c3.inX},${c3.inY}`);
            const c4 = this.contact4;
            const has4 = plusPoints.has(`${c4.inX},${c4.inY}`);

            // NC контакты — замкнуты при выключенном состоянии
            if (!this.isActive) {
                // Контакт 1 (NC)
                ctx.beginPath();
                ctx.moveTo(c1.inX, c1.inY);
                ctx.lineTo(c1.inX + 5, c1.inY);
                ctx.lineTo(c1.inX + 5, c1.inY + 12);
                ctx.strokeStyle = has1 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(c1.outX, c1.outY);
                ctx.lineTo(c1.outX - 5, c1.outY);
                ctx.lineTo(c1.outX - 5, c1.inY + 12);
                ctx.strokeStyle = has1 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(c1.inX + 5, c1.inY + 3);
                ctx.lineTo(c1.outX - 5, c1.outY + 12);
                ctx.strokeStyle = has1 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                // Визуализация разомкнутого NC
                ctx.beginPath();
                ctx.moveTo(c1.inX + 10, c1.inY);
                ctx.lineTo(c1.inX + 10, c1.inY + 12);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 7;
                ctx.stroke();
            }

            if (!this.isActive) {
                // Контакт 2 (NC)
                ctx.beginPath();
                ctx.moveTo(c2.inX, c2.inY);
                ctx.lineTo(c2.inX + 5, c2.inY);
                ctx.lineTo(c2.inX + 5, c2.inY + 12);
                ctx.strokeStyle = has2 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(c2.outX, c2.outY);
                ctx.lineTo(c2.outX - 5, c2.outY);
                ctx.lineTo(c2.outX - 5, c2.inY + 12);
                ctx.strokeStyle = has2 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(c2.inX + 5, c2.inY + 3);
                ctx.lineTo(c2.outX - 5, c2.outY + 12);
                ctx.strokeStyle = has2 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(c2.inX + 10, c2.inY);
                ctx.lineTo(c2.inX + 10, c2.inY + 12);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 7;
                ctx.stroke();
            }

            // NO контакты — замыкаются при включении
            if (this.isActive) {
                // Контакт 3 (NO)
                ctx.beginPath();
                ctx.moveTo(c3.inX, c3.inY);
                ctx.lineTo(c3.inX + 10, c3.inY);
                ctx.strokeStyle = has3 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(c3.inX + 10, c3.inY);
                ctx.lineTo(c3.outX, c3.outY);
                ctx.strokeStyle = has3 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(c3.inX, c3.inY);
                ctx.lineTo(c3.inX + 10, c3.inY);
                ctx.strokeStyle = has3 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(c3.inX + 10, c3.inY);
                ctx.lineTo(c3.outX, c3.outY);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 5;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(c3.outX, c3.outY);
                ctx.lineTo(c3.outX - 20, c3.outY - 10);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            if (this.isActive) {
                // Контакт 4 (NO)
                ctx.beginPath();
                ctx.moveTo(c4.inX, c4.inY);
                ctx.lineTo(c4.inX + 10, c4.inY);
                ctx.strokeStyle = has4 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(c4.inX + 10, c4.inY);
                ctx.lineTo(c4.outX, c4.outY);
                ctx.strokeStyle = has4 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(c4.inX, c4.inY);
                ctx.lineTo(c4.inX + 10, c4.inY);
                ctx.strokeStyle = has4 ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(c4.inX + 10, c4.inY);
                ctx.lineTo(c4.outX, c4.outY);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 5;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(c4.outX, c4.outY);
                ctx.lineTo(c4.outX - 20, c4.outY - 10);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            // Отображение таймера у контакта 3
            if (this.countdown > 0 && !this.isActive) {
                const timerX = c3.outX - 10;
                const timerY = c3.outY + 15;

                ctx.fillStyle = '#fff';
                ctx.fillRect(timerX - 10, timerY - 10, 14, 10);

                ctx.fillStyle = '#000';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${Math.ceil(this.countdown)}`, timerX, timerY);
            }
        }
    },

    getPropagationRules() {
        if (this.isActive) {
            return [
                { from: `${this.contact3.inX},${this.contact3.inY}`, to: `${this.contact3.outX},${this.contact3.outY}`, type: 'plus' },
                { from: `${this.contact4.inX},${this.contact4.inY}`, to: `${this.contact4.outX},${this.contact4.outY}`, type: 'plus' }
            ];
        } else {
            return [
                { from: `${this.contact1.inX},${this.contact1.inY}`, to: `${this.contact1.outX},${this.contact1.outY}`, type: 'plus' },
                { from: `${this.contact2.inX},${this.contact2.inY}`, to: `${this.contact2.outX},${this.contact2.outY}`, type: 'plus' }
            ];
        }
    }
};

// Удаляем старый КУ17 и добавляем новый
const filteredElements = window.schemeElements.filter(el =>
    !el.coil || !(el.coil.inX === 727 && el.coil.inY === 2050)
);
window.schemeElements = filteredElements;
window.schemeElements.push(ku17);
window.animatedElements.push(ku17);
// ========================================================================================================================
// === РЕЛЕ РВ3 (с задержкой включения 40 секунд) ===
const rv3 = {
    coil: {
        inX: 727,
        inY: 1768,
        outX: 737,
        outY: 1768
    },
    contact: {
        inX: 616,
        inY: 1828,
        outX: 644,
        outY: 1828
    },
    isForcedOn: false,
    isPowered: false,
    isActive: false,
    countdown: 0,
    timer: null,
    isTimerStarted: false,
    isPowerDirty: false, // ← флаг: нужно перерисовать после стабилизации

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
        requestRedraw(); // клик — безопасно, не внутри getActiveNetworks
    },

    startCountdown(seconds) {
        if (this.isTimerStarted) return;

        this.isTimerStarted = true;
        this.countdown = seconds;
        console.log('RV3: startCountdown запущен на', seconds);

        this.timer = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(this.timer);
                this.timer = null;
                this.isActive = true;
                this.isTimerStarted = false;
                this.isPowerDirty = true;
                console.log('RV3: Задержка завершена — контакт замкнут');
            }
        }, 1000);
    },

    stopCountdown() {
        if (this.timer) {
            console.log('RV3: stopCountdown — таймер остановлен');
            clearInterval(this.timer);
            this.timer = null;
        }
        this.countdown = 0;
        this.isTimerStarted = false;
        this.isActive = false;
        this.isPowerDirty = true; // ← помечаем, что нужно перерисовать позже
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

        // Только если состояние питания изменилось
        if (isPowered && !wasPowered && !this.isTimerStarted && !this.isActive) {
            this.startCountdown(40);
        } else if (!isPowered && wasPowered) {
            this.stopCountdown();
        }

        this.isPoweredPrev = isPowered;

        // === Рисование только если не в процессе стабилизации ===
        if (this.isPowerDirty || !window.isStabilizingNetworks) {
            this.isPowerDirty = false;

            const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
            const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
            const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

            ctx.beginPath();
            ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 3;
            ctx.stroke();

            if (this.countdown > 0 && !this.isActive) {
                ctx.fillStyle = '#000';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${Math.ceil(this.countdown)}`, this.coil.inX + 5, this.coil.inY + 22);
            }

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

            if (this.countdown > 0 && !this.isActive) {
                ctx.fillStyle = '#000';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${Math.ceil(this.countdown)}`, c.outX + 3, c.outY - 10);
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

window.schemeElements.push(rv3);
window.animatedElements.push(rv3);
// ========================================================================================================================
// === РЕЛЕ РУ29 (нормально разомкнутое, без задержек) ===
const ru29 = {
    coil: {
        inX: 727,
        inY: 1829,
        outX: 737,
        outY: 1828
    },
    contact: {
        inX: 615,
        inY: 1849,
        outX: 634,
        outY: 1849
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

        if (isPowered) {
            return [
                {
                    from: `${this.contact.inX},${this.contact.inY}`,
                    to: `${this.contact.outX},${this.contact.outY}`,
                    type: 'plus'
                }
            ];
        }
        return [];
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

        // Отрисовка контакта (нормально разомкнутый)
        const c = this.contact;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);

        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 10, c.inY);
        ctx.strokeStyle = hasInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isPowered) {
            // Замкнуто
            ctx.beginPath();
            ctx.moveTo(c.inX + 10, c.inY);
            ctx.lineTo(c.outX, c.outY);
            ctx.strokeStyle = hasInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнуто — белая полоса и косая линия
            ctx.beginPath();
            ctx.moveTo(c.inX + 10, c.inY);
            ctx.lineTo(c.outX, c.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c.outX, c.outY);
            ctx.lineTo(c.outX - 19, c.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};
window.schemeElements.push(ru29);
window.animatedElements.push(ru29);
// ========================================================================================================================
// === РЕЛЕ РУ5 ===
const ru5 = {
    coil: {
        inX: 748,
        inY: 1849,
        outX: 758,
        outY: 1849
    },
    contacts: [
        {
            type: "NO",
            inX: 416,
            inY: 1873,
            outX: 441,
            outY: 1873,
            isClosed: false
        },
        {
            type: "NO",
            inX: 222,
            inY: 1940,
            outX: 240,
            outY: 1940,
            isClosed: false
        }
    ],
    isForcedOn: false,
    isClosed: false,

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
        const shouldBeClosed = this.isForcedOn || (hasPlus && hasMinus);

        if (shouldBeClosed && !this.isClosed) {
            this.isClosed = true;
            this.contacts.forEach(contact => {
                contact.isClosed = true;
            });

        } else if (!shouldBeClosed && this.isClosed) {
            this.isClosed = false;
            this.contacts.forEach(contact => {
                contact.isClosed = false;
            });

        }
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update(plusPoints, minusPoints);

        return this.contacts
            .filter(contact => contact.isClosed)
            .flatMap(contact => [
                {
                    from: `${contact.inX},${contact.inY}`,
                    to: `${contact.outX},${contact.outY}`,
                    type: 'plus'
                },
                {
                    from: `${contact.outX},${contact.outY}`,
                    to: `${contact.inX},${contact.inY}`,
                    type: 'plus'
                }
            ]);
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // Отрисовка катушки
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isActive = hasPlus && hasMinus;
        const strokeColor = this.isForcedOn ? '#f80' : (isActive ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Отрисовка контактов
        this.contacts.forEach(contact => {
            const hasInput = plusPoints.has(`${contact.inX},${contact.inY}`);

            ctx.beginPath();
            ctx.moveTo(contact.inX, contact.inY);
            ctx.lineTo(contact.inX + 10, contact.inY);
            ctx.strokeStyle = hasInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            if (contact.isClosed) {
                ctx.beginPath();
                ctx.moveTo(contact.inX + 10, contact.inY);
                ctx.lineTo(contact.outX, contact.outY);
                ctx.strokeStyle = hasInput ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(contact.inX + 10, contact.inY);
                ctx.lineTo(contact.outX, contact.outY);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 5;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(contact.outX, contact.outY);
                ctx.lineTo(contact.outX - 20, contact.outY - 10);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        });
    }
};
window.schemeElements.push(ru5);
// ========================================================================================================================
// === РЕЛЕ РВ5 (задержка включения 17 секунд) — ПОЛНАЯ КОПИЯ РВ3 ===
const rv5 = {
    coil: {
        inX: 727,
        inY: 1873,
        outX: 737,
        outY: 1873
    },
    contact: {
        inX: 551,
        inY: 1896,
        outX: 579,
        outY: 1896
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
        console.log('RV5: startCountdown запущен на', seconds);

        this.timer = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(this.timer);
                this.timer = null;
                this.isActive = true;
                this.isTimerStarted = false;
                this.isPowerDirty = true;
                console.log('RV5: Задержка завершена — контакт замкнут');
            }
            requestRedraw(); // ← Ключевое: обновляем отображение каждую секунду
        }, 1000);
    },

    stopCountdown() {
        if (this.timer) {
            console.log('RV5: stopCountdown — таймер остановлен');
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

        // Запуск или остановка таймера при изменении питания
        if (isPowered && !wasPowered && !this.isTimerStarted && !this.isActive) {
            this.startCountdown(17); // ⚠️ 17 секунд — задержка
        } else if (!isPowered && wasPowered) {
            this.stopCountdown();
        }

        this.isPoweredPrev = isPowered;

        // Отрисовка только если сеть стабильна или после принудительного изменения
        if (this.isPowerDirty || !window.isStabilizingNetworks) {
            this.isPowerDirty = false;

            const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
            const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
            const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

            // Отрисовка катушки
            ctx.beginPath();
            ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 3;
            ctx.stroke();

            // === Отображение таймера у катушки ===
if (this.countdown > 0 && !this.isActive) {
    const timerX = this.coil.inX + 5;
    const timerY = this.coil.inY + 3;

    // Белый фон под цифрой
    ctx.fillStyle = '#fff';
    ctx.fillRect(timerX - 8, timerY - 10, 14, 10);

    // Текст таймера
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.ceil(this.countdown)}`, timerX, timerY);
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

            // === Отображение таймера у контакта ===
if (this.countdown > 0 && !this.isActive) {
    const timerX = c.outX - 10;
    const timerY = c.outY + 15;

    // Белый фон под цифрой
    ctx.fillStyle = '#fff';
    ctx.fillRect(timerX - 10, timerY - 10, 14, 10);

    // Текст таймера
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.ceil(this.countdown)}`, timerX, timerY);
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

// Удаляем старый rv5, если был, и добавляем новый
const filtered = window.schemeElements.filter(el => !el.coil || el.coil.inX !== 727 || el.coil.inY !== 1873);
window.schemeElements = filtered;
window.schemeElements.push(rv5);
window.animatedElements.push(rv5);
// ========================================================================================================================
// === РЕЛЕ РУ30 (нормально разомкнутое, без задержек) ===
const ru30 = {
    coil: {
        inX: 749,
        inY: 1896,
        outX: 759,
        outY: 1896
    },
    contact: {
        inX: 352,
        inY: 2031,
        outX: 379,
        outY: 2031
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

        if (isPowered) {
            return [
                {
                    from: `${this.contact.inX},${this.contact.inY}`,
                    to: `${this.contact.outX},${this.contact.outY}`,
                    type: 'plus'
                }
            ];
        }
        return [];
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

        // Отрисовка контакта (нормально разомкнутый)
        const c = this.contact;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);

        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 10, c.inY);
        ctx.strokeStyle = hasInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isPowered) {
            // Замкнуто — красная линия
            ctx.beginPath();
            ctx.moveTo(c.inX + 10, c.inY);
            ctx.lineTo(c.outX, c.outY);
            ctx.strokeStyle = hasInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнуто — белая полоса и косая линия
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
    }
};

window.schemeElements.push(ru30);
// ========================================================================================================================

// === РЕЛЕ Д1 (5 контактов: NC-NO-NC-NO-NO(-)) ===
const d1 = {
    coil: {
        inX: 749,   // <- УКАЖИТЕ КООРДИНАТЫ КАТУШКИ (вход +)
        inY: 1924,
        outX: 759,  // <- УКАЖИТЕ КООРДИНАТЫ КАТУШКИ (выход -)
        outY: 1924
    },
    contact1: { // NC, +
        inX: 535, inY: 2049,
        outX: 555, outY: 2049
    },
    contact2: { // NO, +
        inX: 405, inY: 1963,
        outX: 424, outY: 1963
    },
    contact3: { // NC, +
        inX: 258, inY: 530,
        outX: 280, outY: 530
    },
    contact4: { // NO, +
        inX: 2237, inY: 822,
        outX: 2275, outY: 822
    },
    contact5: { // NO, -
        inX: 2227, inY: 1000,
        outX: 2278, outY: 1000
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

        // Контакт 1: NC (+) — передаёт +, если реле НЕ включено
        if (!this.isActive) {
            rules.push({
                from: `${this.contact1.inX},${this.contact1.inY}`,
                to: `${this.contact1.outX},${this.contact1.outY}`,
                type: 'plus'
            });
        }

        // Контакт 2: NO (+) — передаёт +, если реле включено
        if (this.isActive) {
            rules.push({
                from: `${this.contact2.inX},${this.contact2.inY}`,
                to: `${this.contact2.outX},${this.contact2.outY}`,
                type: 'plus'
            });
        }

        // Контакт 3: NC (+) — передаёт +, если реле НЕ включено
        if (!this.isActive) {
            rules.push({
                from: `${this.contact3.inX},${this.contact3.inY}`,
                to: `${this.contact3.outX},${this.contact3.outY}`,
                type: 'plus'
            });
        }

        // Контакт 4: NO (+) — передаёт +, если реле включено
        if (this.isActive) {
            rules.push({
                from: `${this.contact4.inX},${this.contact4.inY}`,
                to: `${this.contact4.outX},${this.contact4.outY}`,
                type: 'plus'
            });
        }

        // Контакт 5: NO (-) — передаёт -, если реле включено
        if (this.isActive) {
            rules.push({
                from: `${this.contact5.inX},${this.contact5.inY}`,
                to: `${this.contact5.outX},${this.contact5.outY}`,
                type: 'minus'
            });
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // === Отрисовка катушки ===
        const strokeColor = this.isForcedOn ? '#f80' : (this.isPowered ? '#c00' : '#000');
        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // === Вспомогательная функция для отрисовки нормально разомкнутого контакта (+) ===
        const drawNORelayContact = (contact, hasInput) => {
            ctx.beginPath();
            ctx.moveTo(contact.inX, contact.inY);
            ctx.lineTo(contact.inX + 10, contact.inY);
            ctx.strokeStyle = hasInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            if (this.isActive) {
                ctx.beginPath();
                ctx.moveTo(contact.inX + 10, contact.inY);
                ctx.lineTo(contact.outX, contact.outY);
                ctx.strokeStyle = hasInput ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(contact.inX + 10, contact.inY);
                ctx.lineTo(contact.outX, contact.outY);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 5;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(contact.outX, contact.outY);
                ctx.lineTo(contact.outX - 20, contact.outY - 10);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        };

        // === Вспомогательная функция для отрисовки нормально замкнутого контакта (+) ===
        const drawNCRelayContact = (contact, hasInput) => {
            ctx.beginPath();
            ctx.moveTo(contact.inX, contact.inY);
            ctx.lineTo(contact.inX + 3, contact.inY);
            ctx.lineTo(contact.inX + 3, contact.inY + 12);
            ctx.strokeStyle = hasInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(contact.outX, contact.outY);
            ctx.lineTo(contact.outX - 3, contact.outY);
            ctx.lineTo(contact.outX - 3, contact.inY + 12);
            ctx.strokeStyle = hasInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            if (this.isActive) {
                ctx.beginPath();
                ctx.moveTo(contact.inX + 10, contact.inY);
                ctx.lineTo(contact.inX + 10, contact.inY + 15);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 7;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(contact.inX + 3, contact.inY + 3);
                ctx.lineTo(contact.outX - 3, contact.outY + 12);
                ctx.strokeStyle = hasInput ? '#c00' : '#000';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        };

        // === Отрисовка контактов ===
        const c1 = this.contact1;
        const has1 = plusPoints.has(`${c1.inX},${c1.inY}`);
        drawNCRelayContact(c1, has1);

        const c2 = this.contact2;
        const has2 = plusPoints.has(`${c2.inX},${c2.inY}`);
        drawNORelayContact(c2, has2);

        const c3 = this.contact3;
        const has3 = plusPoints.has(`${c3.inX},${c3.inY}`);
        drawNCRelayContact(c3, has3);

        const c4 = this.contact4;
        const has4 = plusPoints.has(`${c4.inX},${c4.inY}`);
        drawNORelayContact(c4, has4);

        // Контакт 5 — NO, но для минуса
        const c5 = this.contact5;
        const has5 = minusPoints.has(`${c5.inX},${c5.inY}`);

        ctx.beginPath();
        ctx.moveTo(c5.inX, c5.inY);
        ctx.lineTo(c5.inX + 10, c5.inY);
        ctx.strokeStyle = has5 ? '#008000' : '#000'; // Зелёный для минуса
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isActive) {
            ctx.beginPath();
            ctx.moveTo(c5.inX + 10, c5.inY);
            ctx.lineTo(c5.outX, c5.outY);
            ctx.strokeStyle = has5 ? '#008000' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(c5.inX + 10, c5.inY);
            ctx.lineTo(c5.outX, c5.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(c5.outX, c5.outY);
            ctx.lineTo(c5.outX - 20, c5.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

window.schemeElements.push(d1);
window.animatedElements.push(d1);
// ========================================================================================================================
// === реле РЭР===
const rer = {
    coil: {
        inX: 746, inY: 305,
        outX: 756, outY: 305
    },
    contact: {
        inX: 2487, inY: 2024,
        outX: 2509, outY: 2024
    },
    isPowered: false,
    isClosed: false,
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
        const isPowered = hasPlus && hasMinus;

        // Появилось питание — сразу включаем
        if (isPowered && !this.isPowered) {
            this.isPowered = true;
            this.isClosed = true;
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            requestRedraw();
        }

        // Питание пропало — запускаем задержку выключения
        else if (!isPowered && this.isPowered) {
            this.isPowered = false;
            if (!this.timer) {
                this.timer = setTimeout(() => {
                    this.isClosed = false;
                    this.timer = null;
                    requestRedraw();
                }, 1000); // 0.5 секунды задержки
            }
        }
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update(plusPoints, minusPoints);

        if (!this.isClosed) return [];

        const hasInput = plusPoints.has(`${this.contact.inX},${this.contact.inY}`);
        if (!hasInput) return [];

        return [
            {
                from: `${this.contact.inX},${this.contact.inY}`,
                to: `${this.contact.outX},${this.contact.outY}`,
                type: 'plus'
            }
        ];
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // Отрисовка катушки
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isActive = hasPlus && hasMinus;
        const strokeColor = isActive ? '#c00' : '#000';

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Отрисовка контакта
        const hasInput = plusPoints.has(`${this.contact.inX},${this.contact.inY}`);
        const contactColor = hasInput ? '#c00' : '#000';

        ctx.beginPath();
        ctx.moveTo(this.contact.inX, this.contact.inY);
        ctx.lineTo(this.contact.inX + 10, this.contact.inY);
        ctx.strokeStyle = contactColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isClosed) {
            ctx.beginPath();
            ctx.moveTo(this.contact.inX + 10, this.contact.inY);
            ctx.lineTo(this.contact.outX, this.contact.outY);
            ctx.strokeStyle = contactColor;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнуто — белая полоса и косая линия
            ctx.beginPath();
            ctx.moveTo(this.contact.inX + 10, this.contact.inY);
            ctx.lineTo(this.contact.outX, this.contact.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.contact.outX, this.contact.outY);
            ctx.lineTo(this.contact.outX - 20, this.contact.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Отображение таймера при задержке выключения
        if (this.timer && !this.isPowered && this.isClosed) {
            const timerX = this.coil.inX + 5;
            const timerY = this.coil.inY + 30;

            ctx.fillStyle = '#fff';
            ctx.fillRect(timerX - 8, timerY - 10, 16, 10);
            ctx.fillStyle = '#000';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('0.5', timerX, timerY);
        }
    }

};
window.schemeElements.push(rer);
window.animatedElements.push(rer);
// ========================================================================================================================
// === РЕЛЕ РНП (нормально замкнутое с катушкой) ===
const rnp = {
    coil: {
        inX: 1703,
        inY: 513,
        outX: 1693,
        outY: 513
    },
    contact: {
        inX: 1460,
        inY: 492,
        outX: 1484,
        outY: 492
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
        const isEnergized = (hasPlus && hasMinus) || this.isForcedOn;

        // Нормально замкнутый контакт — пропускает "+" пока реле НЕ включено
        if (!isEnergized) {
            const hasInput = plusPoints.has(`${this.contact.inX},${this.contact.inY}`);
            if (hasInput) {
                return [
                    {
                        from: `${this.contact.inX},${this.contact.inY}`,
                        to: `${this.contact.outX},${this.contact.outY}`,
                        type: 'plus'
                    }
                ];
            }
        }
        return [];
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isEnergized = (hasPlus && hasMinus) || this.isForcedOn;

        // Отрисовка катушки
        const strokeColor = this.isForcedOn ? '#f80' : (hasPlus && hasMinus ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX - 10, this.coil.inY - 10, 10, 20); // Прямоугольник слева направо
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Отрисовка контакта (аналогично РУ16 — нормально замкнутый)
        const c = this.contact;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);

        // Вход
        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 5, c.inY);
        ctx.lineTo(c.inX + 5, c.inY + 12);
        ctx.strokeStyle = hasInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Выход
        ctx.beginPath();
        ctx.moveTo(c.outX, c.outY);
        ctx.lineTo(c.outX - 5, c.outY);
        ctx.lineTo(c.outX - 5, c.inY + 12);
        ctx.strokeStyle = hasInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Состояние контакта
        if (isEnergized) {
            // Разомкнуто при включении
            ctx.beginPath();
            ctx.moveTo(c.inX + 12, c.inY);
            ctx.lineTo(c.inX + 12, c.inY + 18);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        } else {
            // Замкнуто при выключении
            ctx.beginPath();
            ctx.moveTo(c.inX + 5, c.inY + 3);
            ctx.lineTo(c.outX - 5, c.outY + 12);
            ctx.strokeStyle = hasInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(rnp);
window.animatedElements.push(rnp);
// ========================================================================================================================
// === РЕЛЕ КМ1 (обновлённое: кликабельность + габариты катушки как у РНП) ===
const km1 = {
    coil: {
        inX: 1542,
        inY: 492,
        outX: 1552,
        outY: 492
    },
    contact1: { // нормально разомкнутый (минус)
        inX: 1634,
        inY: 469,
        outX: 1672,
        outY: 471,
        type: 'minus'
    },
    contact2: { // нормально разомкнутый (плюс)
        inX: 1951,
        inY: 885,
        outX: 1912,
        outY: 885,
        type: 'plus'
    },
    contact3: { // нормально разомкнутый (плюс)
        inX: 1951,
        inY: 935,
        outX: 1923,
        outY: 935,
        type: 'plus'
    },
    isForcedOn: false,
    isEnergized: false,

    isClickable(x, y) {
        // Габариты катушки как у РНП: слева направо, ширина 10, высота 20
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
        this.isEnergized = (hasPlus && hasMinus) || this.isForcedOn;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update(plusPoints, minusPoints);

        const rules = [];

        if (!this.isEnergized) return rules;

        // Контакт 1 — по минусу
        if (this.contact1.type === 'minus') {
            const hasInput = minusPoints.has(`${this.contact1.inX},${this.contact1.inY}`);
            if (hasInput) {
                rules.push({
                    from: `${this.contact1.inX},${this.contact1.inY}`,
                    to: `${this.contact1.outX},${this.contact1.outY}`,
                    type: 'minus'
                });
            }
        }

        // Контакт 2 — по плюсу
        if (this.contact2.type === 'plus') {
            const hasInput = plusPoints.has(`${this.contact2.inX},${this.contact2.inY}`);
            if (hasInput) {
                rules.push({
                    from: `${this.contact2.inX},${this.contact2.inY}`,
                    to: `${this.contact2.outX},${this.contact2.outY}`,
                    type: 'plus'
                });
            }
        }

        // Контакт 3 — по плюсу
        if (this.contact3.type === 'plus') {
            const hasInput = plusPoints.has(`${this.contact3.inX},${this.contact3.inY}`);
            if (hasInput) {
                rules.push({
                    from: `${this.contact3.inX},${this.contact3.inY}`,
                    to: `${this.contact3.outX},${this.contact3.outY}`,
                    type: 'plus'
                });
            }
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // Отрисовка катушки — как у РНП: прямоугольник слева направо
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = (hasPlus && hasMinus) || this.isForcedOn;
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20); // Прямоугольник 10×20, слева от точки
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Отрисовка контакта 1 (минус)
        const c1 = this.contact1;
        const hasInput1 = minusPoints.has(`${c1.inX},${c1.inY}`);
        const color1 = this.isEnergized && hasInput1 ? '#008000' : '#000';

        ctx.beginPath();
        ctx.moveTo(c1.inX, c1.inY);
        ctx.lineTo(c1.inX + 10, c1.inY);
        ctx.strokeStyle = hasInput1 ? '#008000' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(c1.outX, c1.outY);
        ctx.lineTo(c1.outX - 5, c1.outY);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isEnergized) {
            ctx.beginPath();
            ctx.moveTo(c1.inX, c1.inY);
            ctx.lineTo(c1.outX, c1.outY -1);
            ctx.strokeStyle = color1;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(c1.inX + 10, c1.inY);
            ctx.lineTo(c1.inX + 28, c1.inY - 8);
            ctx.strokeStyle = color1;
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Отрисовка контакта 2 (плюс)
        const c2 = this.contact2;
        const hasInput2 = plusPoints.has(`${c2.inX},${c2.inY}`);
        const color2 = this.isEnergized && hasInput2 ? '#c00' : '#000';

        ctx.beginPath();
        ctx.moveTo(c2.inX, c2.inY);
        ctx.lineTo(c2.inX - 5, c2.inY);
        ctx.strokeStyle = hasInput2 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(c2.outX, c2.outY);
        ctx.lineTo(c2.outX + 10, c2.outY);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isEnergized) {
            ctx.beginPath();
            ctx.moveTo(c2.inX, c2.inY);
            ctx.lineTo(c2.outX, c2.outY);
            ctx.strokeStyle = color2;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(c2.inX - 5, c2.inY);
            ctx.lineTo(c2.inX -20, c2.outY - 8);
            ctx.strokeStyle = color2;
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Отрисовка контакта 3 (плюс)
        const c3 = this.contact3;
        const hasInput3 = plusPoints.has(`${c3.inX},${c3.inY}`);
        const color3 = this.isEnergized && hasInput3 ? '#c00' : '#000';

        ctx.beginPath();
        ctx.moveTo(c3.inX, c3.inY);
        ctx.lineTo(c3.inX - 5, c3.inY);
        ctx.strokeStyle = hasInput3 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(c3.outX, c3.outY);
        ctx.lineTo(c3.outX + 5, c3.outY);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isEnergized) {
            ctx.beginPath();
            ctx.moveTo(c3.inX, c3.inY);
            ctx.lineTo(c3.outX, c3.outY);
            ctx.strokeStyle = color3;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(c3.inX, c3.inY);
            ctx.lineTo(c3.inX -20, c3.outY -8);
            ctx.strokeStyle = color3;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};
// Добавляем обновлённый km1
window.schemeElements.push(km1);
window.animatedElements.push(km1);
window.km1 = km1;
// ========================================================================================================================
// === РЕЛЕ РКМ1 (аналогично КМ1 по стилю отрисовки) ===
const rkm1 = {
    coil: {
        inX: 1425,
        inY: 443,
        outX: 1435,
        outY: 443
    },
    contact1: { // нормально разомкнутый (минус)
        inX: 1753,
        inY: 552,
        outX: 1776,
        outY: 552,
        type: 'minus'
    },
    contact2: { // нормально разомкнутый (минус)
        inX: 1549,
        inY: 394,
        outX: 1572,
        outY: 394,
        type: 'minus'
    },
    isForcedOn: false,
    isEnergized: false,

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
        this.isEnergized = (hasPlus && hasMinus) || this.isForcedOn;
    },

    getPropagationRules(plusPoints, minusPoints) {
        this.update(plusPoints, minusPoints);

        const rules = [];

        if (!this.isEnergized) return rules;

        // Контакт 1 — по минусу
        if (this.contact1.type === 'minus') {
            const hasInput = plusPoints.has(`${this.contact1.inX},${this.contact1.inY}`);
            if (hasInput) {
                rules.push({
                    from: `${this.contact1.inX},${this.contact1.inY}`,
                    to: `${this.contact1.outX},${this.contact1.outY}`,
                    type: 'minus'
                });
            }
        }

        // Контакт 2 — по минусу
        if (this.contact2.type === 'minus') {
            const hasInput = minusPoints.has(`${this.contact2.inX},${this.contact2.inY}`);
            if (hasInput) {
                rules.push({
                    from: `${this.contact2.inX},${this.contact2.inY}`,
                    to: `${this.contact2.outX},${this.contact2.outY}`,
                    type: 'minus'
                });
            }
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints, minusPoints } = networks;
        this.update(plusPoints, minusPoints);

        // Отрисовка катушки — как у КМ1: прямоугольник 10×20
        const hasPlus = plusPoints.has(`${this.coil.inX},${this.coil.inY}`);
        const hasMinus = minusPoints.has(`${this.coil.outX},${this.coil.outY}`);
        const isPowered = (hasPlus && hasMinus) || this.isForcedOn;
        const strokeColor = this.isForcedOn ? '#f80' : (isPowered ? '#c00' : '#000');

        ctx.beginPath();
        ctx.rect(this.coil.inX, this.coil.inY - 10, 10, 20);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Отрисовка контакта 1 (минус)
        const c1 = this.contact1;
        const hasInput1 = minusPoints.has(`${c1.inX},${c1.inY}`);
        const color1 = this.isEnergized && hasInput1 ? '#008000' : '#000';

        ctx.beginPath();
        ctx.moveTo(c1.inX, c1.inY);
        ctx.lineTo(c1.inX + 5, c1.inY);
        ctx.strokeStyle = hasInput1 ? '#008000' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(c1.outX, c1.outY);
        ctx.lineTo(c1.outX + 10, c1.outY);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isEnergized) {
            ctx.beginPath();
            ctx.moveTo(c1.inX, c1.inY);
            ctx.lineTo(c1.outX, c1.outY);
            ctx.strokeStyle = color1;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(c1.inX + 5, c1.inY);
            ctx.lineTo(c1.inX + 20, c1.outY - 8);
            ctx.strokeStyle = color1;
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Отрисовка контакта 2 (минус)
        const c2 = this.contact2;
        const hasInput2 = minusPoints.has(`${c2.inX},${c2.inY}`);
        const color2 = this.isEnergized && hasInput2 ? '#008000' : '#000';

        ctx.beginPath();
        ctx.moveTo(c2.inX, c2.inY);
        ctx.lineTo(c2.inX + 10, c2.inY);
        ctx.strokeStyle = hasInput2 ? '#008000' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(c2.outX, c2.outY);
        ctx.lineTo(c2.outX - 5, c2.outY);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isEnergized) {
            ctx.beginPath();
            ctx.moveTo(c2.inX, c2.inY);
            ctx.lineTo(c2.outX, c2.outY);
            ctx.strokeStyle = color2;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(c2.inX + 5, c2.inY);
            ctx.lineTo(c2.inX + 17, c2.inY - 8);
            ctx.strokeStyle = color2;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(rkm1);
window.animatedElements.push(rkm1);
window.rkm1 = rkm1;
// ========================================================================================================================
// === РЕЛЕ ВВ (нормально разомкнутый контакт по плюсу) ===
const vv = {
    coil: {
        inX: 1573,
        inY: 575,
        outX: 1583,
        outY: 575
    },
    contact: {
        inX: 1525,
        inY: 360,
        outX: 1567,
        outY: 361
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

        if (isPowered) {
            const hasInput = plusPoints.has(`${this.contact.inX},${this.contact.inY}`);
            if (hasInput) {
                return [
                    {
                        from: `${this.contact.inX},${this.contact.inY}`,
                        to: `${this.contact.outX},${this.contact.outY}`,
                        type: 'plus'
                    }
                ];
            }
        }
        return [];
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

        // Отрисовка контакта (нормально разомкнутый, по плюсу)
        const c = this.contact;
        const hasInput = plusPoints.has(`${c.inX},${c.inY}`);

        ctx.beginPath();
        ctx.moveTo(c.inX, c.inY);
        ctx.lineTo(c.inX + 10, c.inY);
        ctx.strokeStyle = hasInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isPowered) {
            // Замкнуто — передаём плюс
            ctx.beginPath();
            ctx.moveTo(c.inX + 10, c.inY);
            ctx.lineTo(c.outX, c.outY);
            ctx.strokeStyle = hasInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнуто — разрыв
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
    }
};

window.schemeElements.push(vv);
window.animatedElements.push(vv);
// ========================================================================================================================
window.schemeElements = [];
window.animatedElements = [];
window.allPostSwitchWires = [];


// === РАЗЪЕДИНИТЕЛЬНЫЙ НОЖ (СДВОЕННЫЙ ВЫКЛЮЧАТЕЛЬ) ===
const disconnectSwitch = {
    plus: {
        x: 2006, y: 920,
        inX: 2014, inY: 920,
        outX: 1980, outY: 920
    },
    minus: {
        x: 2006, y: 941,
        inX: 2015, inY: 940,
        outX: 1980, outY: 940
    },

    isClicked(x, y) {
        const p = this.plus;
        return x > p.x - 20 && x < p.x + 40 &&
               y > p.y - 15 && y < p.y + 20;
    },

    isClickable(x, y) {
        return this.isClicked(x, y);
    },

    onClick() {
        this.click();
    },

    click() {
        isSwitchOn = !isSwitchOn;
        updateButtonState('btn-disconnect', isSwitchOn);
        requestRedraw();
    },

    draw(ctx, networks) {
        const p = this.plus;
        const m = this.minus;
        const isOpen = !isSwitchOn;

        ctx.beginPath();
        ctx.moveTo(p.inX, p.inY);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = '#c00';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(m.inX, m.inY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = '#008000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (!isOpen) {
            ctx.beginPath();
            ctx.moveTo(p.inX, p.inY);
            ctx.lineTo(p.outX, p.outY);
            ctx.strokeStyle = '#c00';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(m.inX, m.inY);
            ctx.lineTo(m.outX, m.outY);
            ctx.strokeStyle = '#008000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - 10, p.y - 10);
            ctx.strokeStyle = '#c00';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(m.x - 10, m.y - 10);
            ctx.strokeStyle = '#008000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText('ВКЛ', p.outX - 20, p.outY - 8);
        ctx.fillText('ВЫКЛ', p.x + 5, p.y - 12);
    }
};

window.schemeElements.push(disconnectSwitch);

// === ВЫКЛЮЧАТЕЛЬ "ПИТАНИЕ УСТА" ===
const ustaSwitch = {
    inX: 1888,
    inY: 806,
    outX: 1913,
    outY: 806,

    isClicked(x, y) {
        return x > this.inX - 15 && x < this.inX + 30 &&
               y > this.inY - 10 && y < this.inY + 10;
    },

    isClickable(x, y) {
        return this.isClicked(x, y);
    },

    onClick() {
        this.click();
    },

    click() {
        isUstaOn = !isUstaOn;
        updateButtonState('btn-usta', isUstaOn);
        requestRedraw();
    },

    draw(ctx, networks) {
    const { plusPoints } = networks;
        const hasPowerAtInput = plusPoints.has(`${this.inX},${this.inY}`);

        ctx.beginPath();
        ctx.moveTo(this.inX, this.inY);
        ctx.lineTo(this.inX - 14, this.inY);
        ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isUstaOn) {
            ctx.beginPath();
            ctx.moveTo(this.inX, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.inX, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.outX, this.outY);
            ctx.lineTo(this.outX - 23, this.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    },

    getPropagationRules() {
        if (isUstaOn) {
            return [
                { type: 'plus', from: `${this.inX},${this.inY}`, to: `${this.outX},${this.outY}` }
            ];
        }
        return [];
    }
};

window.schemeElements.push(ustaSwitch);

// === ВЫКЛЮЧАТЕЛЬ "ДИСПЛЕЙНЫЙ МОДУЛЬ" ===
const displaySwitch = {
    inX: 1913,
    inY: 852,
    outX: 1888,
    outY: 852,

    isClicked(x, y) {
        return x > this.inX - 15 && x < this.outX + 15 &&
               y > this.inY - 10 && y < this.inY + 10;
    },

    isClickable(x, y) {
        return this.isClicked(x, y);
    },

    onClick() {
        this.click();
    },

    click() {
        isDisplayOn = !isDisplayOn;
        updateButtonState('btn-display', isDisplayOn);
        requestRedraw();
    },

    draw(ctx, networks) {
    const { plusPoints } = networks;
        const hasPowerAtInput = plusPoints.has(`${this.inX},${this.inY}`);

        ctx.beginPath();
        ctx.moveTo(this.inX, this.inY);
        ctx.lineTo(this.inX - 14, this.inY);
        ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isDisplayOn) {
            ctx.beginPath();
            ctx.moveTo(this.inX, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.inX, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.inX, this.inY);
            ctx.lineTo(this.inX - 23, this.inY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    },

    getPropagationRules() {
        if (isDisplayOn) {
            return [
                { type: 'plus', from: `${this.inX},${this.inY}`, to: `${this.outX},${this.outY}` }
            ];
        }
        return [];
    }
};

window.schemeElements.push(displaySwitch);

// === ВЫКЛЮЧАТЕЛЬ "ПИТАНИЕ АЛСН -" ===
const alsnMinusSwitch = {
    inX: 1704,
    inY: 993,
    outX: 1683,
    outY: 993,

    isClicked(x, y) {
        return x > this.inX - 15 && x < this.inX + 30 &&
               y > this.inY - 10 && y < this.inY + 10;
    },

    isClickable(x, y) {
        return this.isClicked(x, y);
    },

    onClick() {
        this.click();
    },

    click() {
        isAlsnMinusOn = !isAlsnMinusOn;
        updateButtonState('btn-alsn', isAlsnMinusOn);
        requestRedraw();
    },

    draw(ctx, networks) {
        const { minusPoints } = networks;
        const hasPowerAtInput = minusPoints.has(`${this.inX},${this.inY}`);

        ctx.beginPath();
        ctx.moveTo(this.inX, this.inY);
        ctx.lineTo(this.inX - 14, this.inY);
        ctx.strokeStyle = hasPowerAtInput ? '#008000' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isAlsnMinusOn) {
            ctx.beginPath();
            ctx.moveTo(this.inX, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = hasPowerAtInput ? '#008000' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.inX, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.outX, this.outY);
            ctx.lineTo(this.outX + 20, this.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    },

    getPropagationRules() {
        if (isAlsnMinusOn) {
            return [
                { type: 'minus', from: `${this.inX},${this.inY}`, to: `${this.outX},${this.outY}` }
            ];
        }
        return [];
    }
};

window.schemeElements.push(alsnMinusSwitch);

// === ВЫКЛЮЧАТЕЛЬ "ПИТАНИЕ АЛСН +" ===
const ustaPlusSwitch = {
    inX: 2089,
    inY: 807,
    outX: 2111,
    outY: 807,

    isClicked(x, y) {
        return x > this.inX - 15 && x < this.inX + 30 &&
               y > this.inY - 10 && y < this.inY + 10;
    },

    isClickable(x, y) {
        return this.isClicked(x, y);
    },

    onClick() {
        this.click();
    },

    click() {
        isUstaPlusOn = !isUstaPlusOn;
        updateButtonState('btn-Alsn-plus', isUstaPlusOn);
        requestRedraw();
    },

    draw(ctx, networks) {
    const { plusPoints } = networks;
        const hasPowerAtInput = plusPoints.has(`${this.inX},${this.inY}`);

        ctx.beginPath();
        ctx.moveTo(this.inX, this.inY);
        ctx.lineTo(this.inX - 14, this.inY);
        ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isUstaPlusOn) {
            ctx.beginPath();
            ctx.moveTo(this.inX, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.inX, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.outX, this.outY);
            ctx.lineTo(this.outX - 20, this.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    },

    getPropagationRules() {
        if (isUstaPlusOn) {
            return [
                { type: 'plus', from: `${this.inX},${this.inY}`, to: `${this.outX},${this.outY}` }
            ];
        }
        return [];
    }
};

window.schemeElements.push(ustaPlusSwitch);

// === Автомат "Топливный насос" ===
const FuelPump = {
    inX: 181,
    inY: 98,
    outX: 210,
    outY: 98,

    isClicked(x, y) {
        return x > this.inX - 15 && x < this.inX + 30 &&
               y > this.inY - 10 && y < this.inY + 10;
    },

    isClickable(x, y) {
        return this.isClicked(x, y);
    },

    onClick() {
        this.click();
    },

    click() {
        isFuelPumpOn = !isFuelPumpOn;
        updateButtonState('btn-fuel-pump', isFuelPumpOn);
        requestRedraw();
    },

    draw(ctx, networks) {
    const { plusPoints } = networks;
        const hasPowerAtInput = plusPoints.has(`${this.inX},${this.inY}`);

        ctx.beginPath();
        ctx.moveTo(this.inX, this.inY);
        ctx.lineTo(this.inX - 14, this.inY);
        ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isFuelPumpOn) {
            ctx.beginPath();
            ctx.moveTo(this.inX, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.inX, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.outX, this.outY);
            ctx.lineTo(this.outX - 20, this.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    },

    getPropagationRules() {
        if (isFuelPumpOn) {
            return [
                { type: 'plus', from: `${this.inX},${this.inY}`, to: `${this.outX},${this.outY}` }
            ];
        }
        return [];
    }
};

window.schemeElements.push(FuelPump);
// =====================================================================================================================
// === ВЫКЛЮЧАТЕЛЬ "ОБЩЕЕ УПРАВЛЕНИЕ" ===
const mainControlSwitch = {
    inX: 184,
    inY: 131,
    outX: 213,
    outY: 131,

    isClickable(x, y) {
        return x >= this.inX - 15 && x <= this.inX + 30 &&
               y >= this.inY - 10 && y <= this.inY + 10;
    },

    onClick() {
        this.click();
    },

    click() {
        isMainControlOn = !isMainControlOn;
        updateButtonState('btn-main-control', isMainControlOn);
        requestRedraw();
    },

    draw(ctx, networks) {
    const { plusPoints } = networks;
        const hasPowerAtInput = plusPoints.has(`${this.inX},${this.inY}`);

        ctx.beginPath();
        ctx.moveTo(this.inX, this.inY);
        ctx.lineTo(this.inX - 14, this.inY);
        ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isMainControlOn) {
            ctx.beginPath();
            ctx.moveTo(this.inX, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.inX, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.outX, this.outY);
            ctx.lineTo(this.outX - 20, this.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    },

    getPropagationRules() {
        if (isMainControlOn) {
            return [
                { type: 'plus', from: `${this.inX},${this.inY}`, to: `${this.outX},${this.outY}` }
            ];
        }
        return [];
    }
};

window.schemeElements.push(mainControlSwitch);
// ==================================================================================================================
// === ВЫКЛЮЧАТЕЛЬ "КЛЮЧ БУ" ===
const keyBuSwitch = {
    inX: 235,
    inY: 131,
    outX: 254,
    outY: 131,

    isClicked(x, y) {
        return x > this.inX - 15 && x < this.inX + 30 &&
               y > this.inY - 10 && y < this.inY + 10;
    },

    click() {
        isKeyBuOn = !isKeyBuOn;
        updateButtonState('btn-key-bu', isKeyBuOn);
        requestRedraw();
    },

    isClickable(x, y) {
        return this.isClicked(x, y);
    },

    onClick() {
        this.click();
    },

    draw(ctx, networks) {
    const { plusPoints } = networks;
        const hasPowerAtInput = plusPoints.has(`${this.inX},${this.inY}`);

        ctx.beginPath();
        ctx.moveTo(this.inX, this.inY);
        ctx.lineTo(this.inX - 14, this.inY);
        ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isKeyBuOn) {
            ctx.beginPath();
            ctx.moveTo(this.inX, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = hasPowerAtInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.inX, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.outX, this.outY);
            ctx.lineTo(this.outX - 20, this.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    },

    getPropagationRules() {
        if (isKeyBuOn) {
            return [
                { type: 'plus', from: `${this.inX},${this.inY}`, to: `${this.outX},${this.outY}` }
            ];
        }
        return [];
    }
};

window.schemeElements.push(keyBuSwitch);

// === Тумблер "МАСЛЯНЫЙ НАСОС" (двухполюсный) ===
const oilPumpSwitch = {
    plus: {
        inX: 160, inY: 1806,
        outX: 192, outY: 1806
    },
    secondplus: {
        inX: 160, inY: 1821,
        outX: 192, outY: 1821
    },

    isClicked(x, y) {
        return (
            (x >= this.plus.inX - 20 && x <= this.plus.inX + 40 &&
             y >= this.plus.inY - 15 && y <= this.plus.inY + 20) ||
            (x >= this.secondplus.inX - 20 && x <= this.secondplus.inX + 40 &&
             y >= this.secondplus.inY - 15 && y <= this.secondplus.inY + 20)
        );
    },

    click() {
        isOilPumpOn = !isOilPumpOn;
        updateButtonState('btn-oil-pump', isOilPumpOn);
        requestRedraw();
    },

    isClickable(x, y) {
        const checkContact = (c) =>
            x >= c.inX - 20 && x <= c.inX + 40 &&
            y >= c.inY - 15 && y <= c.inY + 20;

        return checkContact(this.plus) || checkContact(this.secondplus);
    },

    onClick() {
        this.click();
    },

    draw(ctx, networks) {
    const { plusPoints } = networks;

        const p = this.plus;
        const m = this.secondplus;

        const hasPowerAtInput1 = plusPoints.has(`${p.inX},${p.inY}`);
        const hasPowerAtOutput1 = plusPoints.has(`${p.outX},${p.outY}`);

        const hasPowerAtInput2 = plusPoints.has(`${m.inX},${m.inY}`);
        const hasPowerAtOutput2 = plusPoints.has(`${m.outX},${m.outY}`);

        ctx.beginPath();
        ctx.moveTo(p.inX, p.inY);
        ctx.lineTo(p.inX + 10, p.inY);
        ctx.strokeStyle = hasPowerAtInput1 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(m.inX, m.inY);
        ctx.lineTo(m.inX + 10, m.inY);
        ctx.strokeStyle = hasPowerAtInput2 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p.outX, p.outY);
        ctx.lineTo(p.outX - 8, p.outY);
        ctx.strokeStyle = hasPowerAtOutput1 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(m.outX, m.outY);
        ctx.lineTo(m.outX - 8, m.outY);
        ctx.strokeStyle = hasPowerAtOutput2 ? '#c00' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isOilPumpOn) {
            ctx.beginPath();
            ctx.moveTo(p.inX, p.inY);
            ctx.lineTo(p.outX, p.outY);
            ctx.strokeStyle = hasPowerAtOutput1 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(m.inX, m.inY);
            ctx.lineTo(m.outX, m.outY);
            ctx.strokeStyle = hasPowerAtOutput2 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(p.inX + 25, p.inY);
            ctx.lineTo(p.inX + 10, p.inY - 7);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(m.inX + 25, m.inY);
            ctx.lineTo(m.inX + 10, m.inY - 7);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    },

    getPropagationRules() {
        if (isOilPumpOn) {
            return [
                { type: 'plus', from: `${this.plus.inX},${this.plus.inY}`, to: `${this.plus.outX},${this.plus.outY}` },
                { type: 'plus', from: `${this.secondplus.inX},${this.secondplus.inY}`, to: `${this.secondplus.outX},${this.secondplus.outY}` }
            ];
        }
        return [];
    }
};

window.schemeElements.push(oilPumpSwitch);
// =====================================================================================================================
// === ТУМБЛЕР ТОПЛИВНЫЙ НАСОС ===
const fuelPumpTumbler = {
    contact1: {
        inX: 160, inY: 1732,
        outX: 193, outY: 1732
    },
    contact2: {
        inX: 160, inY: 1745,
        outX: 193, outY: 1745
    },
    contact3: {
        inX: 160, inY: 1757,
        outX: 193, outY: 1757
    },
    contact4: {
        inX: 160, inY: 1774,
        outX: 193, outY: 1774
    },

    isClicked(x, y) {
        const checkContact = (c) =>
            x >= c.inX - 20 && x <= c.inX + 40 &&
            y >= c.inY - 15 && y <= c.inY + 20;

        return checkContact(this.contact1) ||
               checkContact(this.contact2) ||
               checkContact(this.contact3) ||
               checkContact(this.contact4);
    },

    click() {
        isFuelPumpTumblerOn = !isFuelPumpTumblerOn;
        updateButtonState('btn-fuel-pump-tumbler', isFuelPumpTumblerOn);
        requestRedraw();
    },

    isClickable(x, y) {
        return this.isClicked(x, y);
    },

    onClick() {
        this.click();
    },

    getPropagationRules() {
        if (isFuelPumpTumblerOn) {
            return [
                { type: 'plus', from: `${this.contact1.inX},${this.contact1.inY}`, to: `${this.contact1.outX},${this.contact1.outY}` },
                { type: 'plus', from: `${this.contact2.inX},${this.contact2.inY}`, to: `${this.contact2.outX},${this.contact2.outY}` }
            ];
        } else {
            return [
                { type: 'plus', from: `${this.contact3.inX},${this.contact3.inY}`, to: `${this.contact3.outX},${this.contact3.outY}` },
                { type: 'plus', from: `${this.contact4.inX},${this.contact4.inY}`, to: `${this.contact4.outX},${this.contact4.outY}` }
            ];
        }
    },

    draw(ctx, networks) {
    const { plusPoints } = networks;

        const contacts = [this.contact1, this.contact2, this.contact3, this.contact4];

        // Отрисовка всех входов и выходов с учётом питания
        contacts.forEach(contact => {
            const hasInput = plusPoints.has(`${contact.inX},${contact.inY}`);
            const hasOutput = plusPoints.has(`${contact.outX},${contact.outY}`);

            const inputColor = hasInput ? '#c00' : '#000';
            const outputColor = hasOutput ? '#c00' : '#000';

            // Вход
            ctx.beginPath();
            ctx.moveTo(contact.inX, contact.inY);
            ctx.lineTo(contact.inX + 10, contact.inY);
            ctx.strokeStyle = inputColor;
            ctx.lineWidth = 3;
            ctx.stroke();

            // Выход
            ctx.beginPath();
            ctx.moveTo(contact.outX, contact.outY);
            ctx.lineTo(contact.outX - 8, contact.outY);
            ctx.strokeStyle = outputColor;
            ctx.lineWidth = 3;
            ctx.stroke();
        });

        // Отрисовка замыкания в зависимости от положения
        if (isFuelPumpTumblerOn) {
            // Контакты 1 и 2 замкнуты
            const hasInput1 = plusPoints.has(`${this.contact1.inX},${this.contact1.inY}`);
            const hasInput2 = plusPoints.has(`${this.contact2.inX},${this.contact2.inY}`);

            ctx.beginPath();
            ctx.moveTo(this.contact1.inX, this.contact1.inY);
            ctx.lineTo(this.contact1.outX, this.contact1.outY);
            ctx.strokeStyle = hasInput1 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.contact2.inX, this.contact2.inY);
            ctx.lineTo(this.contact2.outX, this.contact2.outY);
            ctx.strokeStyle = hasInput2 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Контакты 3 и 4 разомкнуты — косая линия
            ctx.beginPath(); ctx.moveTo(this.contact3.inX + 12, this.contact3.inY); ctx.lineTo(this.contact3.inX + 22, this.contact3.inY - 7); ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(this.contact4.inX + 12, this.contact4.inY); ctx.lineTo(this.contact4.inX + 22, this.contact4.inY - 7); ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.stroke();
        } else {
            // Контакты 3 и 4 замкнуты
            const hasInput3 = plusPoints.has(`${this.contact3.inX},${this.contact3.inY}`);
            const hasInput4 = plusPoints.has(`${this.contact4.inX},${this.contact4.inY}`);

            ctx.beginPath();
            ctx.moveTo(this.contact3.inX, this.contact3.inY);
            ctx.lineTo(this.contact3.outX, this.contact3.outY);
            ctx.strokeStyle = hasInput3 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.contact4.inX, this.contact4.inY);
            ctx.lineTo(this.contact4.outX, this.contact4.outY);
            ctx.strokeStyle = hasInput4 ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Контакты 1 и 2 разомкнуты — косая линия
            ctx.beginPath(); ctx.moveTo(this.contact1.inX + 12, this.contact1.inY); ctx.lineTo(this.contact1.inX + 22, this.contact1.inY - 7); ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(this.contact2.inX + 12, this.contact2.inY); ctx.lineTo(this.contact2.inX + 22, this.contact2.inY - 7); ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.stroke();
        }
    }
};

window.schemeElements.push(fuelPumpTumbler);
// =====================================================================================================================
// === КНОПКА "ПУСК ДИЗЕЛЯ" ===
const startDieselButton = {
    contact1: {
        inX: 161, inY: 1650,
        outX: 193, outY: 1650
    },
    contact2: {
        inX: 161, inY: 1665,
        outX: 193, outY: 1665
    },

    isClicked(x, y) {
        const c1 = this.contact1;
        const c2 = this.contact2;
        return (
            (x >= c1.inX - 20 && x <= c1.inX + 40 && y >= c1.inY - 15 && y <= c1.inY + 20) ||
            (x >= c2.inX - 20 && x <= c2.inX + 40 && y >= c2.inY - 15 && y <= c2.inY + 20)
        );
    },

    click() {
        isStartDieselOn = !isStartDieselOn;
        updateStartDieselState();
        requestRedraw();
    },

    isClickable(x, y) {
        return this.isClicked(x, y);
    },

    onClick() {
        this.click();
    },

    getPropagationRules() {
        if (isStartDieselOn) {
            return [
                { type: 'plus', from: `${this.contact1.inX},${this.contact1.inY}`, to: `${this.contact1.outX},${this.contact1.outY}` },
                { type: 'plus', from: `${this.contact2.inX},${this.contact2.inY}`, to: `${this.contact2.outX},${this.contact2.outY}` }
            ];
        }
        return [];
    },

    draw(ctx, networks) {
    const { plusPoints } = networks;

        const c1 = this.contact1;
        const c2 = this.contact2;

        const hasInput1 = plusPoints.has(`${c1.inX},${c1.inY}`);
        const hasInput2 = plusPoints.has(`${c2.inX},${c2.inY}`);

        ctx.beginPath(); ctx.moveTo(c1.inX, c1.inY); ctx.lineTo(c1.inX + 14, c1.inY); ctx.strokeStyle = hasInput1 ? '#c00' : '#000'; ctx.lineWidth = 3; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(c2.inX, c2.inY); ctx.lineTo(c2.inX + 14, c2.inY); ctx.strokeStyle = hasInput2 ? '#c00' : '#000'; ctx.lineWidth = 3; ctx.stroke();

        if (isStartDieselOn){
            ctx.beginPath(); ctx.moveTo(c1.inX, c1.inY); ctx.lineTo(c1.outX, c1.outY); ctx.strokeStyle = '#c00'; ctx.lineWidth = 3; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(c2.inX, c2.inY); ctx.lineTo(c2.outX, c2.outY); ctx.strokeStyle = '#c00'; ctx.lineWidth = 3; ctx.stroke();
        } else {
            ctx.beginPath(); ctx.moveTo(c1.inX + 12, c1.inY); ctx.lineTo(c1.inX + 22, c1.inY - 7); ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(c2.inX + 12, c2.inY); ctx.lineTo(c2.inX + 22, c2.inY - 7); ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.stroke();
        }
    }
};

window.schemeElements.push(startDieselButton);
// =====================================================================================================================
// === ВЫКЛЮЧАТЕЛЬ "СТОП ДИЗЕЛЯ" ===
const stopDieselSwitch = {
    contact1: {
        inX: 161, inY: 1700,
        outX: 193, outY: 1700
    },
    contact2: {
        inX: 371, inY: 1700,
        outX: 403, outY: 1700
    },

    isClicked(x, y) {
        const c1 = this.contact1;
        const c2 = this.contact2;
        return (
            (x >= c1.inX - 20 && x <= c1.inX + 40 && y >= c1.inY - 15 && y <= c1.inY + 20) ||
            (x >= c2.inX - 20 && x <= c2.inX + 40 && y >= c2.inY - 15 && y <= c2.inY + 20)
        );
    },

    click() {
        isStopDieselOn = !isStopDieselOn;
        updateButtonState('btn-stop-diesel', isStopDieselOn);
        requestRedraw();
    },

    isClickable(x, y) {
        return this.isClicked(x, y);
    },

    onClick() {
        this.click();
    },

    getPropagationRules() {
        if (!isStopDieselOn) {
            return [
                { type: 'plus', from: `${this.contact1.inX},${this.contact1.inY}`, to: `${this.contact1.outX},${this.contact1.outY}` },
                { type: 'plus', from: `${this.contact2.inX},${this.contact2.inY}`, to: `${this.contact2.outX},${this.contact2.outY}` }
            ];
        }
        return [];
    },

    draw(ctx, networks) {
    const { plusPoints } = networks;

        const c1 = this.contact1;
        const c2 = this.contact2;

        const hasInput1 = plusPoints.has(`${c1.inX},${c1.inY}`);
        const hasInput2 = plusPoints.has(`${c2.inX},${c2.inY}`);
        const hasOutput1 = plusPoints.has(`${c1.outX},${c1.outY}`);
        const hasOutput2 = plusPoints.has(`${c2.outX},${c2.outY}`);

        ctx.beginPath(); ctx.moveTo(c1.inX, c1.inY); ctx.lineTo(c1.inX + 10, c1.inY); ctx.lineTo(c1.inX + 10, c1.inY + 13); ctx.strokeStyle = hasInput1 ? '#c00' : '#000'; ctx.lineWidth = 3; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(c1.outX, c1.outY); ctx.lineTo(c1.outX - 10, c1.inY); ctx.lineTo(c1.outX - 10, c1.outY + 13); ctx.strokeStyle = hasOutput1 ? '#c00' : '#000'; ctx.lineWidth = 3; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(c2.inX, c2.inY); ctx.lineTo(c2.inX + 10, c2.inY); ctx.lineTo(c2.inX + 10, c2.inY + 13); ctx.strokeStyle = hasInput2 ? '#c00' : '#000'; ctx.lineWidth = 3; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(c2.outX, c2.outY); ctx.lineTo(c2.outX - 10, c2.inY); ctx.lineTo(c2.outX - 10, c2.outY + 13); ctx.strokeStyle = hasOutput2 ? '#c00' : '#000'; ctx.lineWidth = 3; ctx.stroke();

        if (!isStopDieselOn) {
            ctx.beginPath(); ctx.moveTo(c1.outX - 10, c1.outY + 12); ctx.lineTo(c1.inX + 10, c1.inY + 5); ctx.strokeStyle = hasInput1 ? '#c00' : '#000'; ctx.lineWidth = 3; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(c2.outX - 10, c2.outY + 12); ctx.lineTo(c2.inX + 10, c2.inY + 5); ctx.strokeStyle = hasInput1 ? '#c00' : '#000'; ctx.lineWidth = 3; ctx.stroke();
        } else {
            ctx.beginPath(); ctx.moveTo(c1.inX + 16, c1.inY - 4); ctx.lineTo(c1.inX + 16, c1.inY + 13); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 8; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(c2.inX + 16, c2.inY - 4); ctx.lineTo(c2.inX + 16, c2.inY + 13); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 8; ctx.stroke();
        }
    }
};

window.schemeElements.push(stopDieselSwitch);
// ====================================================================================================================
// === ВЫКЛЮЧАТЕЛЬ "ПЧТ" (обновлённая версия с новым контактом) ===
const pchtSwitch = {
    rect: {
        x1: 157, y1: 1220,
        x2: 235, y2: 1242
    },
    contact1: {
        inX: 292, inY: 1231,
        outX: 321, outY: 1231
    },
    contact2: {
        inX: 602, inY: 1700,
        outX: 634, outY: 1700
    },
    contact3: { // НОВЫЙ контакт: нормально замкнутый по "+"
        inX: 307, inY: 900,
        outX: 336, outY: 900
    },

    isClicked(x, y) {
        const r = this.rect;
        return x >= r.x1 && x <= r.x2 && y >= r.y1 && y <= r.y2;
    },

    click() {
        isPchtOn = !isPchtOn;
        updateButtonState('btn-pcht', isPchtOn);
        requestRedraw();
    },

    isClickable(x, y) {
        const r = this.rect;
        return x >= r.x1 && x <= r.x2 && y >= r.y1 && y <= r.y2;
    },

    onClick() {
        this.click();
    },

    getPropagationRules(plusPoints) {
        const rules = [];
        const hasInput3 = plusPoints.has(`${this.contact3.inX},${this.contact3.inY}`);

        // Контакт 1 (управление) — замыкается при isPchtOn === false
        if (!isPchtOn) {
            rules.push({
                type: 'plus',
                from: `${this.contact1.inX},${this.contact1.inY}`,
                to: `${this.contact1.outX},${this.contact1.outY}`
            });
            rules.push({
                type: 'plus',
                from: `${this.contact2.inX},${this.contact2.inY}`,
                to: `${this.contact2.outX},${this.contact2.outY}`
            });
        }

        // Контакт 3: нормально замкнутый — передаёт "+", если isPchtOn === false
        if (hasInput3 && !isPchtOn) {
            rules.push({
                type: 'plus',
                from: `${this.contact3.inX},${this.contact3.inY}`,
                to: `${this.contact3.outX},${this.contact3.outY}`
            });
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints } = networks;

        // Основной прямоугольник "ПЧТ"
        ctx.beginPath();
        ctx.rect(this.rect.x1, this.rect.y1, this.rect.x2 - this.rect.x1, this.rect.y2 - this.rect.y1);
        ctx.strokeStyle = isPchtOn ? '#f80' : '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Функция отрисовки контакта
        const drawContact = (contact, isClosed) => {
            const hasInput = plusPoints.has(`${contact.inX},${contact.inY}`);
            const hasOutput = plusPoints.has(`${contact.outX},${contact.outY}`);
            const lineColor = hasInput ? '#c00' : '#000';

            // Вход
            ctx.beginPath();
            ctx.moveTo(contact.inX, contact.inY);
            ctx.lineTo(contact.inX + 10, contact.inY);
            ctx.lineTo(contact.inX + 10, contact.inY + 13);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 3;
            ctx.stroke();

            // Выход
            ctx.beginPath();
            ctx.moveTo(contact.outX, contact.outY);
            ctx.lineTo(contact.outX - 10, contact.outY);
            ctx.lineTo(contact.outX - 10, contact.outY + 13);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 3;
            ctx.stroke();

            if (isClosed) {
                // Замкнуто — соединяющая линия
                ctx.beginPath();
                ctx.moveTo(contact.inX + 10, contact.inY + 12);
                ctx.lineTo(contact.outX - 10, contact.outY + 2);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                // Разомкнуто — разрыв
                ctx.beginPath();
                ctx.moveTo(contact.inX + 16, contact.inY - 4);
                ctx.lineTo(contact.inX + 16, contact.inY + 13);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 8;
                ctx.stroke();
            }
        };

        // Отрисовка контактов 1 и 2
        drawContact(this.contact1, !isPchtOn);
        drawContact(this.contact2, !isPchtOn);

        // Отрисовка нового контакта 3
        drawContact(this.contact3, !isPchtOn);
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(pchtSwitch);
// ========================================================================================================================
// === ВЫКЛЮЧАТЕЛЬ "БЛОКИРОВКА 317" (БУК) — независимый тумблер ===
const bukSwitch = {
    inX: 423,
    inY: 1940,
    outX: 445,
    outY: 1940,

    isOn: false, // по умолчанию — выключен → управление разрешено

    isClickable(x, y) {
        return x >= this.inX - 15 && x <= this.inX + 30 &&
               y >= this.inY - 10 && y <= this.inY + 10;
    },

    onClick() {
        this.isOn = !this.isOn;
        updateButtonState('btn-buk', this.isOn);
        requestRedraw();
    },

    draw(ctx, networks) {
        // ... (ваша отрисовка — уже корректна)
    },

    getPropagationRules() {
        if (this.isOn) {
            return [
                { type: 'plus', from: `${this.inX},${this.inY}`, to: `${this.outX},${this.outY}` }
            ];
        }
        return [];
    }
};

window.bukSwitch = bukSwitch;
window.schemeElements.push(bukSwitch);
// ========================================================================================================================
// === ВЫКЛЮЧАТЕЛЬ "ВПУ" (нормально замкнутый, как у РУ16) ===
const vpuSwitch = {
    inX: 564,
    inY: 1940,
    outX: 589,
    outY: 1940,
    isOn: false, // Выключатель включён (замкнут) по умолчанию? Нет — по условию нормально замкнут

    isClickable(x, y) {
        return x >= this.inX - 20 && x <= this.inX + 40 &&
               y >= this.inY - 15 && y <= this.inY + 15;
    },

    onClick() {
        this.isOn = !this.isOn;
        updateButtonState('btn-vpu', this.isOn);
        requestRedraw();
    },

    draw(ctx, networks) {
        const { plusPoints } = networks;
        const hasInput = plusPoints.has(`${this.inX},${this.inY}`);
        const lineColor = hasInput ? '#c00' : '#000';
        const isClosed = !this.isOn; // Нормально замкнут: замкнут, пока не включён (не переведён в "ON")

        // Входная линия (слева)
        ctx.beginPath();
        ctx.moveTo(this.inX, this.inY);
        ctx.lineTo(this.inX + 6, this.inY);
        ctx.lineTo(this.inX + 6, this.inY + 12);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Выходная линия (справа)
        ctx.beginPath();
        ctx.moveTo(this.outX, this.outY);
        ctx.lineTo(this.outX - 8, this.outY);
        ctx.lineTo(this.outX - 8, this.outY + 12);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (isClosed) {
            // Замкнуто — соединяющая линия под углом
            ctx.beginPath();
            ctx.moveTo(this.inX + 6, this.inY + 3);
            ctx.lineTo(this.outX - 8, this.outY + 12);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнуто — белая полоса пересекает перемычку
            ctx.beginPath();
            ctx.moveTo(this.inX + 16, this.inY);
            ctx.lineTo(this.inX + 16, this.inY + 12);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.stroke();
        }
    },

    getPropagationRules() {
        // Передаёт "+", если контакт замкнут (т.е. isOn === false)
        if (!this.isOn) {
            return [
                {
                    type: 'plus',
                    from: `${this.inX},${this.inY}`,
                    to: `${this.outX},${this.outY}`
                }
            ];
        }
        return [];
    }
};

window.schemeElements.push(vpuSwitch);
// ========================================================================================================================
// === ВЫКЛЮЧАТЕЛЬ "АВТОМАТ ВОЗБУЖДЕНИЕ" ===
const excitationSwitch = {
    x: 1330,
    y: 360,
    inX: 1330,
    inY: 360,
    outX: 1372,
    outY: 362,
    isClosed: false,

    isClickable(x, y) {
        // Проверка, попал ли клик в зону переключателя
        return x >= this.x - 10 && x <= this.x + 50 &&
               y >= this.y - 10 && y <= this.y + 10;
    },

    onClick() {
        this.isClosed = !this.isClosed;
        requestRedraw();
    },

    getPropagationRules(plusPoints, minusPoints) {
        const rules = [];

        // Проверяем, есть ли напряжение на входе и замкнут ли контакт
        const hasInput = plusPoints.has(`${this.inX},${this.inY}`);
        if (hasInput && this.isClosed) {
            rules.push({
                from: `${this.inX},${this.inY}`,
                to: `${this.outX},${this.outY}`,
                type: 'plus'
            });
        }

        // Обратная проводимость (если нужно)
        const hasOutput = plusPoints.has(`${this.outX},${this.outY}`);
        if (hasOutput && this.isClosed) {
            rules.push({
                from: `${this.outX},${this.outY}`,
                to: `${this.inX},${this.inY}`,
                type: 'plus'
            });
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints } = networks;
        const hasInput = plusPoints.has(`${this.inX},${this.inY}`);
        const inputColor = hasInput ? '#c00' : '#000';
        const lineColor = this.isClosed ? (hasInput ? '#c00' : '#000') : '#000';

        // Линия входа
        ctx.beginPath();
        ctx.moveTo(this.inX, this.inY);
        ctx.lineTo(this.inX + 20, this.inY);
        ctx.strokeStyle = inputColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Линия выхода
        ctx.beginPath();
        ctx.moveTo(this.outX, this.outY);
        ctx.lineTo(this.outX - 20, this.outY);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Подвижный контакт (разомкнут по умолчанию)
        if (this.isClosed) {
            // Замкнутое состояние — соединяем
            ctx.beginPath();
            ctx.moveTo(this.inX + 20, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Разомкнутое состояние — разрыв
            ctx.beginPath();
            ctx.moveTo(this.inX + 20, this.inY);
            ctx.lineTo(this.outX - 10, this.outY - 10);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.outX - 10, this.outY - 10);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(excitationSwitch);
// ========================================================================================================================
// === ТУМБЛЕР ВОЗБУЖДЕНИЯ (двухконтактный) ===
const excitationTumbler = {
    // Первый контакт — нормально разомкнутый (аварийное возбуждение)
    contact1: {
        inX: 1327, inY: 443,
        outX: 1356, outY: 443,
        isClosed: false // нормально разомкнут
    },
    // Второй контакт — нормально замкнутый (рабочее возбуждение)
    contact2: {
        inX: 1327, inY: 494,
        outX: 1356, outY: 494,
        isClosed: true // нормально замкнут
    },

    // Проверка клика по тумблеру (область между контактами)
    isClickable(x, y) {
        return x >= this.contact1.inX - 10 && x <= this.contact1.inX + 50 &&
               y >= this.contact1.inY - 10 && y <= this.contact2.inY + 10;
    },

    // Переключение состояния
    onClick() {
        // При переключении: первый замыкается, второй размыкается (и наоборот)
        this.contact1.isClosed = !this.contact1.isClosed;
        this.contact2.isClosed = !this.contact2.isClosed;
        requestRedraw();
    },

    getPropagationRules(plusPoints, minusPoints) {
        const rules = [];

        // Правила для первого контакта (аварийное)
        if (this.contact1.isClosed) {
            const hasInput1 = plusPoints.has(`${this.contact1.inX},${this.contact1.inY}`);
            if (hasInput1) {
                rules.push({
                    from: `${this.contact1.inX},${this.contact1.inY}`,
                    to: `${this.contact1.outX},${this.contact1.outY}`,
                    type: 'plus'
                });
            }
        }

        // Правила для второго контакта (рабочее)
        if (this.contact2.isClosed) {
            const hasInput2 = plusPoints.has(`${this.contact2.inX},${this.contact2.inY}`);
            if (hasInput2) {
                rules.push({
                    from: `${this.contact2.inX},${this.contact2.inY}`,
                    to: `${this.contact2.outX},${this.contact2.outY}`,
                    type: 'plus'
                });
            }
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints } = networks;

        const hasInput1 = plusPoints.has(`${this.contact1.inX},${this.contact1.inY}`);
        const hasInput2 = plusPoints.has(`${this.contact2.inX},${this.contact2.inY}`);

        const inputColor1 = hasInput1 ? '#c00' : '#000';
        const inputColor2 = hasInput2 ? '#c00' : '#000';

        const lineColor1 = this.contact1.isClosed && hasInput1 ? '#c00' : '#000';
        const lineColor2 = this.contact2.isClosed && hasInput2 ? '#c00' : '#000';

        // === Контакт 1 — нормально разомкнутый (аварийное) ===
        // Линия входа
                    ctx.beginPath();
                    ctx.moveTo(this.contact1.inX + 15, this.contact1.inY -15);
                    ctx.lineTo(this.contact1.inX + 15, this.contact1.outY +100);
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 10;
                    ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.contact1.inX, this.contact1.inY);
        ctx.lineTo(this.contact1.inX + 5, this.contact1.inY);
        ctx.strokeStyle = inputColor1;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Линия выхода
        ctx.beginPath();
        ctx.moveTo(this.contact1.outX, this.contact1.outY);
        ctx.lineTo(this.contact1.outX - 5, this.contact1.outY);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Подвижный контакт
        if (this.contact1.isClosed) {
            ctx.beginPath();
            ctx.moveTo(this.contact1.inX, this.contact1.inY);
            ctx.lineTo(this.contact1.outX, this.contact1.outY);
            ctx.strokeStyle = lineColor1;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.contact1.inX + 5, this.contact1.inY);
            ctx.lineTo(this.contact1.inX + 20, this.contact1.outY - 10);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.contact1.inX +5, this.contact1.outY);
            ctx.lineTo(this.contact1.inX + 20, this.contact1.outY - 10);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Подпись "Аварийное"
        ctx.beginPath();
        ctx.moveTo(this.contact1.inX, this.contact1.inY - 18);
        ctx.lineTo(this.contact1.inX + 46, this.contact1.outY - 18);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 15;
        ctx.stroke();

        ctx.fillStyle = '#c00';
        ctx.font = 'bold 9px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Аварийное', this.contact1.inX , this.contact1.inY - 18);

        // === Контакт 2 — нормально замкнутый (рабочее) ===
        // Линия входа
        ctx.beginPath();
        ctx.moveTo(this.contact2.inX, this.contact2.inY);
        ctx.lineTo(this.contact2.inX + 5, this.contact2.inY);
        ctx.lineTo(this.contact2.inX + 5, this.contact2.inY +12);
        ctx.strokeStyle = inputColor2;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Линия выхода
        ctx.beginPath();
        ctx.moveTo(this.contact2.outX, this.contact2.outY);
        ctx.lineTo(this.contact2.outX - 7, this.contact2.outY);
        ctx.lineTo(this.contact2.outX - 7, this.contact2.outY +12);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Подвижный контакт
        if (this.contact2.isClosed) {
            ctx.beginPath();
            ctx.moveTo(this.contact2.inX + 7, this.contact2.inY +12);
            ctx.lineTo(this.contact2.outX - 7, this.contact2.outY +2);
            ctx.strokeStyle = lineColor2;
            ctx.lineWidth = 3;
            ctx.stroke();

                        ctx.beginPath();
                        ctx.moveTo(this.contact1.inX, this.contact1.inY - 18);
                        ctx.lineTo(this.contact1.inX + 49, this.contact1.outY - 18);
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 16;
                        ctx.stroke();
        // Подпись "Рабочее"
                ctx.fillStyle = '#008000';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'left';
                ctx.fillText('Рабочее', this.contact2.inX, this.contact2.inY + 23);
        } else {


            ctx.beginPath();
            ctx.moveTo(this.contact2.inX -3, this.contact2.inY +20);
            ctx.lineTo(this.contact2.inX +50, this.contact2.outY +20);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 16;
            ctx.stroke();
        }


    }
};

// Добавляем в глобальные массивы
window.excitationTumbler = excitationTumbler;
window.schemeElements.push(excitationTumbler);
// === ДИОД зарядки батареи — пропускает "+" только в одну сторону ===
const diode = {
    inX: 1658,
    inY: 361,
    outX: 1613,
    outY: 361,

    // Кликабельность не требуется — диод пассивный элемент
    isClickable() {
        return false;
    },

    update(plusPoints) {
        // Проверяем, есть ли "+" на входе
        const hasPlusInput = plusPoints.has(`${this.inX},${this.inY}`);
        const hasPlusOutput = plusPoints.has(`${this.outX},${this.outY}`);

        // Диод пропускает ток ТОЛЬКО от in → out, но не назад
        this.shouldPropagate = hasPlusInput; // если есть плюс на входе — передаём вперёд
        this.shouldBlockReverse = hasPlusOutput; // если плюс пришёл с выхода — не передаём назад
    },

    getPropagationRules(plusPoints) {
        this.update(plusPoints);

        const rules = [];

        // Пропускаем только вперёд: in → out
        if (this.shouldPropagate) {
            rules.push({
                type: 'plus',
                from: `${this.inX},${this.inY}`,
                to: `${this.outX},${this.outY}`
            });
        }

        // Обратное направление — блокируем (не добавляем правило)
        // Диод не передаёт напряжение в обратку

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints } = networks;
        this.update(plusPoints);

        const hasInput = plusPoints.has(`${this.inX},${this.inY}`);
        const hasOutput = this.shouldPropagate && hasInput;

        // Цвет линии: зависит от наличия питания на входе
        const inputColor = hasInput ? '#c00' : '#000';
        const outputColor = hasOutput ? '#c00' : '#000';

        // Отрисовка входной линии
        ctx.beginPath();
        ctx.moveTo(this.inX, this.inY);
        ctx.lineTo(this.inX - 20, this.inY);
        ctx.strokeStyle = inputColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Отрисовка выходной линии
        ctx.beginPath();
        ctx.moveTo(this.outX, this.outY);
        ctx.lineTo(this.outX + 20, this.outY);
        ctx.strokeStyle = outputColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Отрисовка символа диода: треугольник + линия
        const centerX = this.inX - 30;
        const centerY = this.inY;

        // Треугольник (анод)
        ctx.beginPath();
        ctx.moveTo(centerX + 15, centerY - 8); // левая вершина
        ctx.lineTo(centerX, centerY);           // центр вперёд
        ctx.lineTo(centerX + 15, centerY + 8); // правая вершина
        ctx.closePath();
        ctx.fillStyle = '#c00'; // всегда заполнен
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Катод — вертикальная черта
        ctx.beginPath();
        ctx.moveTo(centerX + 15, centerY - 8);
        ctx.lineTo(centerX + 15, centerY + 8);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Соединительная линия от анода к катоду
        ctx.beginPath();
        ctx.moveTo(this.inX - 20, this.inY);
        ctx.lineTo(centerX - 15, this.inY);
        ctx.strokeStyle = inputColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Линия от катода к выходу
        ctx.beginPath();
        ctx.moveTo(centerX - 15, this.inY);
        ctx.lineTo(this.outX + 20, this.inY);
        ctx.strokeStyle = outputColor;
        ctx.lineWidth = 3;
        ctx.stroke();
    }
};

// Добавляем в глобальные массивы
window.schemeElements.push(diode);
// =====================================================================================================================
// === ТУМБЛЕР РЕВЕРСОРА (3 положения: "Вперёд", "Назад", "Нейтраль") ===
const reversorTumbler = {
    // Положения: 'forward', 'neutral', 'backward'
    position: 'neutral', // начальное положение

    // Области клика на панели управления
    areas: {
        forward: { x1: 157, y1: 825, x2: 233, y2: 845 }, // "Вперёд"
        backward: { x1: 157, y1: 845, x2: 236, y2: 868 }  // "Назад"
    },

    // Невидимые контакты для логики
    contacts: {
        forward: {
            inX: 251, inY: 812,
            outX: 240, outY: 834
        },
        backward: {
            inX: 251, inY: 812,
            outX: 239, outY: 856
        }
    },

    // Визуальные линии на схеме (новое)
    visualLines: {
        forward: { x: 33, y1: 805, y2: 1098 },
        neutral: { x: 38, y1: 805, y2: 1098 },
        backward: { x: 45, y1: 805, y2: 1098 }
    },

    isClickable(x, y) {
        const f = this.areas.forward;
        const b = this.areas.backward;
        return (
            (x >= f.x1 && x <= f.x2 && y >= f.y1 && y <= f.y2) ||
            (x >= b.x1 && x <= b.x2 && y >= b.y1 && y <= b.y2)
        );
    },

    onClick(x, y) {
        const f = this.areas.forward;
        const b = this.areas.backward;

        if (x >= f.x1 && x <= f.x2 && y >= f.y1 && y <= f.y2) {
            console.log('Реверсор: выбрано "Вперёд"');
            this.setPosition('forward');
        } else if (x >= b.x1 && x <= b.x2 && y >= b.y1 && y <= b.y2) {
            console.log('Реверсор: выбрано "Назад"');
            this.setPosition('backward');
        }
    },

    setPosition(pos) {
        if (['forward', 'neutral', 'backward'].includes(pos)) {
            this.position = pos;
            updateReversorButtons();
            requestRedraw();
        }
    },

    getPropagationRules(plusPoints) {
        const rules = [];
        const inputKey = `${this.contacts.forward.inX},${this.contacts.forward.inY}`;
        const hasInput = plusPoints.has(inputKey);

        if (this.position === 'forward' && hasInput) {
            rules.push({
                type: 'plus',
                from: inputKey,
                to: `${this.contacts.forward.outX},${this.contacts.forward.outY}`
            });
        }

        if (this.position === 'backward' && hasInput) {
            rules.push({
                type: 'plus',
                from: inputKey,
                to: `${this.contacts.backward.outX},${this.contacts.backward.outY}`
            });
        }

        return rules;
    },

    draw(ctx, networks) {
        // Отрисовка визуальных красных линий
        const lineWidth = 2;
        const lineX = this.visualLines[this.position]?.x;

        if (lineX) {
            ctx.beginPath();
            ctx.moveTo(lineX, this.visualLines[this.position].y1);
            ctx.lineTo(lineX, this.visualLines[this.position].y2);
            ctx.strokeStyle = '#c00'; // красная линия
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.reversorTumbler = reversorTumbler;
window.schemeElements.push(reversorTumbler);
// =====================================================================================================================
// =====================================================================================================================
// === ОТКЛЮЧАТЕЛЬ МОТОРОВ "ОМ" ===
const omSwitch = {
    // Геометрия квадрата на схеме
    rect: {
        x: 663,
        y: 363,
        width: 65,
        height: 73
    },

    // Вход и выходы
    input: {
        x: 661,
        y: 379
    },
    output1: { // П1
        x: 729,
        y: 378
    },
    output2: { // П2
        x: 729,
        y: 405
    },

    // Текущее положение (как на панели управления)
    position: 'I+II', // по умолчанию

    // Невозможно кликнуть на элемент — управляется только с панели
    isClickable() {
        return false;
    },

    onClick() {
        // Не реагирует
    },

    // Правила передачи напряжения
    getPropagationRules(plusPoints) {
        const rules = [];
        const hasInput = plusPoints.has(`${this.input.x},${this.input.y}`);

        if (!hasInput) return rules;

        if (this.position === 'I') {
            rules.push({
                type: 'plus',
                from: `${this.input.x},${this.input.y}`,
                to: `${this.output1.x},${this.output1.y}`
            });
        } else if (this.position === 'II') {
            rules.push({
                type: 'plus',
                from: `${this.input.x},${this.input.y}`,
                to: `${this.output2.x},${this.output2.y}`
            });
        } else if (this.position === 'I+II') {
            rules.push({
                type: 'plus',
                from: `${this.input.x},${this.input.y}`,
                to: `${this.output1.x},${this.output1.y}`
            });
            rules.push({
                type: 'plus',
                from: `${this.input.x},${this.input.y}`,
                to: `${this.output2.x},${this.output2.y}`
            });
        }
        // При положении "0" — ничего не добавляем

        return rules;
    },

    // Отрисовка элемента на схеме
    draw(ctx, networks) {
        const { plusPoints } = networks;
        const hasInput = plusPoints.has(`${this.input.x},${this.input.y}`);

        // Заливка квадрата
        ctx.beginPath();
        ctx.rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        ctx.fillStyle = hasInput ? '#ccc' : '#f0f0f0'; // светло-серый при питании, иначе белый
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Текст "ОМ"
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ОМ', this.rect.x + 62, this.rect.y -3);

        // Отрисовка линий в зависимости от положения
        if (hasInput) {
            if (this.position === 'I' || this.position === 'I+II') {
                ctx.beginPath();
                ctx.moveTo(this.input.x, this.input.y);
                ctx.lineTo(700, this.input.y);
                ctx.lineTo(700, this.output1.y);
                ctx.lineTo(this.output1.x, this.output1.y);
                ctx.strokeStyle = '#c00';
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            if (this.position === 'II' || this.position === 'I+II') {
                ctx.beginPath();
                ctx.moveTo(this.input.x, this.input.y);
                ctx.lineTo(700, this.input.y);
                ctx.lineTo(700, this.output2.y);
                ctx.lineTo(this.output2.x, this.output2.y);
                ctx.strokeStyle = '#c00';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        }
    }
};

// Добавляем в глобальные массивы
window.omSwitch = omSwitch;
window.schemeElements.push(omSwitch);

// === ФУНКЦИЯ ОБНОВЛЕНИЯ КНОПОК ОТКЛЮЧАТЕЛЯ МОТОРОВ ===
function updateOmButtons() {
    const btnI = document.getElementById('btn-om-i');
    const btnII = document.getElementById('btn-om-ii');
    const btnIii = document.getElementById('btn-om-i-ii');
    const btn0 = document.getElementById('btn-om-0');

    if (btnI) btnI.classList.toggle('btn-on', omSwitch.position === 'I');
    if (btnII) btnII.classList.toggle('btn-on', omSwitch.position === 'II');
    if (btnIii) btnIii.classList.toggle('btn-on', omSwitch.position === 'I+II');
    if (btn0) btn0.classList.toggle('btn-on', omSwitch.position === '0');
}

// === ОБНОВЛЕНИЕ ПОЗИЦИИ ОТКЛЮЧАТЕЛЯ МОТОРОВ ===
function setOmPosition(pos) {
    if (['I', 'II', 'I+II', '0'].includes(pos)) {
        omSwitch.position = pos;
        updateOmButtons();
        requestRedraw();
    }
}
// =====================================================================================================================
// === ОТКЛЮЧАТЕЛЬ МОТОРОВ "ОМт" (вторая часть, зеркало ОМ) ===
const omSwitchT = {
    // Геометрия прямоугольника
    rect: {
        x1: 156, y1: 550,
        x2: 221, y2: 607
    },

    // Точки подключения
    input1: { x: 154, y: 567 },  // слева
    input2: { x: 163, y: 609 },  // снизу
    input3: { x: 222, y: 567 },  // справа

    // Невозможно кликать — управляется с панели через omSwitch
    isClickable() {
        return false;
    },

    onClick() {
        // не реагирует
    },

    // Правила передачи напряжения — синхронно с omSwitch.position
    getPropagationRules(plusPoints) {
        const rules = [];
        const pos = omSwitch.position; // синхронизация с основным ОМ

        const hasInput1 = plusPoints.has(`${this.input1.x},${this.input1.y}`);
        const hasInput2 = plusPoints.has(`${this.input2.x},${this.input2.y}`);
        const hasInput3 = plusPoints.has(`${this.input3.x},${this.input3.y}`);

        if (pos === 'I') {
            // Питание от входа 3 до входа 2
            if (hasInput3) {
                rules.push({
                    type: 'plus',
                    from: `${this.input3.x},${this.input3.y}`,
                    to: `${this.input2.x},${this.input2.y}`
                });
            }
        } else if (pos === 'II') {
            // Питание от входа 1 до входа 3
            if (hasInput1) {
                rules.push({
                    type: 'plus',
                    from: `${this.input1.x},${this.input1.y}`,
                    to: `${this.input3.x},${this.input3.y}`
                });
            }
        } else if (pos === '0') {
            // Питание от входа 1 до входа 2
            if (hasInput1) {
                rules.push({
                    type: 'plus',
                    from: `${this.input1.x},${this.input1.y}`,
                    to: `${this.input2.x},${this.input2.y}`
                });
            }
        }
        // При 'I+II' — ничего не передаётся

        return rules;
    },

    // Отрисовка ОМт
    draw(ctx, networks) {
        const { plusPoints } = networks;
        const pos = omSwitch.position;

        // Заливка прямоугольника
        ctx.beginPath();
        ctx.rect(this.rect.x1, this.rect.y1, this.rect.x2 - this.rect.x1, this.rect.y2 - this.rect.y1);
        ctx.fillStyle = '#ccc'; // светло-серый фон
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Отрисовка соединений в зависимости от положения
        const drawConnection = (fromX, fromY, toX, toY, isActive) => {
            if (isActive) {
                ctx.beginPath();
                ctx.moveTo(fromX, fromY);
                ctx.lineTo(toX, toY);
                ctx.strokeStyle = '#c00';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        };

        if (pos === 'I') {
            drawConnection(this.input3.x, this.input3.y, this.input2.x, this.input2.y, true);
        } else if (pos === 'II') {
            drawConnection(this.input1.x, this.input1.y, this.input3.x, this.input3.y, true);
        } else if (pos === '0') {
            drawConnection(this.input1.x, this.input1.y, this.input2.x, this.input2.y, true);
        }
        // 'I+II' — без соединений
    }
};

// Добавляем в глобальные массивы
window.omSwitchT = omSwitchT;
window.schemeElements.push(omSwitchT);
// =====================================================================================================================
// === ВЫКЛЮЧАТЕЛЬ РММ (ПУ1 / ПУ2) ===
const rmmSwitch = {
    // Положения: 'PU1', 'PU2'
    position: 'PU1', // по умолчанию включён в положение "ПУ1"

    // Области клика на схеме (если нужно управлять по схеме)
    areas: {
        PU1: { x1: 210, y1: 315, x2: 260, y2: 335 },   // зона "ПУ1"
        PU2: { x1: 210, y1: 363, x2: 260, y2: 383 }    // зона "ПУ2"
    },

    // Контакты
    contacts: {
        PU1: { // нормально разомкнутый, активен при position === 'PU1'
            inX: 227, inY: 325,
            outX: 251, outY: 325
        },
        PU2: { // нормально разомкнутый, активен при position === 'PU2'
            inX: 227, inY: 373,
            outX: 251, outY: 373
        }
    },

    // Проверка клика — только по активным зонам
    isClickable(x, y) {
        const pu1 = this.areas.PU1;
        const pu2 = this.areas.PU2;
        return (
            (x >= pu1.x1 && x <= pu1.x2 && y >= pu1.y1 && y <= pu1.y2) ||
            (x >= pu2.x1 && x <= pu2.x2 && y >= pu2.y1 && y <= pu2.y2)
        );
    },

    // Обработка клика
    onClick(x, y) {
        const pu1 = this.areas.PU1;
        const pu2 = this.areas.PU2;

        if (x >= pu1.x1 && x <= pu1.x2 && y >= pu1.y1 && y <= pu1.y2) {
            this.setPosition('PU1');
        } else if (x >= pu2.x1 && x <= pu2.x2 && y >= pu2.y1 && y <= pu2.y2) {
            this.setPosition('PU2');
        }
    },

    // Установка положения
    setPosition(pos) {
        if (['PU1', 'PU2'].includes(pos)) {
            this.position = pos;
            // Обновляем кнопки на панели
            updateRmmButtons();
            requestRedraw();
        }
    },

    // Правила распространения напряжения
    getPropagationRules(plusPoints) {
        const rules = [];
        const pos = this.position;

        if (pos === 'PU1') {
            const hasInput = plusPoints.has(`${this.contacts.PU1.inX},${this.contacts.PU1.inY}`);
            if (hasInput) {
                rules.push({
                    type: 'plus',
                    from: `${this.contacts.PU1.inX},${this.contacts.PU1.inY}`,
                    to: `${this.contacts.PU1.outX},${this.contacts.PU1.outY}`
                });
            }
        }

        if (pos === 'PU2') {
            const hasInput = plusPoints.has(`${this.contacts.PU2.inX},${this.contacts.PU2.inY}`);
            if (hasInput) {
                rules.push({
                    type: 'plus',
                    from: `${this.contacts.PU2.inX},${this.contacts.PU2.inY}`,
                    to: `${this.contacts.PU2.outX},${this.contacts.PU2.outY}`
                });
            }
        }

        return rules;
    },
        // Отрисовка линий контактов
    draw(ctx, networks) {
        const { plusPoints } = networks;

        const drawContact = (contact, isActive) => {
            const hasInput = plusPoints.has(`${contact.inX},${contact.inY}`);
            const lineColor = hasInput && isActive ? '#c00' : '#000';

            ctx.beginPath();
            ctx.moveTo(contact.inX, contact.inY);
            ctx.lineTo(contact.inX + 10, contact.inY);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(contact.outX, contact.outY);
            ctx.lineTo(contact.outX - 6, contact.outY);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 3;
            ctx.stroke();

            if (isActive) {
                ctx.beginPath();
                ctx.moveTo(contact.outX, contact.outY);
                ctx.lineTo(contact.inX, contact.inY);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(contact.outX - 6, contact.inY);
                ctx.lineTo(contact.outX - 15, contact.outY - 8);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        };

        drawContact(this.contacts.PU1, this.position === 'PU1');
        drawContact(this.contacts.PU2, this.position === 'PU2');
    }
};

// Добавляем в глобальные массивы
window.rmmSwitch = rmmSwitch;
window.schemeElements.push(rmmSwitch);

// === ФУНКЦИЯ ОБНОВЛЕНИЯ КНОПОК РММ ===
function updateRmmButtons() {
    const btnPU1 = document.getElementById('btn-rmm-pu1');
    const btnPU2 = document.getElementById('btn-rmm-pu2');

    if (btnPU1) btnPU1.classList.toggle('btn-on', rmmSwitch.position === 'PU1');
    if (btnPU2) btnPU2.classList.toggle('btn-on', rmmSwitch.position === 'PU2');
}

// === УСТАНОВКА ПОЛОЖЕНИЯ РММ С ПАНЕЛИ ===
function setRmmPosition(pos) {
    if (['PU1', 'PU2'].includes(pos)) {
        rmmSwitch.setPosition(pos);
    }
}
// =====================================================================================================================
// === ВЫКЛЮЧАТЕЛЬ ЭПК (нормально разомкнутый) ===
const epkSwitch = {
    inX: 167,
    inY: 325,
    outX: 200,
    outY: 325,
    isClosed: false, // по умолчанию — разомкнут

    isClickable(x, y) {
        // Проверка, попал ли клик в зону выключателя (по входу и выходу)
        return x >= this.inX - 10 && x <= this.outX + 10 &&
               y >= this.inY - 10 && y <= this.inY + 10;
    },

    onClick() {
        // Переключаем состояние при клике
        this.isClosed = !this.isClosed;
        requestRedraw();
    },

    getPropagationRules(plusPoints) {
        const rules = [];
        const hasInput = plusPoints.has(`${this.inX},${this.inY}`);

        // Передаёт напряжение только если контакт замкнут и есть питание на входе
        if (this.isClosed && hasInput) {
            rules.push({
                type: 'plus',
                from: `${this.inX},${this.inY}`,
                to: `${this.outX},${this.outY}`
            });
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints } = networks;
        const hasInput = plusPoints.has(`${this.inX},${this.inY}`);
        const inputColor = hasInput ? '#c00' : '#000';
        const lineColor = this.isClosed && hasInput ? '#c00' : '#000';

        // Линия входа
        ctx.beginPath();
        ctx.moveTo(this.inX, this.inY);
        ctx.lineTo(this.inX + 10, this.inY);
        ctx.strokeStyle = inputColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Линия выхода
        ctx.beginPath();
        ctx.moveTo(this.outX, this.outY);
        ctx.lineTo(this.outX - 10, this.outY);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.isClosed) {
            // Замкнутое состояние — соединяем
            ctx.beginPath();
            ctx.moveTo(this.inX, this.inY);
            ctx.lineTo(this.outX, this.outY);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Косая черта, показывающая разрыв
            ctx.beginPath();
            ctx.moveTo(this.outX - 10, this.outY);
            ctx.lineTo(this.inX + 6, this.inY - 8);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
};

// Добавляем в глобальные массивы
window.epkSwitch = epkSwitch;
window.schemeElements.push(epkSwitch);
// =====================================================================================================================
// === ВЫКЛЮЧАТЕЛЬ "УМ ПУ1" (двухконтактный, нормально разомкнутый) ===
const umPu1Switch = {
    contact1: {
        inX: 304, inY: 325,
        outX: 342, outY: 325
    },
    contact2: {
        inX: 304, inY: 314,
        outX: 342, outY: 314
    },
    isClosed: false,

    isClickable(x, y) {
        return (
            (x >= this.contact1.inX - 10 && x <= this.contact1.outX + 10 &&
             y >= this.contact1.inY - 10 && y <= this.contact1.inY + 10) ||
            (x >= this.contact2.inX - 10 && x <= this.contact2.outX + 10 &&
             y >= this.contact2.inY - 10 && y <= this.contact2.inY + 10)
        );
    },

    onClick() {
        this.isClosed = !this.isClosed;
        requestRedraw();
    },

    getPropagationRules(plusPoints) {
        const rules = [];
        if (!this.isClosed) return rules;

        const hasInput1 = plusPoints.has(`${this.contact1.inX},${this.contact1.inY}`);
        const hasInput2 = plusPoints.has(`${this.contact2.inX},${this.contact2.inY}`);

        if (hasInput1) {
            rules.push({
                type: 'plus',
                from: `${this.contact1.inX},${this.contact1.inY}`,
                to: `${this.contact1.outX},${this.contact1.outY}`
            });
        }
        if (hasInput2) {
            rules.push({
                type: 'plus',
                from: `${this.contact2.inX},${this.contact2.inY}`,
                to: `${this.contact2.outX},${this.contact2.outY}`
            });
        }

        return rules;
    },

    draw(ctx, networks) {
        const { plusPoints } = networks;

        const drawContact = (contact, isActive) => {
            const hasInput = plusPoints.has(`${contact.inX},${contact.inY}`);
            const lineColor = hasInput && isActive ? '#c00' : '#000';

            ctx.beginPath();
            ctx.moveTo(contact.inX, contact.inY);
            ctx.lineTo(contact.inX + 10, contact.inY);
            ctx.strokeStyle = hasInput ? '#c00' : '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(contact.outX, contact.outY);
            ctx.lineTo(contact.outX - 10, contact.outY);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.stroke();

            if (isActive) {
                ctx.beginPath();
                ctx.moveTo(contact.inX + 10, contact.inY);
                ctx.lineTo(contact.outX - 10, contact.outY);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(contact.outX - 10, contact.outY);
                ctx.lineTo(contact.inX + 15, contact.inY - 8);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        };

        drawContact(this.contact1, this.isClosed);
        drawContact(this.contact2, this.isClosed);
    }
};

// Добавляем в глобальные массивы
window.umPu1Switch = umPu1Switch;
window.schemeElements.push(umPu1Switch);
// =====================================================================================================================
// === ВЫКЛЮЧАТЕЛЬ "УМ ПУ2" (двухконтактный, нормально разомкнутый) ===
const umPu2Switch = {
    contact1: {
        inX: 304, inY: 373,
        outX: 342, outY: 373
    },
    contact2: {
        inX: 304, inY: 361,
        outX: 342, outY: 361
    },
    isClosed: false,

    isClickable(x, y) {
        return (
            x >= this.contact1.inX - 10 && x <= this.contact1.outX + 10 &&
            y >= this.contact1.inY - 10 && y <= this.contact1.inY + 10
        );
    },

    onClick() {
        this.isClosed = !this.isClosed;
        requestRedraw();
    },

    getPropagationRules(plusPoints) {
        const rules = [];
        if (!this.isClosed) return rules;

        const hasInput = plusPoints.has(`${this.contact1.inX},${this.contact1.inY}`);

        if (hasInput) {
            rules.push({
                type: 'plus',
                from: `${this.contact1.inX},${this.contact1.inY}`,
                to: `${this.contact1.outX},${this.contact1.outY}`
            });
            rules.push({
                type: 'plus',
                from: `${this.contact2.inX},${this.contact2.inY}`,
                to: `${this.contact2.outX},${this.contact2.outY}`
            });
        }

        return rules;
    },

   draw(ctx, networks) {
           const { plusPoints } = networks;

           const drawContact = (contact, isActive) => {
               const hasInput = plusPoints.has(`${contact.inX},${contact.inY}`);
               const lineColor = hasInput && isActive ? '#c00' : '#000';

               ctx.beginPath();
               ctx.moveTo(contact.inX, contact.inY);
               ctx.lineTo(contact.inX + 10, contact.inY);
               ctx.strokeStyle = hasInput ? '#c00' : '#000';
               ctx.lineWidth = 3;
               ctx.stroke();

               ctx.beginPath();
               ctx.moveTo(contact.outX, contact.outY);
               ctx.lineTo(contact.outX - 10, contact.outY);
               ctx.strokeStyle = '#000';
               ctx.lineWidth = 3;
               ctx.stroke();

               if (isActive) {
                   ctx.beginPath();
                   ctx.moveTo(contact.inX + 10, contact.inY);
                   ctx.lineTo(contact.outX - 10, contact.outY);
                   ctx.strokeStyle = lineColor;
                   ctx.lineWidth = 3;
                   ctx.stroke();
               } else {
                   ctx.beginPath();
                   ctx.moveTo(contact.outX - 10, contact.outY);
                   ctx.lineTo(contact.inX + 15, contact.inY - 8);
                   ctx.strokeStyle = '#000';
                   ctx.lineWidth = 2;
                   ctx.stroke();
             }
         };

         drawContact(this.contact1, this.isClosed);
         drawContact(this.contact2, this.isClosed);
     }
 };

// Добавляем в глобальные массивы
window.umPu2Switch = umPu2Switch;
window.schemeElements.push(umPu2Switch);

const canvas = document.getElementById('scheme-canvas');
const ctx = canvas.getContext('2d');
const bgImage = new Image();
bgImage.src = 'Elektr1.png';

// Логические размеры схемы
const SCHEME_WIDTH = 3306;
const SCHEME_HEIGHT = 2464;
canvas.width = SCHEME_WIDTH;
canvas.height = SCHEME_HEIGHT;

// Источники питания
const plusSource = { x: 2125, y: 900, radius: 2, label: '+' };
const minusSource = { x: 2125, y: 938, radius: 2, label: '–' };

// Провода питания
const plusWire = [
    { x: 2125, y: 900 }, { x: 2125, y: 874 },
    { x: 2030, y: 874 }, { x: 2030, y: 920 },
    { x: 2006, y: 920 }
];
const minusWire = [
    { x: 2125, y: 938 }, { x: 2125, y: 956 },
    { x: 2030, y: 956 }, { x: 2030, y: 941 },
    { x: 2006, y: 941 }
];

// === СОСТОЯНИЯ КНОПОК ===
let isSwitchOn = false;
let isUstaOn = false;
let isDisplayOn = false;
let isAlsnMinusOn = false;
let isUstaPlusOn = false;
let isFuelPumpOn = false;
let isMainControlOn = false;
let isKeyBuOn = false;
let isOilPumpOn = false;
let isStopDieselOn = false;
let isFuelPumpTumblerOn = false;
let isPchtOn = false;
let isStartDieselOn = false;

// === КУРСОР И КЛИК ПО СХЕМЕ ===
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let isOverClickable = false;
    window.schemeElements?.forEach(el => {
        if (typeof el.isClickable === 'function' && el.isClickable(x, y)) {
            isOverClickable = true;
        }
    });
    canvas.style.cursor = isOverClickable ? 'pointer' : 'default';
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let clicked = false;
    window.schemeElements?.forEach(el => {
        if (!clicked && typeof el.isClickable === 'function' && el.isClickable(x, y)) {
            if (typeof el.onClick === 'function') {
                el.onClick(x, y);
                requestRedraw();
                clicked = true;
            }
        }
    });
});

// === ОБНОВЛЕНИЕ КНОПОК ===
function updateButtonState(id, isOn) {
    const btn = document.getElementById(id);
    if (btn) {
        btn.className = isOn ? 'btn btn-on' : 'btn btn-off';
    }
}

function updateReversorButtons() {
    const f = document.getElementById('btn-reversor-forward');
    const n = document.getElementById('btn-reversor-neutral');
    const b = document.getElementById('btn-reversor-backward');
    if (f) f.classList.toggle('active', reversorTumbler.position === 'forward');
    if (n) n.classList.toggle('active', reversorTumbler.position === 'neutral');
    if (b) b.classList.toggle('active', reversorTumbler.position === 'backward');
}

function updateOmButtons() {
    const i = document.getElementById('btn-om-i');
    const ii = document.getElementById('btn-om-ii');
    const i_ii = document.getElementById('btn-om-i-ii');
    const z = document.getElementById('btn-om-0');
    if (i) i.classList.toggle('active', omSwitch.position === 'I');
    if (ii) ii.classList.toggle('active', omSwitch.position === 'II');
    if (i_ii) i_ii.classList.toggle('active', omSwitch.position === 'I+II');
    if (z) z.classList.toggle('active', omSwitch.position === '0');
}

function updateRmmButtons() {
    const pu1 = document.getElementById('btn-rmm-pu1');
    const pu2 = document.getElementById('btn-rmm-pu2');
    if (pu1) pu1.classList.toggle('active', rmmSwitch.position === 'PU1');
    if (pu2) pu2.classList.toggle('active', rmmSwitch.position === 'PU2');
}

// === ОБНОВЛЕНИЕ СОСТОЯНИЯ КНОПКИ ЭПК ===
function updateEpkButton() {
    const btn = document.getElementById('btn-epk');
    if (btn) {
        btn.classList.toggle('btn-on', epkSwitch.isClosed);
        btn.classList.toggle('btn-off', !epkSwitch.isClosed);
    }
}

// === ОБНОВЛЕНИЕ КНОПОК УМ ПУ1 И УМ ПУ2 ===
function updateUmButtons() {
    const btnPu1 = document.getElementById('btn-um-pu1');
    const btnPu2 = document.getElementById('btn-um-pu2');
    if (btnPu1) {
        btnPu1.classList.toggle('btn-on', umPu1Switch.isClosed);
        btnPu1.classList.toggle('btn-off', !umPu1Switch.isClosed);
    }
    if (btnPu2) {
        btnPu2.classList.toggle('btn-on', umPu2Switch.isClosed);
        btnPu2.classList.toggle('btn-off', !umPu2Switch.isClosed);
    }
}

// === ИНИЦИАЛИЗАЦИЯ КНОПОК ===
function setupButton(id, handler) {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', handler);
}

function initButtons() {
    const toggleButtons = {
        'btn-disconnect': () => { isSwitchOn = !isSwitchOn; updateButtonState('btn-disconnect', isSwitchOn); },
        'btn-usta': () => { isUstaOn = !isUstaOn; updateButtonState('btn-usta', isUstaOn); },
        'btn-display': () => { isDisplayOn = !isDisplayOn; updateButtonState('btn-display', isDisplayOn); },
        'btn-alsn': () => { isAlsnMinusOn = !isAlsnMinusOn; updateButtonState('btn-alsn', isAlsnMinusOn); },
        'btn-Alsn-plus': () => { isUstaPlusOn = !isUstaPlusOn; updateButtonState('btn-Alsn-plus', isUstaPlusOn); },
        'btn-fuel-pump': () => { isFuelPumpOn = !isFuelPumpOn; updateButtonState('btn-fuel-pump', isFuelPumpOn); },
        'btn-main-control': () => { isMainControlOn = !isMainControlOn; updateButtonState('btn-main-control', isMainControlOn); },
        'btn-key-bu': () => { isKeyBuOn = !isKeyBuOn; updateButtonState('btn-key-bu', isKeyBuOn); },
        'btn-oil-pump': () => { isOilPumpOn = !isOilPumpOn; updateButtonState('btn-oil-pump', isOilPumpOn); },
        'btn-start-diesel': () => { isStartDieselOn = !isStartDieselOn; updateButtonState('btn-start-diesel', isStartDieselOn); },
        'btn-stop-diesel': () => { isStopDieselOn = !isStopDieselOn; updateButtonState('btn-stop-diesel', isStopDieselOn); },
        'btn-fuel-pump-tumbler': () => { isFuelPumpTumblerOn = !isFuelPumpTumblerOn; updateButtonState('btn-fuel-pump-tumbler', isFuelPumpTumblerOn); },
        'btn-pcht': () => { isPchtOn = !isPchtOn; updateButtonState('btn-pcht', isPchtOn); },
        'btn-buk': () => { bukSwitch.isOn = !bukSwitch.isOn; updateButtonState('btn-buk', bukSwitch.isOn); },
        'btn-vpu': () => { vpuSwitch.isOn = !vpuSwitch.isOn; updateButtonState('btn-vpu', vpuSwitch.isOn); },
        'btn-excitation': () => { excitationSwitch.isClosed = !excitationSwitch.isClosed; updateButtonState('btn-excitation', excitationSwitch.isClosed); },
        'btn-exc-tumbler': () => { excitationTumbler.onClick(); updateButtonState('btn-exc-tumbler', excitationTumbler.contact1.isClosed); },
        'btn-rmm-pu1': () => { setRmmPosition('PU1'); },
        'btn-rmm-pu2': () => { setRmmPosition('PU2'); },
        'btn-epk': () => { epkSwitch.isClosed = !epkSwitch.isClosed; updateEpkButton(); requestRedraw(); },
        'btn-um-pu1': () => { umPu1Switch.isClosed = !umPu1Switch.isClosed; updateUmButtons(); requestRedraw(); },
        'btn-um-pu2': () => { umPu2Switch.isClosed = !umPu2Switch.isClosed; updateUmButtons(); requestRedraw(); }
    };

    const reversorButtons = {
        'btn-reversor-forward': () => { reversorTumbler.setPosition('forward'); },
        'btn-reversor-neutral': () => { reversorTumbler.setPosition('neutral'); },
        'btn-reversor-backward': () => { reversorTumbler.setPosition('backward'); }
    };

    const omButtons = {
        'btn-om-i': () => { setOmPosition('I'); },
        'btn-om-ii': () => { setOmPosition('II'); },
        'btn-om-i-ii': () => { setOmPosition('I+II'); },
        'btn-om-0': () => { setOmPosition('0'); }
    };

    Object.keys(toggleButtons).forEach(id => setupButton(id, () => { toggleButtons[id](); requestRedraw(); }));
    Object.keys(reversorButtons).forEach(id => setupButton(id, () => { reversorButtons[id](); updateReversorButtons(); requestRedraw(); }));
    Object.keys(omButtons).forEach(id => setupButton(id, () => { omButtons[id](); updateOmButtons(); requestRedraw(); }));
}

// === ОТРИСОВКА ===
function drawWire(points, color) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
}

function drawPoint(point, fill, label) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.fillText(label, point.x + 6, point.y - 2);
}

// Глобальный объект networks — будет обновляться getActiveNetworks()
let networks = {
    plusPoints: new Set(),
    minusPoints: new Set()
};

function getActiveNetworks() {
    const plusPoints = new Set();
    const minusPoints = new Set();
    let changed = true;

    // === Инициализация источников питания ===
    if (isSwitchOn) {
        plusPoints.add('1980,920');
        plusPoints.add('1982,871');
        minusPoints.add('1980,940');
        minusPoints.add('2006,952');
    }

    while (changed) {
        changed = false;

        // === 1. Обновляем состояния элементов ===
        window.schemeElements?.forEach(el => {
            typeof el.update === 'function' && el.update(plusPoints, minusPoints);
        });

        // === 2. Распространение по проводам — invisible НЕ мешает логике ===
        window.allPostSwitchWires?.forEach(wire => {
            const points = wire.points.map(p => `${p.x},${p.y}`);

            // Передача напряжения — ДАЖЕ если провод invisible
            if (wire.type === 'plus' || wire.type === 'minus') {
                const set = wire.type === 'plus' ? plusPoints : minusPoints;
                if (points.some(p => set.has(p))) {
                    points.forEach(p => !set.has(p) && set.add(p) && (changed = true));
                }
            } else {
                if (points.some(p => plusPoints.has(p))) {
                    points.forEach(p => !plusPoints.has(p) && plusPoints.add(p) && (changed = true));
                }
                if (points.some(p => minusPoints.has(p))) {
                    points.forEach(p => !minusPoints.has(p) && minusPoints.add(p) && (changed = true));
                }
            }
        });

        // === 3. Правила элементов ===
        window.schemeElements?.forEach(el => {
            if (typeof el.getPropagationRules === 'function') {
                el.getPropagationRules(plusPoints, minusPoints).forEach(rule => {
                    const set = rule.type === 'plus' ? plusPoints : minusPoints;
                    if (set.has(rule.from) && !set.has(rule.to)) {
                        set.add(rule.to);
                        changed = true;
                    } else if (set.has(rule.to) && !set.has(rule.from)) {
                        set.add(rule.from);
                        changed = true;
                    }
                });
            }
        });
    }

    networks = { plusPoints, minusPoints };
    return networks;
}

function getWireColor(wire, networks) {
    const { plusPoints, minusPoints } = networks;
    const key = `${wire.points[0].x},${wire.points[0].y}`;
    if (wire.name === 'УСТА_линия') return isUstaOn && plusPoints.has('1888,806') ? '#c00' : '#000';
    if (wire.name === 'Дисплей_линия') return isDisplayOn && plusPoints.has('1913,852') ? '#c00' : '#000';
    return wire.type === 'plus' ? (plusPoints.has(key) ? '#c00' : '#000') : (minusPoints.has(key) ? '#008000' : '#000');
}

let isRedrawPending = false;
function requestRedraw() {
    if (!isRedrawPending) {
        isRedrawPending = true;
        requestAnimationFrame(() => {
            draw();
            isRedrawPending = false;
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (bgImage.complete && bgImage.naturalWidth) {
        ctx.globalAlpha = 0.75;
        ctx.drawImage(bgImage, 0, 0, SCHEME_WIDTH, SCHEME_HEIGHT);
        ctx.globalAlpha = 1.0;
    }
    drawWire(plusWire, '#c00');
    drawWire(minusWire, '#008000');
    const nets = getActiveNetworks();
    window.allPostSwitchWires?.forEach(wire => !wire.invisible && drawWire(wire.points, getWireColor(wire, nets)));
    drawPoint(plusSource, '#f00', '+');
    drawPoint(minusSource, '#008000', '–');
    window.schemeElements?.forEach(el => typeof el.draw === 'function' && el.draw(ctx, nets));
}

bgImage.onload = () => draw();
bgImage.onerror = () => { console.error('Ошибка загрузки изображения Elektr1.png'); draw(); };
window.draw = draw;

// === АНИМАЦИЯ ===
function startGlobalAnimation() {
    if (!window.animationRunning) {
        window.animationRunning = true;
        function animate() {
            const nets = getActiveNetworks();
            window.animatedElements.forEach(el => typeof el.update === 'function' && el.update(nets.plusPoints, nets.minusPoints));
            window.animatedElements.forEach(el => typeof el.animate === 'function' && el.animate());
            requestRedraw();
            requestAnimationFrame(animate);
        }
        animate();
    }
}
startGlobalAnimation();

// === ГЛОБАЛЬНЫЙ ДОСТУП К СЕТЯМ ДЛЯ МОДУЛЕЙ ===
window.getNetworks = () => networks;

// === ИНИЦИАЛИЗАЦИЯ ===
window.addEventListener('load', () => {
    initButtons();
    updateButtonState('btn-disconnect', isSwitchOn);
    updateButtonState('btn-usta', isUstaOn);
    updateButtonState('btn-display', isDisplayOn);
    updateButtonState('btn-alsn', isAlsnMinusOn);
    updateButtonState('btn-Alsn-plus', isUstaPlusOn);
    updateButtonState('btn-fuel-pump', isFuelPumpOn);
    updateButtonState('btn-main-control', isMainControlOn);
    updateButtonState('btn-key-bu', isKeyBuOn);
    updateButtonState('btn-oil-pump', isOilPumpOn);
    updateButtonState('btn-start-diesel', isStartDieselOn);
    updateButtonState('btn-stop-diesel', isStopDieselOn);
    updateButtonState('btn-fuel-pump-tumbler', isFuelPumpTumblerOn);
    updateButtonState('btn-pcht', isPchtOn);
    updateButtonState('btn-buk', bukSwitch.isOn);
    updateButtonState('btn-vpu', vpuSwitch.isOn);
    updateButtonState('btn-excitation', excitationSwitch.isClosed);
    updateButtonState('btn-exc-tumbler', excitationTumbler.contact1.isClosed);
    updateReversorButtons();
    updateOmButtons();
    updateRmmButtons();
    updateEpkButton();
    updateUmButtons();
});
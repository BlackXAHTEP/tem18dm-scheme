/**
 * jumpers.js — динамические перемычки для схемы ТЭМ18ДМ
 * Функции:
 * - Режим: клик на точку → клик на другую → создание провода
 * - Автоопределение типа (+/-) по первой точке
 * - Подсветка всех точек подключения в режиме
 * - Удаление ПКМ с очисткой из allPostSwitchWires
 */

let isJumperMode = false;        // активен ли режим
let jumperStartPoint = null;     // начальная точка
let tempJumper = null;           // временная линия до мыши

window.jumpers = [];             // массив активных перемычек

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('toggle-jumper-mode');
    if (!btn) {
        console.warn('[jumpers.js] Кнопка "toggle-jumper-mode" не найдена. Добавь её в index.html.');
        return;
    }

    btn.addEventListener('click', () => {
        isJumperMode = !isJumperMode;
        btn.classList.toggle('active', isJumperMode);
        if (isJumperMode) {
            jumperStartPoint = null;
            tempJumper = null;
            requestRedraw();
        }
    });
});

// === ОБРАБОТКА КЛИКОВ ===
document.getElementById('scheme-canvas').addEventListener('click', (e) => {
    if (!isJumperMode || !window.connectionPoints) return;

    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const point = findNearestConnectionPoint(x, y);
    if (!point) return;

    if (!jumperStartPoint) {
        // Первый клик — начало перемычки
        jumperStartPoint = point;
        tempJumper = { from: point, to: null };
        requestRedraw();
    } else {
        // Второй клик — завершение
        if (point === jumperStartPoint) {
            // Клик в ту же точку — отмена
            jumperStartPoint = null;
            tempJumper = null;
        } else {
            // Создаём новую перемычку
            const wire = addWire(
                `Перемычка ${window.jumpers.length + 1}`,
                [
                    { x: point.x, y: point.y },
                    { x: jumperStartPoint.x, y: jumperStartPoint.y }
                ],
                jumperStartPoint.wireType,
                false
            );

            window.jumpers.push({
                from: jumperStartPoint,
                to: point,
                wireType: jumperStartPoint.wireType,
                name: `Перемычка ${window.jumpers.length + 1}`,
                wire: wire  // сохраняем ссылку на провод
            });

            console.log(`[jumpers.js] Перемычка создана: ${wire.name} (${wire.type})`);
        }

        // Сброс состояния
        jumperStartPoint = null;
        tempJumper = null;
        requestRedraw();
    }
});

// === ПОИСК БЛИЖАЙШЕЙ ТОЧКИ ===
function findNearestConnectionPoint(x, y) {
    const threshold = 15; // радиус поиска в пикселях
    let nearest = null;
    let minDist = threshold;

    for (const p of window.connectionPoints) {
        const dist = Math.hypot(p.x - x, p.y - y);
        if (dist < minDist) {
            minDist = dist;
            nearest = p;
        }
    }

    return nearest;
}

// === УДАЛЕНИЕ ПЕРЕМЫЧКИ (по ПКМ) ===
document.getElementById('scheme-canvas').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (!isJumperMode) return;

    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = window.jumpers.length - 1; i >= 0; i--) {
        const j = window.jumpers[i];
        if (isPointNearLine(x, y, j)) {
            if (confirm(`Удалить перемычку "${j.name}"?`)) {
                // Удаляем из allPostSwitchWires
                const wireIndex = window.allPostSwitchWires.findIndex(w => w === j.wire);
                if (wireIndex !== -1) {
                    window.allPostSwitchWires.splice(wireIndex, 1);
                    console.log(`[jumpers.js] Провод удалён: ${j.wire.name}`);
                }

                // Удаляем из jumpers
                window.jumpers.splice(i, 1);

                requestRedraw();
            }
            break;
        }
    }
});

// === ВСПОМОГАТЕЛЬНАЯ: проверка, близко ли к линии ===
function isPointNearLine(px, py, line) {
    const { from, to } = line;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy);
    if (length === 0) return false;

    const t = ((px - from.x) * dx + (py - from.y) * dy) / (length * length);
    const projX = from.x + t * dx;
    const projY = from.y + t * dy;

    const distance = Math.hypot(px - projX, py - projY);
    return distance < 10;
}

// === ОТРИСОВКА ПЕРЕМЫЧЕК И ПОДСВЕТКА ТОЧЕК ===
window.addJumperDrawHandler = function(ctx) {
    // --- 1. Отрисовка существующих перемычек ---
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    for (const jumper of window.jumpers) {
        ctx.strokeStyle = jumper.wireType === 'plus' ? '#c00' : '#008000';
        ctx.beginPath();
        ctx.moveTo(jumper.from.x, jumper.from.y);
        ctx.lineTo(jumper.to.x, jumper.to.y);
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.fillRect(jumper.from.x - 1.5, jumper.from.y - 1.5, 3, 3);
        ctx.fillRect(jumper.to.x - 1.5, jumper.to.y - 1.5, 3, 3);
    }

    // --- 2. Подсветка точек подключения (только в режиме) ---
    if (isJumperMode && window.connectionPoints) {
        const mouse = window.mousePos || { x: 0, y: 0 };

        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';

        for (const point of window.connectionPoints) {
            const distToMouse = Math.hypot(point.x - mouse.x, point.y - mouse.y);
            const isHovered = distToMouse < 15;

            // Заливка: жёлтая при наведении
            ctx.fillStyle = isHovered ? '#ff0' : '#ccc';
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            ctx.fill();

            // Обводка: красная для "+", зелёная для "–"
            ctx.strokeStyle = point.wireType === 'plus' ? '#c00' : '#008000';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Подпись при наведении
            if (isHovered) {
                ctx.fillStyle = '#000';
                ctx.fillText(`${point.name} (${point.wireType})`, point.x + 10, point.y - 10);
            }
        }

        // --- 3. Временная линия при создании ---
        if (tempJumper && tempJumper.from) {
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 4]);
            ctx.strokeStyle = '#00f';
            ctx.beginPath();
            ctx.moveTo(tempJumper.from.x, tempJumper.from.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.fillText('→ кликните на вторую точку', mouse.x + 10, mouse.y);
        }
    }
};

// === ПОДДЕРЖКА МЫШИ (вызывается из main.js) ===
window.updateJumperMousePosition = function(x, y) {
    window.mousePos = { x, y };
};
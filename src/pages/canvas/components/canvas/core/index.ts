import Shape from "@src/pages/canvas/components/canvas/core/shapes";
import Line from "@src/pages/canvas/components/canvas/core/shapes/line";
import {initialShape, keysShape} from "@src/pages/canvas/components/canvas/core/shapes/types";
import * as shapes from './shapes/export';

/**
 * Класс для управления canvas
 */
class CanvasManager {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null = null;
    private currentLine: Line | null = null;
    private isDrawing: boolean;
    private shapes: Shape[];
    private cachedShapes: Map<string, ImageData>;
    private startX: number;
    private startY: number;
    private selectedColor: Color;
    private selectedShape: keysShape;
    private currentShape: initialShape | null = null;
    private lineWidth: number;
    private filling: boolean;
    private fillingColor: Color;
    // Значения зума: зум, шаг, зажатая клавиша Ctrl
    private scale: number;
    private zoomStep: number;
    private isCtrlPressed: boolean;
    private maxZoom: number;
    // Добавляем переменные для хранения скорректированных координат мыши
    private centerX: number = 0;
    private centerY: number = 0;
    private offsetX: number = 0;
    private offsetY: number = 0;

    /**
     * Создает экземпляр CanvasManager.
     * @param canvasElement - Элемент canvas, на котором будет происходить рисование.
     * @param [lineWidth=1] - Ширина линии по умолчанию.
     * @param [selectedColor='#000'] - Выбранный цвет по умолчанию в формате '#RRGGBB' или 'название_цвета'.
     * @param [zoomStep=0.25] - Шаг изменения зума.
     */
    constructor(canvasElement: HTMLCanvasElement, lineWidth: number = 1, selectedColor: Color = '#000', zoomStep = 0.25, maxZoom = 5) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.isDrawing = false;
        this.shapes = [];
        this.cachedShapes = new Map();
        this.startX = 0;
        this.startY = 0;
        this.selectedColor = selectedColor;
        this.selectedShape = 'Line'; // Фигура по умолчанию
        this.lineWidth = lineWidth;
        this.filling = false; // Флаг заливки фигур
        this.fillingColor = selectedColor;
        this.scale = 1; // Исходный масштаб
        this.zoomStep = zoomStep;
        this.maxZoom = maxZoom;
        this.isCtrlPressed = false; // Флаг зажатия клавиши Ctrl

        // Добавление обработчиков событий
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('mouseout', this.handleMouseOut);
        this.canvas.addEventListener('wheel', this.handleWheel);

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);

        // Запуск основного цикла отрисовки
        requestAnimationFrame(this.drawLoop.bind(this));
    }

    // Добавляем методы для обработки событий нажатия и отпускания клавиши Ctrl
    private handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Control') {
            event.preventDefault();
            this.isCtrlPressed = true;
        }
    }

    private handleKeyUp = (event: KeyboardEvent) => {
        if (event.key === 'Control') {
            event.preventDefault();
            this.isCtrlPressed = false;
        }
    }

    /**
     * Обработчик события колеса мыши.
     * @param event - Событие колеса мыши.
     */
    private handleWheel = (event: WheelEvent) => {
        if (this.isCtrlPressed) {
            event.preventDefault();
            const delta = event.deltaY > 0 ? -1 : 1;
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            if (delta < 0) {
                this.zoomOut(mouseX, mouseY);
            } else {
                this.zoomIn(mouseX, mouseY);
            }
        }
    }

    /**
     * Увеличивает зум.
     * @param mouseX - Позиция по X курсора мыши.
     * @param mouseY - Позиция по Y курсора мыши.
     */
    private zoomIn(mouseX: number, mouseY: number) {
        if (this.scale < this.maxZoom) {
            const prevScaleFactor = this.scale;
            this.scale += this.zoomStep;
            this.scale = Math.min(this.maxZoom, this.scale);

            // Корректируем смещение относительно центра холста
            const scaleFactor = this.scale / prevScaleFactor;
            this.centerX -= (mouseX - this.centerX) * (scaleFactor - 1);
            this.centerY -= (mouseY - this.centerY) * (scaleFactor - 1);
        }
    }

    /**
     * Уменьшает скэйл
     * @param mouseX - Позиция по X курсора мыши.
     * @param mouseY - Позиция по Y курсора мыши.
     */
    private zoomOut(mouseX: number, mouseY: number) {
        if (this.scale > 1) {
            const prevScaleFactor = this.scale;
            this.scale = Math.max(1, this.scale - this.zoomStep);
            const scaleFactor = this.scale / prevScaleFactor;
            // Уменьшаем масштаб холста
            this.centerX -= (mouseX - this.centerX) * (scaleFactor - 1);
            this.centerY -= (mouseY - this.centerY) * (scaleFactor - 1);

            // Если масштаб стал равным 1, возвращаем холст в исходное положение
            if (this.scale === 1) {
                this.startZoomAnimation(this.centerX, this.centerY, 0, 0);
            }
        }
    }

    /**
     * Начинает анимацию зума
     * @param startX - Начальная позиция по X.
     * @param startY - Начальная позиция по Y.
     * @param endX - Конечная позиция по X.
     * @param endY - Конечная позиция по Y.
     * @param animationDuration - Задержка.
     */
    private startZoomAnimation(startX: number, startY: number, endX: number, endY: number, animationDuration = 300) {
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1); // Прогресс анимации от 0 до 1

            // Интерполируем текущие координаты холста для плавного движения
            this.centerX = this.interpolate(startX, endX, progress);
            this.centerY = this.interpolate(startY, endY, progress);

            // Перерисовываем холст с учетом новых координат
            this.drawLoop();

            // Продолжаем анимацию, если время еще не истекло
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        // Запускаем анимацию
        requestAnimationFrame(animate);
    }

    /**
     * Интерполирует значение между начальным и конечным значениями с заданным прогрессом.
     * @param start - Начальное значение.
     * @param end - Конечное значение.
     * @param progress - Прогресс анимации от 0 до 1.
     * @returns {number} - Интерполированное значение.
     */
    private interpolate(start: number, end: number, progress: number): number {
        return start + (end - start) * progress;
    }

    /**
     * Обработчик события нажатия кнопки мыши.
     * @param e - Событие нажатия кнопки мыши.
     */
    private handleMouseDown = (e: MouseEvent) => {
        if (!this.ctx) return;
        const {offsetX, offsetY} = e;
        this.startX = offsetX;
        this.startY = offsetY;
        this.isDrawing = true;
        this.currentShape = new shapes[this.selectedShape](this.selectedShape, offsetX, offsetY, offsetX, offsetY, this.lineWidth, this.selectedColor, this.filling, this.fillingColor)
        this.shapes.push(this.currentShape);
    };

    /**
     * Обработчик события движения мыши.
     * @param e - Событие нажатия кнопки мыши.
     */
    private handleMouseMove = (e: MouseEvent) => {
        this.canvas.style.cursor = 'auto'
        if (!this.isDrawing || !this.ctx) return;
        const {offsetX, offsetY} = e;
        if (this.currentShape && this.isDrawing) {
            this.currentShape.movingWhileDrawing(offsetX, offsetY)
            this.canvas.style.cursor = 'crosshair'
        }
    };

    private handleMouseUp = () => {
        if (this.currentShape) {
            // Добавляем текущую фигуру в массив фигур
            this.shapes.push(this.currentShape);

            // Получаем уникальный идентификатор фигуры
            const shapeID = this.currentShape.uniqueID;

            // Создаем временный холст и контекст рисования
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = this.canvas.width;
            tempCanvas.height = this.canvas.height;
            const tempCtx = tempCanvas.getContext('2d');

            if (tempCtx) {
                // Отрисовываем фигуру на временном холсте
                this.currentShape.draw(tempCtx);

                // Получаем ImageData из временного холста и сохраняем его в кэше
                const imageData = tempCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                this.cachedShapes.set(shapeID, imageData);
            }

            // Очищаем текущую фигуру
            this.currentShape = null;
        }
        this.isDrawing = false;
    };
    private handleMouseOut = () => {
        this.isDrawing = false;
    };

    private drawLoop() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Применяем текущий масштаб и смещение при перерисовке
            this.ctx.setTransform(this.scale, 0, 0, this.scale, this.centerX, this.centerY);
            this.shapes.forEach(shape => {
                //const cachedShape = this.cachedShapes.get(shape.getUniqueID())
                /*if (this.ctx && cachedShape) {
                    this.ctx?.putImageData(cachedShape, 0, 0);
                } else {*/
                    shape.draw(this.ctx!)
                //}
            });
        }
        requestAnimationFrame(this.drawLoop.bind(this));
    };

    public setSelectedShape(shape: keysShape) {
        this.selectedShape = shape;
    }

    public setLineWidth(width: number) {
        this.lineWidth = width;
    }

    public setSelectedColor(newColor: Color) {
        this.selectedColor = newColor;
    }

    public setFillingShapes() {
        this.filling = !this.filling
    }

    public setFillingColor(color: Color) {
        this.fillingColor = color
    }

    public clearCanvas() {
        this.ctx!.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
        this.shapes = []
    }

    public removeEventListeners() {
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('mouseout', this.handleMouseOut);
    }
}

export default CanvasManager;

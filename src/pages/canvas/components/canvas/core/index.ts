import Shape from "@src/pages/canvas/components/canvas/core/shapes";
import {figures, initialShape, keysShape, TFiguresKeys} from "@src/pages/canvas/components/canvas/core/shapes/types";
import * as shapes from './shapes/export';
import ShapeGrid from "@src/pages/canvas/components/canvas/core/utils/shape-grid";

/**
 * Класс для управления canvas
 */
class CanvasManager {
  private root: HTMLElement | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private isDrawing: boolean = false;
  private shapes: Shape[] = [];
  private selectedColor: Color;
  private selectedShape: keysShape;
  private currentShape: initialShape | null = null;
  private grabbingShape: initialShape | null = null;
  private lineWidth: number;
  private filling: boolean = false;
  private fillingColor: Color;
  // Значения зума: зум, шаг
  private scale: number = 1;
  private zoomStep: number;
  private maxZoom: number;
  private minZoom: number;
  private spacePress: boolean;
  private changPositionCanvas: boolean;
  // Добавляем переменные для хранения скорректированных координат мыши
  private centerX: number = 0;
  private centerY: number = 0;

  private shapeGrid: ShapeGrid; // Добавляем свойство для хранения сетки фигур

  /**
   * Создает экземпляр CanvasManager.
   * @param canvasContainer - Элемент canvas, на котором будет происходить рисование.
   * @param [lineWidth=1] - Ширина линии по умолчанию.
   * @param [selectedColor='#000'] - Выбранный цвет по умолчанию в формате '#RRGGBB' или 'название_цвета'.
   * @param [zoomStep=0.25] - Шаг изменения зума.
   * @param [maxZoom=5] - максимальный зум.
   * @param [minZoom=1] - минимальный зум
   */


  constructor(canvasContainer: HTMLElement, lineWidth: number = 1, selectedColor: Color = '#000', zoomStep = 0.25, maxZoom = 5, minZoom = 1) {

    this.root = canvasContainer;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    // Монтирование комопнента в контейнер
    canvasContainer.appendChild(this.canvas)
    this.resize()

    this.selectedColor = selectedColor;
    this.selectedShape = 'CurvedLine'; // Фигура по умолчанию
    this.lineWidth = lineWidth;
    this.fillingColor = selectedColor;
    this.zoomStep = zoomStep;
    this.maxZoom = maxZoom;
    this.minZoom = minZoom;
    this.spacePress = false;
    this.changPositionCanvas = false;

    this.shapeGrid = new ShapeGrid(50); // Размер ячейки сетки: 50x50

    // Добавление обработчиков событий
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.canvas.addEventListener('mouseout', this.handleMouseOut);
    this.canvas.addEventListener('wheel', this.handleWheel);

    window.addEventListener('keydown', this.keyDown);
    window.addEventListener('keyup', this.keyUp);
    window.addEventListener('resize', this.resize)

    // Запуск основного цикла отрисовки
    requestAnimationFrame(this.drawLoop.bind(this));
  }


  /**
   * Обработка отпускания клавиш клавиатуры
   * @param e - эвент события клавиатуры
   * */
  private keyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      this.canvas.style.cursor = 'grab'
      this.spacePress = true;
    }
  }
  /**
   * Обработка отпускания клавиш клавиатуры
   * @param e - эвент события клавиатуры
   * */
  private keyUp = (e: KeyboardEvent) => {
    if (e.code === 'ControlLeft') {
      e.preventDefault()
      this.grabbingShape?.endDragging()
      this.grabbingShape = null;
      this.canvas.style.cursor = 'auto'
    }
    if (e.code === 'Space') {
      this.spacePress = false;
      this.changPositionCanvas = false;
      this.canvas.style.cursor = 'auto'
      //this.startZoomAnimation(this.centerX, this.centerY, 0, 0)
    }
  }

  /**
   * Функция для изменения и адаптирования размеров canvas
   * */
  resize = () => {
    if (this.root && this.canvas && this.ctx) {
      // Физический размер канвы с учётом плотности пикселей (т.е. канва может быть в разы больше)
      this.canvas.width = this.root.offsetWidth * window.devicePixelRatio;
      this.canvas.height = this.root.offsetHeight * window.devicePixelRatio;
      // Фактический размер канвы
      this.canvas.style.width = `${this.root.offsetWidth}px`;
      this.canvas.style.height = `${this.root.offsetHeight}px`;
      // Общая трансформация - все координаты будут увеличиваться на dpr, чтобы фигуры рисовались в увеличенном (в физическом) размере
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  };

  /**
   * Обработчик события колеса мыши.
   * @param event - Событие колеса мыши.
   */
  private handleWheel = (event: WheelEvent) => {
    if (event.ctrlKey) {
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
    if (this.scale > this.minZoom) {
      const prevScaleFactor = this.scale;
      this.scale = Math.max(this.minZoom, this.scale - this.zoomStep);
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
    const {offsetX, offsetY} = this.calculatingMouseCoordinates(e)

    if (this.spacePress) {
      this.changPositionCanvas = true;
      this.canvas.style.cursor = 'grabbing'
      return;
    }

    if (e.ctrlKey) {
      this.shapes.forEach(shape => {
        const grabbingShape = shape.startDragging(offsetX, offsetY);
        if (grabbingShape) {
          this.canvas.style.cursor = 'grabbing'
          //@ts-ignore
          this.grabbingShape = shape
        }
      })
    } else {
      this.isDrawing = true;
      this.currentShape = new shapes[this.selectedShape](this.selectedShape, offsetX, offsetY, this.lineWidth, this.selectedColor, this.filling, this.fillingColor)
      this.shapes.push(this.currentShape);
    }
  };

  /**
   * Обработчик события движения мыши.
   * @param e - Событие нажатия кнопки мыши.
   */
  private handleMouseMove = (e: MouseEvent) => {
    if (!this.ctx) {
      return;
    }
    const {offsetX, offsetY} = this.calculatingMouseCoordinates(e)
    if (this.changPositionCanvas) {
      // Пересчитываем смещение холста на основе разницы текущей позиции и предыдущей позиции мыши
      this.centerX += (e.movementX / this.scale);
      this.centerY += (e.movementY / this.scale);
      return;
    }
    if (e.ctrlKey) {
      if (!this.grabbingShape) {
        this.shapes.forEach(shape => {
          if (shape.isPointInside(offsetX, offsetY)) {
            this.canvas.style.cursor = 'grab'
            shape.color = '#0000ff'
          } else {
            this.canvas.style.cursor = 'auto'
            shape.color = 'red'
          }
        })
      } else {
        this.grabbingShape.drag(offsetX, offsetY)
      }
    } else if (this.currentShape && this.isDrawing) {
      this.currentShape.movingWhileDrawing(offsetX, offsetY)
      this.canvas.style.cursor = 'crosshair'
    }
  };

  /**
   * Обработчик "отпускания" клавиши мыши
   * */
  private handleMouseUp = () => {
    this.canvas.style.cursor = 'auto'
    if (this.currentShape) {
      this.currentShape = null;
    }
    this.grabbingShape = null;
    this.isDrawing = false;
  };
  private handleMouseOut = () => {
    this.isDrawing = false;
  };

  public generateRandomShapes(count: number) {
    if (!this.ctx) return;

    const canvasWidth = this.canvas.width * window.devicePixelRatio;
    const canvasHeight = this.canvas.height * window.devicePixelRatio;

    for (let i = 0; i < count; i++) {
      // Генерируем случайные параметры для фигуры
      const randomX = Math.random() * canvasWidth;
      const randomY = Math.random() * canvasHeight;
      const filling = Math.random() > 0.5
      const randomLineWidth = Math.random() * 5 + 1; // Ширина линии от 1 до 5
      const randomStrokeColor: Color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Случайный цвет контура
      const randomFillColor: Color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Случайный цвет заполнения

      // Выбираем случайную фигуру из доступных
      const randomShapeKey: TFiguresKeys = Object.keys(figures)[Math.floor(Math.random() * Object.keys(figures).length)] as TFiguresKeys;
      // Создаем экземпляр случайной фигуры
      const randomShape = new figures[randomShapeKey](
        randomShapeKey,
        randomX,
        randomY,
        randomLineWidth,
        randomStrokeColor,
        filling, // Включаем заполнение
        randomFillColor // Случайный цвет заполнения
      );
      // Добавляем созданную фигуру в массив фигур
      this.shapes.push(randomShape);
      this.shapeGrid.addToCell(randomShape)
    }
  }

  // Расчет координатов мыши
  private calculatingMouseCoordinates = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width; // Масштаб по X
    const scaleY = this.canvas.height / rect.height; // Масштаб по Y

    // Поправка на смещение и масштаб
    const offsetX = ((e.clientX - rect.left) * scaleX - this.centerX) / this.scale;
    const offsetY = ((e.clientY - rect.top) * scaleY - this.centerY) / this.scale;
    return {offsetX, offsetY};
  }






  private drawLoop() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // Применяем текущий масштаб и смещение при перерисовке
      this.ctx.setTransform(this.scale, 0, 0, this.scale, this.centerX, this.centerY);

      this.shapes.forEach(shape => {
        shape.draw(this.ctx!)
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
    this.grabbingShape = null
    this.currentShape = null
    this.shapeGrid = this.shapeGrid = new ShapeGrid(50);
  }

  public removeEventListeners() {
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    this.canvas.removeEventListener('mouseout', this.handleMouseOut);
  }
}

export default CanvasManager;

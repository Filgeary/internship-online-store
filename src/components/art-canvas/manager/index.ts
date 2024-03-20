import Square from '../shapes/square';
import Brush from '../shapes/brush';
import Circle from '../shapes/cirlce';
import Triangle from '../shapes/triangle';

import doShapeCopy from '../utils/do-shape-copy';

import { TShapeOptions, TShapes } from '../shapes/types';
import { TArtImage, TTools } from '@src/store/art/types';
import { TDrawShapesMethods, TDrawingOptions } from './types';
import { TArtCanvasContext } from '../types';

class ArtManager {
  canvasNode: HTMLCanvasElement;
  canvasCtx: CanvasRenderingContext2D;
  isInited: boolean;
  callbacks: TArtCanvasContext['callbacks'];
  values: TArtCanvasContext['values'];
  dpr: number;

  init(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    callbacks: TArtCanvasContext['callbacks'],
    values: TArtCanvasContext['values']
  ) {
    this.canvasNode = canvas;
    this.canvasCtx = ctx;
    this.callbacks = callbacks;
    this.values = values;
    this.isInited = true;

    // Корректные размеры канвы
    this.canvasNode.width = this.canvasNode.clientWidth;
    this.canvasNode.height = this.canvasNode.clientHeight;

    // Размеры с учётом плотности пикселей
    this.dpr = window.devicePixelRatio;

    this.canvasNode.width *= this.dpr;
    this.canvasNode.height *= this.dpr;

    this.scale(this.dpr, this.dpr);

    // Чтобы не ломалось при изменении размеров
    const resizeObserver = new ResizeObserver(() => {
      this.canvasNode.width = this.canvasNode.clientWidth;
      this.canvasNode.height = this.canvasNode.clientHeight;
      this.makeVisibleAllShapes();
    });
    resizeObserver.observe(this.canvasNode);

    this.initBaseLayout();
  }

  /**
   * Обновить обработчики и значения
   */
  update(callbacks: TArtCanvasContext['callbacks'], values: TArtCanvasContext['values']) {
    this.callbacks = callbacks;
    this.values = values;
  }

  /**
   * Инициализационное рисование канваса
   */
  initDrawAll(image: TArtImage) {
    this.clearCanvasPicture();

    this.save();
    this.scale(this.values.scale, this.values.scale);

    if (!image) return;

    if (!image.loaded) {
      image.onload = () => {
        this.clearAndDrawImage(image);

        image.loaded = true;
      };
    } else this.clearAndDrawImage(image);

    this.restore();
  }

  /**
   * Получить координаты, с учётом смещений
   */
  getCoordsByScaleOffsets(scale: number) {
    const scaledWidth = this.canvasNode.width * scale;
    const scaledHeight = this.canvasNode.height * scale;

    const scaleOffsetX = (scaledWidth - this.canvasNode.width) / 2;
    const scaleOffsetY = (scaledHeight - this.canvasNode.height) / 2;

    return {
      x: scaleOffsetX,
      y: scaleOffsetY,
    };
  }

  /**
   * Стереть содержимое канваса
   */
  clearCanvasPicture() {
    this.canvasCtx.clearRect(0, 0, this.canvasNode.width, this.canvasNode.height);
  }

  /**
   * Инициировать загрузку изображения на канвасе
   */
  downloadCanvas() {
    // Для заднего фона на загружаемой картинке
    this.canvasCtx.globalCompositeOperation = 'destination-over';
    this.canvasCtx.fillStyle = this.values.bgColor;
    this.canvasCtx.fillRect(0, 0, this.canvasNode.width, this.canvasNode.height);
    this.canvasCtx.globalCompositeOperation = 'source-over';

    this.getBinary().then((blob: Blob) => {
      const image = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = image;
      link.download = 'canvas_image.jpg';
      link.click();
    });
  }

  /**
   * Сформировать бинарник от канвы
   */
  getBinary(): Promise<Blob> {
    return new Promise((resolve) => {
      this.canvasNode.toBlob(resolve);
    });
  }

  /**
   * Сформировать готовый Image
   */
  getImage(width?: number, height?: number): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      this.getBinary().then((blob) => {
        const image = new Image(width, height);
        image.src = URL.createObjectURL(blob);
        resolve(image);
      });
    });
  }

  /**
   * Залить задний фон прозрачным цветом
   */
  fillBgOpacityColor() {
    this.canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
    this.canvasCtx.fillRect(0, 0, this.canvasNode.width, this.canvasNode.height);
  }

  /**
   * Получить изображение типа ImageData
   */
  getImageData(): ImageData {
    return this.canvasCtx.getImageData(0, 0, this.canvasNode.width, this.canvasNode.height);
  }

  /**
   * Вставить в канву картинку
   */
  putImageData(image: ImageData, dx: number, dy: number) {
    this.canvasCtx.putImageData(image, dx, dy);
  }

  /**
   * Начать рисовать
   */
  beginPath() {
    this.canvasCtx.beginPath();
  }

  /**
   * Закончить рисовать
   */
  closePath() {
    this.canvasCtx.closePath();
  }

  /**
   * Стереть всё и вставить картинку
   */
  clearAndDrawImage(image: TArtImage) {
    this.canvasCtx.clearRect(0, 0, this.canvasNode.width, this.canvasNode.height);
    this.canvasCtx.drawImage(image, 0, 0);
  }

  /**
   * Функционал стёрки
   */
  fillEraser({ width, bgColor, x, y }: { width: number; bgColor: string; x: number; y: number }) {
    this.canvasCtx.lineWidth = width;
    this.canvasCtx.lineCap = 'round';
    this.canvasCtx.globalCompositeOperation = 'destination-out';
    // При переключении заднего фона - останется таким же
    this.canvasCtx.strokeStyle = bgColor;
    this.canvasCtx.lineTo(x, y);
    this.canvasCtx.stroke();

    this.canvasCtx.globalCompositeOperation = 'source-over';
  }

  /**
   * Сохранить состояние канвы
   */
  save() {
    this.canvasCtx.save();
  }

  /**
   * Смещение канвы
   */
  translate(x: number, y: number) {
    this.canvasCtx.translate(x, y);
  }

  /**
   * Приближение канвы
   */
  scale(scaleX: number, scaleY: number) {
    this.canvasCtx.scale(scaleX, scaleY);
  }

  /**
   * Вернуть последнее сохранённое состояние
   */
  restore() {
    this.canvasCtx.restore();
  }

  /**
   * Рисование определённых фигур
   */
  draw(shape: TTools, options: TShapeOptions) {
    const shapeCapitalized = shape[0].toUpperCase() + shape.slice(1);
    const methodName = ('draw' + shapeCapitalized) as TDrawShapesMethods;

    this.save();
    this.applyTranslateByOffsets();
    this.scale(this.values.scale, this.values.scale);

    const instance = this[methodName](options);

    this.restore();

    return instance;
  }

  /**
   * Рисование через уже готовый инстанс
   */
  polyDraw(shape: TShapes) {
    this.save();

    this.applyTranslateByOffsets();
    this.scale(this.values.scale, this.values.scale);

    shape.draw();

    this.restore();
  }

  /**
   * Получить экземпляр фигуры
   */
  getInstance(shape: TTools, options: TShapeOptions) {
    options.justGetInstance = true;

    const shapeCapitalized = shape[0].toUpperCase() + shape.slice(1);
    const methodName = ('draw' + shapeCapitalized) as TDrawShapesMethods;

    this.save();
    this.applyTranslateByOffsets();
    this.scale(this.values.scale, this.values.scale);

    const instance = this[methodName](options);

    this.restore();

    return instance;
  }

  /**
   * Рисование кисточкой
   */
  drawBrush(options: TShapeOptions) {
    const brush = new Brush(this.canvasCtx, options);
    if (!options.justGetInstance) brush.draw();

    return brush;
  }

  /**
   * Рисование квадрата
   */
  drawSquare(options: TShapeOptions) {
    const square = new Square(this.canvasCtx, options);
    if (!options.justGetInstance) square.draw();

    return square;
  }

  /**
   * Рисование круга
   */
  drawCircle(options: TShapeOptions) {
    const circle = new Circle(this.canvasCtx, options);
    if (!options.justGetInstance) circle.draw();

    return circle;
  }

  /**
   * Рисование треугольника
   */
  drawTriangle(options: TShapeOptions) {
    const triangle = new Triangle(this.canvasCtx, options);
    if (!options.justGetInstance) triangle.draw();

    return triangle;
  }

  /**
   * Действия в конце рисования
   */
  endAction(selectedShapeId?: string) {
    this.getImage(this.canvasNode.width, this.canvasNode.height).then((image: TArtImage) => {
      const nextActiveImage = this.values.activeImage + 1;
      const nextImages = [
        ...this.values.images.imagesNodes.slice(0, this.values.activeImage + 1),
        image,
      ];

      this.callbacks.setImagesNodes(nextImages);
      this.callbacks.setActiveImage(nextActiveImage);

      if (!selectedShapeId) return;
      const shapeInstance = this.values.images.shapes.find((shape) => shape.id === selectedShapeId);
      if (!shapeInstance) return;

      this.updateShapes(shapeInstance);
    });
  }

  /**
   * Очистить канвас и сбросить всё по умолчанию
   */
  clearCanvasAndResetAll() {
    this.clearCanvasPicture();
    this.endAction();
    this.callbacks.resetAllToDefault();
  }

  /**
   * Шаг назад
   */
  undo() {
    this.callbacks.setActiveImage(Math.max(this.values.activeImage - 1, 0));
  }

  /**
   * Шаг вперёд
   */
  redo() {
    this.callbacks.setActiveImage(
      Math.min(this.values.activeImage + 1, this.values.images.imagesNodes.length - 1)
    );
  }

  /**
   * Очистить снапшоты
   */
  clearImages() {
    const newImages = [...this.values.images.imagesNodes];
    newImages.length = 1;

    this.callbacks.setActiveImage(0);
    this.callbacks.setImages({
      imagesNodes: newImages,
      shapes: [],
      shapesHistory: [],
    });
  }

  /**
   * Переключатель стёрки
   */
  eraserToggle() {
    this.callbacks.setEraserActive(!this.values.eraserActive);
  }

  /**
   * Переключатель заливки
   */
  bucketToggle() {
    this.callbacks.setBucketActive(!this.values.bucketActive);
  }

  /**
   * Изменение приближения
   */
  zoomAction(delta: number) {
    this.callbacks.setScale(Math.min(Math.max(this.values.scale + delta, 0.1), 2));
  }

  /**
   * Процесс рисования
   */
  inDrawingProcess(
    snapshot: ImageData,
    {
      isPanning,
      isCtrlPressed,
      startX,
      startY,
      startPanX,
      startPanY,
      x,
      y,
      xWithOffset,
      yWithOffset,
      initialCoords,
      panOffset,
    }: TDrawingOptions & Partial<TShapeOptions>
  ) {
    if (this.values.bucketActive) return;

    // Panning action
    if (isPanning) {
      const deltaX = xWithOffset - startPanX;
      const deltaY = yWithOffset - startPanY;

      this.callbacks.setPanOffset({
        x: this.values.panOffset.x + deltaX,
        y: this.values.panOffset.y + deltaY,
      });

      return;
    }

    if (isCtrlPressed || !snapshot) return;

    this.putImageData(snapshot, 0, 0);

    if (this.values.eraserActive) {
      this.fillEraser({
        width: this.values.brushWidth,
        bgColor: this.values.bgColor,
        x: x + this.values.panOffset.x,
        y: y + this.values.panOffset.y,
      });

      return;
    }

    if (isCtrlPressed) {
      return;
    }

    this.draw(this.values.activeTool, {
      bgColor: this.values.bgColor,
      brushWidth: this.values.brushWidth,
      brushColor: this.values.brushColor,
      x,
      y,
      isFilled: this.values.fillColor,
      startCoords: {
        x: startX,
        y: startY,
      },
      initialCoords,
      panOffset,
    });
  }

  /**
   * Обновить все фигуры
   */
  updateShapes(shape: TShapes) {
    const shapeCopy = doShapeCopy(shape);
    const shapeStepCopy = [
      ...this.values.images.shapes.filter((shape) => shape.id !== shapeCopy.id),
      shapeCopy,
    ];
    const allShapesCopy = [...this.values.images.shapesHistory, shapeStepCopy];

    this.callbacks.setShapesHistory(allShapesCopy);
  }

  /**
   * Сделать видимыми все фигуры
   */
  makeVisibleAllShapes() {
    let shapesStepHistory = this.values.images.shapesHistory[this.values.activeImage - 1];

    if (!shapesStepHistory) {
      if (this.values.eraserActive) shapesStepHistory = this.values.images.shapesHistory.at(-1);
      else return this.clearCanvasPicture();
    }

    const shapesUpdatedCopy = shapesStepHistory.map((shape) => {
      const shapeCopy = doShapeCopy(shape);
      shapeCopy.ctx = this.canvasCtx;

      return shapeCopy;
    });

    this.callbacks.setShapes(shapesUpdatedCopy);

    this.clearCanvasPicture();
    shapesUpdatedCopy.forEach((shape) => this.polyDraw(shape));
  }

  /**
   * Инициализация базового полотна
   */
  initBaseLayout() {
    if (this.values.images.imagesNodes.length) return;

    this.fillBgOpacityColor();

    this.getBinary().then((blob) => {
      const image = new Image() as TArtImage;
      image.src = URL.createObjectURL(blob);
      this.callbacks.setImagesNodes([...this.values.images.imagesNodes, image]);
    });
  }

  /**
   * === Тестовые методы ===
   */

  /**
   * Нарисовать с учётом смещения
   */
  drawByOffsets(shape: TShapes) {
    this.polyDraw(shape);
  }

  /**
   * Действия при движении указателя
   */
  onPointerMove(shape: TShapes, movementX: number, movementY: number) {
    shape.options.x += movementX;
    shape.options.y += movementY;
    shape.options.startCoords.x += movementX;
    shape.options.startCoords.y += movementY;

    shape.options.initialCoords.x += movementX;
    shape.options.initialCoords.y += movementY;
    shape.options.initialCoords.startCoords.x += movementX;
    shape.options.initialCoords.startCoords.y += movementY;
  }

  /**
   * Применить translate с учётом всех смещений
   */
  applyTranslateByOffsets() {
    const { x, y } = this.getCoordsByScaleOffsets(this.values.scale);

    this.translate(
      this.values.panOffset.x * this.values.scale - x,
      this.values.panOffset.y * this.values.scale - y
    );
  }
}

export default ArtManager;

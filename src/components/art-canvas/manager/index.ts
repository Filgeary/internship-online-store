import Square from '../shapes/square';
import Brush from '../shapes/brush';
import Circle from '../shapes/cirlce';
import Triangle from '../shapes/triangle';

import { TShapeOptions } from '../shapes/types';
import { TArtImage, TTools } from '@src/store/art/types';
import { TDrawShapesMethods } from './types';

type TDrawOptions = {
  scale: number;
  panOffset: {
    x: number;
    y: number;
  };
  scaleOffsetX: number;
  scaleOffsetY: number;
};

class ArtManager {
  canvasNode: HTMLCanvasElement;
  canvasCtx: CanvasRenderingContext2D;
  isInited: boolean;

  init(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvasNode = canvas;
    this.canvasCtx = ctx;
    this.isInited = true;
  }

  /**
   * Инициализационное рисование канваса
   */
  initDrawAll(image: TArtImage, { scale, panOffset, scaleOffsetX, scaleOffsetY }: TDrawOptions) {
    this.clearCanvasPicture();

    this.save();
    this.translate(panOffset.x * scale - scaleOffsetX, panOffset.y * scale - scaleOffsetY);
    this.scale(scale, scale);

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
  downloadCanvas(bgColor: string) {
    // Для заднего фона на загружаемой картинке
    this.canvasCtx.globalCompositeOperation = 'destination-over';
    this.canvasCtx.fillStyle = bgColor;
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
   * Трансформация
   */
  setTransform(...args: number[]) {
    this.canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
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

    return this[methodName](options);
  }

  /**
   * Получить экземпляр фигуры
   */
  getInstance(shape: TTools, options: TShapeOptions) {
    options.justGetInstance = true;

    const shapeCapitalized = shape[0].toUpperCase() + shape.slice(1);
    const methodName = ('draw' + shapeCapitalized) as TDrawShapesMethods;

    return this[methodName](options);
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
}

export const artManager = new ArtManager();

export default ArtManager;

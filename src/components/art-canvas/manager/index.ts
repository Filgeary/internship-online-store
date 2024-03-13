import { TArtImage, TTools } from '@src/store/art/types';
import brush from '../shapes/brush';
import { TShapeOptions } from '../shapes/types';
import square from '../shapes/square';
import cirlce from '../shapes/cirlce';
import triangle from '../shapes/triangle';
import { TDrawShapesMethods } from './types';

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
  getImage(width: number, height: number): Promise<HTMLImageElement> {
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
   * Рисование определённых фигур
   */
  draw(shape: TTools, options: TShapeOptions) {
    const shapeCapitalized = shape[0].toUpperCase() + shape.slice(1);
    const methodName = ('draw' + shapeCapitalized) as TDrawShapesMethods;

    this[methodName](options);
  }

  /**
   * Рисование кисточкой
   */
  drawBrush(options: TShapeOptions) {
    brush.draw(this.canvasCtx, options);
  }

  /**
   * Рисование квадрата
   */
  drawSquare(options: TShapeOptions) {
    square.draw(this.canvasCtx, options);
  }

  /**
   * Рисование круга
   */
  drawCircle(options: TShapeOptions) {
    cirlce.draw(this.canvasCtx, options);
  }

  /**
   * Рисование треугольника
   */
  drawTriangle(options: TShapeOptions) {
    triangle.draw(this.canvasCtx, options);
  }
}

export const artManager = new ArtManager();

export default ArtManager;

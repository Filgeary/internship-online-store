import Shape from '..';
import { TShapeOptions } from '../types';

class Triangle extends Shape {
  draw(ctx: CanvasRenderingContext2D, options: TShapeOptions): void {
    ctx.beginPath();
    ctx.fillStyle = options.brushColor;
    ctx.lineWidth = options.brushWidth;

    ctx.moveTo(options.startCoords.x, options.startCoords.y);
    ctx.lineTo(options.x, options.y);
    // Нижняя линия треугольника
    ctx.lineTo(options.startCoords.x * 2 - options.x, options.y);
    ctx.closePath();

    if (options.isFilled) ctx.fill();
    else ctx.stroke();
  }
}

export default new Triangle();

import Shape from '..';
import { TShapeOptions } from '../types';

class Circle extends Shape {
  draw(ctx: CanvasRenderingContext2D, options: TShapeOptions): void {
    ctx.beginPath();
    ctx.fillStyle = options.brushColor;
    ctx.lineWidth = options.brushWidth;

    const radius = Math.sqrt(
      Math.pow(options.startCoords.x - options.x, 2) +
        Math.pow(options.startCoords.y - options.y, 2)
    );
    ctx.arc(options.startCoords.x, options.startCoords.y, radius, 0, 2 * Math.PI);

    if (options.isFilled) ctx.fill();
    else ctx.stroke();
  }
}

export default new Circle();

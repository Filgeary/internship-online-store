import Shape from '..';
import { TShapeOptions } from '../types';

class Square extends Shape {
  draw(ctx: CanvasRenderingContext2D, options: TShapeOptions): void {
    if (!options.isFilled) {
      ctx.lineWidth = options.brushWidth;
      ctx.strokeStyle = options.brushColor;
      ctx.strokeRect(
        options.x,
        options.y,
        options.startCoords.x - options.x,
        options.startCoords.y - options.y
      );
    } else {
      ctx.fillStyle = options.brushColor;
      ctx.fillRect(
        options.x,
        options.y,
        options.startCoords.x - options.x,
        options.startCoords.y - options.y
      );
    }
  }
}

export default new Square();

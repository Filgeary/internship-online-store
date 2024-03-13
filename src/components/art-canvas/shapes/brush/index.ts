import Shape from '..';
import { TShapeOptions } from '../types';

class Brush extends Shape {
  draw(ctx: CanvasRenderingContext2D, options: TShapeOptions): void {
    ctx.lineWidth = options.brushWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = options.brushColor;
    ctx.lineTo(options.x, options.y);
    ctx.stroke();
  }
}

export default new Brush();

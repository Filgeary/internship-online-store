import Shape from '..';
import { TShapeOptions } from '../types';

class Brush extends Shape {
  constructor(ctx: CanvasRenderingContext2D, options: TShapeOptions) {
    super(options.panOffset);
    this.ctx = ctx;
    this.options = JSON.parse(JSON.stringify(options));
  }

  draw(): void {
    this.ctx.lineWidth = this.options.brushWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = this.options.brushColor;
    this.ctx.lineTo(this.options.x, this.options.y);
    this.ctx.stroke();
  }

  mouseIn(): boolean {
    return false;
  }

  getArea(): number {
    return 1000;
  }

  fillArea(color: string): void {}
}

export default Brush;

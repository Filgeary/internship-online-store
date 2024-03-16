import shallowEqual from 'shallowequal';
import Shape from '..';
import { TShapeOptions } from '../types';

class Brush extends Shape {
  constructor(ctx: CanvasRenderingContext2D, options: TShapeOptions) {
    super();
    this.ctx = ctx;
    this.options = options;
  }

  // draw() {
  //   this.points.forEach((dot) => {
  //     this.drawDot(dot.x, dot.y);
  //   });
  // }

  draw(): void {
    this.ctx.lineWidth = this.options.brushWidth;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.options.brushColor;
    this.ctx.lineTo(this.options.x, this.options.y);
    this.ctx.stroke();
  }

  mouseIn(coords: { x: number; y: number }): boolean {
    return false;
  }
}

export default Brush;

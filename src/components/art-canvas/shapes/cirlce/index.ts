import Shape from '..';
import { TShapeOptions } from '../types';

class Circle extends Shape {
  radius: number;

  constructor(ctx: CanvasRenderingContext2D, options: TShapeOptions) {
    super();
    this.ctx = ctx;
    this.options = options;
  }

  draw(): void {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.options.brushColor;
    this.ctx.lineWidth = this.options.brushWidth;

    this.radius = Math.sqrt(
      Math.pow(this.options.startCoords.x - this.options.x, 2) +
        Math.pow(this.options.startCoords.y - this.options.y, 2)
    );
    this.ctx.arc(
      this.options.startCoords.x,
      this.options.startCoords.y,
      this.radius,
      0,
      2 * Math.PI
    );

    if (this.options.isFilled) this.ctx.fill();
    else this.ctx.stroke();
  }

  mouseIn(coords: { x: number; y: number }): boolean {
    return (
      coords.x >= this.options.startCoords.x - this.radius &&
      coords.x <= this.options.startCoords.x + this.radius &&
      coords.y >= this.options.startCoords.y - this.radius &&
      coords.y <= this.options.startCoords.y + this.radius
    );
  }
}

export default Circle;

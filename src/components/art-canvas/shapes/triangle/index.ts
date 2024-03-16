import Shape from '..';
import { TShapeOptions } from '../types';

class Triangle extends Shape {
  constructor(ctx: CanvasRenderingContext2D, options: TShapeOptions) {
    super(options.panOffset);
    this.ctx = ctx;
    this.options = options;
  }

  draw(): void {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.options.brushColor;
    this.ctx.lineWidth = this.options.brushWidth;

    this.ctx.moveTo(this.options.startCoords.x, this.options.startCoords.y);
    this.ctx.lineTo(this.options.x, this.options.y);
    // Нижняя линия треугольника
    this.ctx.lineTo(this.options.startCoords.x * 2 - this.options.x, this.options.y);
    this.ctx.closePath();

    if (this.options.isFilled) this.ctx.fill();
    else this.ctx.stroke();
  }

  mouseIn(coords: { x: number; y: number }): boolean {
    return (
      (coords.x >= this.options.startCoords.x &&
        coords.x <= this.options.x &&
        coords.y >= this.options.startCoords.y &&
        coords.y <= this.options.y) ||
      (coords.x < this.options.startCoords.x &&
        coords.y < this.options.startCoords.y &&
        coords.x > this.options.x &&
        coords.y > this.options.y)
    );
  }
}

export default Triangle;

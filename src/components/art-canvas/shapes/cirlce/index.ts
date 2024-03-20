import Shape from '..';
import { TCoords, TShapeOptions } from '../types';

class Circle extends Shape {
  radius: number;

  constructor(ctx: CanvasRenderingContext2D, options: TShapeOptions) {
    super(options.panOffset);
    this.ctx = ctx;
    this.options = JSON.parse(JSON.stringify(options));

    this.radius = Math.sqrt(
      Math.pow(this.options.startCoords.x - this.options.x, 2) +
        Math.pow(this.options.startCoords.y - this.options.y, 2)
    );
  }

  draw(): void {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.options.brushColor;
    this.ctx.fillStyle = this.options.brushColor;
    this.ctx.lineWidth = this.options.brushWidth;

    this.ctx.arc(
      this.options.startCoords.x,
      this.options.startCoords.y,
      this.radius,
      0,
      2 * Math.PI
    );

    if (this.options.isFilled) this.fillArea(this.options.fillColor);
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

  getArea(): number {
    const area = Math.PI * this.radius ** 2;
    return area / 10;
  }

  fillArea(color: string, coords: TCoords = { x: 0, y: 0 }, scale: number = 1): void {
    this.ctx.save();
    this.ctx.translate(coords.x, coords.y);
    this.ctx.scale(scale, scale);

    this.options.isFilled = true;
    this.options.fillColor = color;

    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = this.options.brushColor;
    this.ctx.lineWidth = this.options.brushWidth;

    this.ctx.arc(
      this.options.startCoords.x,
      this.options.startCoords.y,
      this.radius,
      0,
      2 * Math.PI
    );
    this.ctx.closePath();

    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.restore();
  }
}

export default Circle;

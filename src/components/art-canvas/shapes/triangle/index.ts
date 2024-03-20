import Shape from '..';
import { TShapeOptions } from '../types';

class Triangle extends Shape {
  constructor(ctx: CanvasRenderingContext2D, options: TShapeOptions) {
    super(options.panOffset);
    this.ctx = ctx;
    this.options = JSON.parse(JSON.stringify(options));
  }

  draw(): void {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.options.brushColor;
    this.ctx.fillStyle = this.options.brushColor;
    this.ctx.lineWidth = this.options.brushWidth;

    this.ctx.moveTo(this.options.startCoords.x, this.options.startCoords.y);
    this.ctx.lineTo(this.options.x, this.options.y);
    // Нижняя линия треугольника
    this.ctx.lineTo(this.options.startCoords.x * 2 - this.options.x, this.options.y);
    this.ctx.closePath();

    if (this.options.isFilled) this.fillArea(this.options.fillColor);
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

  getArea(): number {
    const width = Math.abs(this.options.x - this.options.startCoords.x);
    const height = Math.abs(this.options.y - this.options.startCoords.y);

    const area = width * height;

    return area / 10;
  }

  fillArea(color: string): void {
    this.options.isFilled = true;
    this.options.fillColor = color;

    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = this.options.brushColor;
    this.ctx.lineWidth = this.options.brushWidth;

    this.ctx.moveTo(this.options.startCoords.x, this.options.startCoords.y);
    this.ctx.lineTo(this.options.x, this.options.y);
    // Нижняя линия треугольника
    this.ctx.lineTo(this.options.startCoords.x * 2 - this.options.x, this.options.y);
    this.ctx.closePath();

    this.ctx.fill();
    this.ctx.stroke();
  }
}

export default Triangle;

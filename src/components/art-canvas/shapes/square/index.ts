import Shape from '..';
import { TShapeOptions } from '../types';

class Square extends Shape {
  constructor(ctx: CanvasRenderingContext2D, options: TShapeOptions) {
    super(options.panOffset);
    this.ctx = ctx;
    this.options = options;
  }

  draw(): void {
    if (!this.options.isFilled) {
      this.ctx.lineWidth = this.options.brushWidth;
      this.ctx.strokeStyle = this.options.brushColor;
      this.ctx.strokeRect(
        this.options.x,
        this.options.y,
        this.options.startCoords.x - this.options.x,
        this.options.startCoords.y - this.options.y
      );
    } else this.fillArea(this.options.fillColor ?? this.options.brushColor);
  }

  mouseIn(coords: { x: number; y: number }) {
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

  fillArea(color: string) {
    this.options.isFilled = true;
    this.options.fillColor = color;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      this.options.x,
      this.options.y,
      this.options.startCoords.x - this.options.x,
      this.options.startCoords.y - this.options.y
    );

    // Для границы
    this.ctx.lineWidth = this.options.brushWidth;
    this.ctx.strokeStyle = this.options.brushColor;
    this.ctx.strokeRect(
      this.options.x,
      this.options.y,
      this.options.startCoords.x - this.options.x,
      this.options.startCoords.y - this.options.y
    );
  }
}

export default Square;

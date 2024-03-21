import Shape from '..';
import { TCoords, TShapeOptions } from '../types';

class Square extends Shape {
  constructor(ctx: CanvasRenderingContext2D, options: TShapeOptions) {
    super(options.panOffset);
    this.ctx = ctx;
    this.options = JSON.parse(JSON.stringify(options));
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
    } else this.fillArea(this.options.fillColor);
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

    // Для корректной обводки
    this.ctx.lineWidth = this.options.brushWidth;
    this.ctx.strokeStyle = this.options.brushColor;
    this.ctx.strokeRect(
      this.options.x,
      this.options.y,
      this.options.startCoords.x - this.options.x,
      this.options.startCoords.y - this.options.y
    );
  }

  mouseIn(coords: { x: number; y: number }) {
    const x1 = Math.min(this.options.startCoords.x, this.options.x);
    const x2 = Math.max(this.options.startCoords.x, this.options.x);

    const y1 = Math.min(this.options.startCoords.y, this.options.y);
    const y2 = Math.max(this.options.startCoords.y, this.options.y);

    return coords.x >= x1 && coords.x <= x2 && coords.y >= y1 && coords.y <= y2;
  }

  getArea(): number {
    const width = Math.abs(this.options.x - this.options.startCoords.x);
    const height = Math.abs(this.options.y - this.options.startCoords.y);

    const area = width * height;

    return area / 10;
  }
}

export default Square;

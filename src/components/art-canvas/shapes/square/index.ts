import Shape from '..';
import { TShapeOptions } from '../types';

type TSquareCoords = {
  x: number;
  y: number;
};

class Square extends Shape {
  constructor(ctx: CanvasRenderingContext2D, options: TShapeOptions) {
    super();
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
    } else {
      this.ctx.fillStyle = this.options.brushColor;
      this.ctx.fillRect(
        this.options.x,
        this.options.y,
        this.options.startCoords.x - this.options.x,
        this.options.startCoords.y - this.options.y
      );
    }
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
}

export default Square;

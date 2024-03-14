import { TShapeOptions } from './types';

abstract class Shape {
  id: string;
  name: string;
  ctx: CanvasRenderingContext2D;
  options: TShapeOptions;

  constructor() {
    this.id = window.crypto.randomUUID();
  }

  abstract draw(ctx: CanvasRenderingContext2D, options: TShapeOptions): void;

  abstract mouseIn(coords: { x: number; y: number }): boolean;
}

export default Shape;

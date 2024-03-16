import { TCoords, TShapeOptions } from './types';

abstract class Shape {
  id: string;
  name: string;
  ctx: CanvasRenderingContext2D;
  options: TShapeOptions;
  panOffset: TCoords;

  constructor(panOffset: TCoords) {
    this.id = window.crypto.randomUUID();
    this.panOffset = panOffset;
  }

  abstract draw(ctx: CanvasRenderingContext2D, options: TShapeOptions): void;

  abstract mouseIn(coords: { x: number; y: number }): boolean;
}

export default Shape;

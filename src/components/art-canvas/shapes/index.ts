import { TShapeOptions } from './types';

abstract class Shape {
  name: string;
  ctx: CanvasRenderingContext2D;
  options: TShapeOptions;

  abstract draw(ctx: CanvasRenderingContext2D, options: TShapeOptions): void;

  abstract mouseIn(coords: { x: number; y: number }): boolean;
}

export default Shape;

import { TShapeOptions } from './types';

abstract class Shape {
  name: string;

  abstract draw(ctx: CanvasRenderingContext2D, options: TShapeOptions): void;
}

export default Shape;

abstract class Shape {
  stroke: number;
  color: string;
  ctx: CanvasRenderingContext2D;
  offsetX: number;
  offsetY: number;
  constructor(
    stroke: number,
    color: string,
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number
  ) {
    this.stroke = stroke;
    this.color = color;
    this.ctx = ctx;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  abstract draw(): void;
  abstract mouseInShape(x: number, y: number): boolean;
}

export default Shape;

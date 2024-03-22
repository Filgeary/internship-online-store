abstract class Shape {
  stroke: number;
  color: string;
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
  fill?: boolean;
  constructor(
    stroke: number,
    color: string,
    offsetX: number,
    offsetY: number,
    startX: number,
    startY: number,
    fill?: boolean
  ) {
    this.stroke = stroke;
    this.color = color;
    this.fill = fill;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.startX = startX;
    this.startY = startY;
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
  move(x: number, y: number) {
    this.startX = x;
    this.startY = y;
  }
  abstract mouseInShape(x: number, y: number): boolean;
  changePath(x: number, y: number) {
    this.offsetX = x;
    this.offsetY = y;
  }
}

export default Shape;

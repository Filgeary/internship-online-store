import Shape from "@src/pages/canvas/components/canvas/core/shapes/index";
import {keysShape} from "@src/pages/canvas/components/canvas/core/shapes/types";

type Point = {
  x: number;
  y: number;
};

class Triangle extends Shape {
  private thirdX: number;
  private thirdY: number;
  public endX: number;
  public endY: number;

  constructor(name: keysShape, startX: number, startY: number, lineWidth: number, color: string, filling: boolean, fillingColor?: Color, endX?: number, endY?: number) {
    super(name, startX, startY, lineWidth, color, filling, fillingColor);
    this.endX = startX + 30;
    this.endY = startY ;
    this.thirdX = this.startX - (this.startX - 30 - this.startX) / 2;
    this.thirdY = this.startY - Math.sqrt(3) / 2 * Math.abs(this.startY - 30 - this.startY);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.startX + this.centerX, this.startY + this.centerY);
    ctx.lineTo(this.endX + this.centerX, this.endY + this.centerY);
    ctx.lineTo(this.thirdX + this.centerX, this.thirdY + this.centerY);
    ctx.closePath();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    if (this.filling && this.fillingColor) {
      ctx.fillStyle = this.fillingColor;
      ctx.fill()
    }
  }

  movingWhileDrawing(x: number, y: number): void {
    this.endX = x;
    this.endY = y;
    this.thirdX = this.startX + (x - this.startX) / 2;
    this.thirdY = this.startY - Math.sqrt(3) / 2 * Math.abs(x - this.startX);
  }
  public isPointInside(x: number, y: number): boolean {
    // Используем метод, проверяющий, находится ли точка внутри треугольника, с учетом погрешности
    const A = { x: this.startX + this.centerX, y: this.startY + this.centerY };
    const B = { x: this.endX + this.centerX, y: this.endY + this.centerY };
    const C = { x: this.thirdX + this.centerX, y: this.thirdY + this.centerY };

    const sign = (p1: Point, p2: Point, p3: Point) => {
      return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    };

    const d1 = sign({ x, y }, A, B);
    const d2 = sign({ x, y }, B, C);
    const d3 = sign({ x, y }, C, A);

    const hasNegative = (d1 < -this.inaccuracy) || (d2 < -this.inaccuracy) || (d3 < -this.inaccuracy);
    const hasPositive = (d1 > this.inaccuracy) || (d2 > this.inaccuracy) || (d3 > this.inaccuracy);

    return !(hasNegative && hasPositive);
  }
  public calculateCenter(): void {
    // Центр треугольника будет находиться в центре между его вершинами
    this.centerX = (this.startX + this.endX + this.thirdX) / 3;
    this.centerY = (this.startY + this.endY + this.thirdY) / 3;
  }
  public getDimensions(): { width: number; height: number } {
    const minX = Math.min(this.startX, this.endX, this.thirdX);
    const maxX = Math.max(this.startX, this.endX, this.thirdX);
    const minY = Math.min(this.startY, this.endY, this.thirdY);
    const maxY = Math.max(this.startY, this.endY, this.thirdY);

    const width = maxX - minX;
    const height = maxY - minY;

    return { width, height };
  }
}

export default Triangle;

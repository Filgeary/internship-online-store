import Shape from "@src/pages/canvas/components/canvas/core/shapes/index";
import {keysShape} from "@src/pages/canvas/components/canvas/core/shapes/types";

class StraightLine extends Shape {
  public endX: number;
  public endY: number;
  constructor(name: keysShape, startX: number, startY: number, lineWidth: number, color: string, filling: boolean, fillingColor?: Color, endX?: number, endY?: number) {
    super(name, startX, startY, lineWidth, color, filling, fillingColor);
    this.endX = startX;
    this.endY = startY;
  }
  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.centerX + this.startX, this.centerY + this.startY);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = this.lineWidth;
    ctx.lineTo(this.centerX + this.endX, this.centerY + this.endY);
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }
  public movingWhileDrawing(x: number, y: number) {
    this.endX = this.centerX + x;
    this.endY = this.centerY + y;
  }
  public isPointInside(x: number, y: number): boolean {
    // Точка находится на линии, если расстояние от точки до центра линии меньше или равно погрешности
    const distance = Math.abs((this.endY - this.startY) * (x - (this.centerX + this.startX)) - (this.endX - this.startX) * (y - (this.centerY + this.startY))) / Math.sqrt((this.endY - this.startY) ** 2 + (this.endX - this.startX) ** 2);
    return distance <= this.inaccuracy;
  }
  public calculateCenter(): void {
    // Центр прямой линии будет находиться на её середине
    this.centerX = (this.startX - this.endX);
    this.centerY = (this.startY - this.endY);
  }

  public getDimensions(): { width: number; height: number } {
    const width = Math.abs(this.endX - this.startX);
    const height = Math.abs(this.endY - this.startY);
    return { width, height };
  }
}

export default StraightLine;

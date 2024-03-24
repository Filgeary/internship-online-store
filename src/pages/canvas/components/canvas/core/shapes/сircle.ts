import Shape from "@src/pages/canvas/components/canvas/core/shapes/index";
import {keysShape} from "@src/pages/canvas/components/canvas/core/shapes/types";

class Circle extends Shape {
  private radius: number;

  constructor(name: keysShape, startX: number, startY: number, lineWidth: number, color: string, filling: boolean, fillingColor?: Color, endX?: number, endY?: number) {
    super(name, startX, startY, lineWidth, color, filling, fillingColor);
    // Рассчитываем радиус круга по координатам центра и одной из точек на окружности
    this.radius = 10;
    this.calculateCenter()
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    if (this.filling && this.fillingColor) {
      ctx.fillStyle = this.fillingColor;
      ctx.fill()
    }
  }
  public movingWhileDrawing(x: number, y: number): void {
    // Вычисляем новый радиус на основе координат центра и текущих координат мыши
    this.radius = Math.sqrt(Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2));
    this.calculateCenter()
  }
  public isPointInside(x: number, y: number): boolean {
    const distance = Math.sqrt((x - this.centerX) ** 2 + (y - this.centerY) ** 2);
    return (distance - this.radius) <= this.inaccuracy;
  }

  // Реализация метода для вычисления центра круга
  public calculateCenter(): void {
    // Центр круга находится в его координатах startX и startY
    this.centerX = this.startX;
    this.centerY = this.startY;
  }

  public getDimensions(): { width: number; height: number } {
    const diameter = this.radius * 2;
    return { width: diameter, height: diameter };
  }
}

export default Circle;

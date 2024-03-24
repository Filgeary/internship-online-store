import Shape from "@src/pages/canvas/components/canvas/core/shapes/index";
import {keysShape} from "@src/pages/canvas/components/canvas/core/shapes/types";

class Rectangle extends Shape {
  private width: number = 10;
  private height: number = 10;

  constructor(name: keysShape, startX: number, startY: number, lineWidth: number, color: string, filling: boolean, fillingColor?: Color, endX?: number, endY?: number) {
    super(name, startX, startY, lineWidth, color, filling, fillingColor);
    this.calculateCenter()
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    const x = this.centerX - this.width / 2; // Вычисляем координаты верхнего левого угла прямоугольника
    const y = this.centerY - this.height / 2;
    ctx.rect(x, y, this.width, this.height);
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    if (this.filling && this.fillingColor) {
      ctx.fillStyle = this.fillingColor;
      ctx.fill()
    }
  }
  movingWhileDrawing(x: number, y: number): void {
    // Вычисляем новую ширину и высоту прямоугольника на основе координат начальной и текущих координат мыши
    this.width = x - this.startX;
    this.height = y - this.startY;
    this.calculateCenter()
  }
  public isPointInside(x: number, y: number): boolean {
    // Вычисляем границы прямоугольника относительно его центра
    const leftX = this.centerX - this.width / 2 - this.inaccuracy;
    const rightX = this.centerX + this.width / 2 + this.inaccuracy;
    const topY = this.centerY - this.height / 2 - this.inaccuracy;
    const bottomY = this.centerY + this.height / 2 + this.inaccuracy;

    // Проверяем, находится ли точка внутри границ прямоугольника
    const insideHorizontal = x >= leftX && x <= rightX;
    const insideVertical = y >= topY && y <= bottomY;

    return insideHorizontal && insideVertical;
  }

  // Реализация метода для вычисления центра прямоугольника
  public calculateCenter(): void {
    // Центр прямоугольника находится в его центре
    this.centerX = this.startX + this.width / 2;
    this.centerY = this.startY + this.height / 2;
  }

  public getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }
}
export default Rectangle;

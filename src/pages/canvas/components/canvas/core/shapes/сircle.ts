import Shape from "@src/pages/canvas/components/canvas/core/shapes/index";
import {keysShape} from "@src/pages/canvas/components/canvas/core/shapes/types";

class Circle extends Shape {
  private radius: number;

  constructor(name: keysShape, startX: number, startY: number, endX: number, endY: number, lineWidth: number, color: string, filling: boolean, fillingColor: Color) {
    super(name, startX, startY, endX, endY, lineWidth, color, filling, fillingColor);
    // Рассчитываем радиус круга по координатам центра и одной из точек на окружности
    this.radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.startX, this.startY, this.radius, 0, 2 * Math.PI);
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    if (this.filling) {
      ctx.fillStyle = this.fillingColor!;
      ctx.fill()
    }
  }

  movingWhileDrawing(x: number, y: number): void {
    // Вычисляем новый радиус на основе координат центра и текущих координат мыши
    this.radius = Math.sqrt(Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2));
  }
}

export default Circle;

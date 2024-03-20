import Shape from "@src/pages/canvas/components/canvas/core/shapes/index";
import {keysShape} from "@src/pages/canvas/components/canvas/core/shapes/types";

class Rectangle extends Shape {
  private width: number;
  private height: number;

  constructor(name: keysShape, startX: number, startY: number, endX: number, endY: number, lineWidth: number, color: string, filling: boolean, fillingColor: Color) {
    super(name, startX, startY, endX, endY, lineWidth, color, filling, fillingColor);

    this.width = Math.abs(endX - startX);
    this.height = Math.abs(endY - startY);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.rect(this.startX, this.startY, this.width, this.height);
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    if (this.filling) {
      ctx.fillStyle = this.fillingColor!;
      ctx.fill()
    }
  }

  movingWhileDrawing(x: number, y: number): void {
    // Вычисляем новую ширину и высоту прямоугольника на основе координат начальной и текущих координат мыши
    this.width = x - this.startX;
    this.height = y - this.startY;
  }
}
export default Rectangle;

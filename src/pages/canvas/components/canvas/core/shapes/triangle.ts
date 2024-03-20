import Shape from "@src/pages/canvas/components/canvas/core/shapes/index";
import {keysShape} from "@src/pages/canvas/components/canvas/core/shapes/types";

class Triangle extends Shape {
  private thirdX: number;
  private thirdY: number;

  constructor(name: keysShape, startX: number, startY: number, endX: number, endY: number, lineWidth: number, color: string, filling: boolean, fillingColor: Color) {
    super(name, startX, startY, endX, endY, lineWidth, color, filling, fillingColor);

    this.thirdX = startX + (endX - startX) / 2;
    this.thirdY = startY - Math.sqrt(3) / 2 * Math.abs(endX - startX);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.lineTo(this.thirdX, this.thirdY);
    ctx.closePath();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    if (this.filling) {
      ctx.fillStyle = this.fillingColor!;
      ctx.fill()
    }
  }

  movingWhileDrawing(x: number, y: number): void {
    this.endX = x;
    this.endY = y;
    this.thirdX = this.startX + (x - this.startX) / 2;
    this.thirdY = this.startY - Math.sqrt(3) / 2 * Math.abs(x - this.startX);
  }
}

export default Triangle;

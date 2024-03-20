import Shape from "@src/pages/canvas/components/canvas/core/shapes/index";
import {keysShape} from "@src/pages/canvas/components/canvas/core/shapes/types";

class Line extends Shape {
  private points: any[];
  constructor(name: keysShape, startX: number, startY: number, endX: number, endY: number, lineWidth: number, color: string, filling: boolean) {
    super(name, startX, startY, endX, endY, lineWidth, color, filling);
    this.points = [];
    this.points.push({x: startX, y: startY})
  }
  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineCap = 'round';
    ctx.lineWidth = this.lineWidth;

    ctx.strokeStyle = this.color;
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.stroke()
  }
  public movingWhileDrawing(x: number, y: number) {
    this.points.push({x, y})
  }
}

export default Line;

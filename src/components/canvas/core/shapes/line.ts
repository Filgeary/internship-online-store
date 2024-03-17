import { getSegmentLength } from "@src/utils/get-segment-length";
import Shape from "./shape";

class Line extends Shape {
  startX: number;
  startY: number;
  constructor(
    stroke: number,
    color: string,
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number,
    startX: number,
    startY: number
  ) {
    super(stroke, color, ctx, offsetX, offsetY);
    this.startX = startX;
    this.startY = startY;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.ctx.lineTo(this.offsetX, this.offsetY);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = this.stroke;
    this.ctx.stroke();
  }

  move(x: number, y: number) {
    this.startX = x;
    this.startY = y;
    // this.offsetX = this.startX - this.offsetX > 0 ? x + length;
    // this.offsetY = y + length;
  }

  mouseInShape(x: number, y: number) {
    const dx = Math.round((x - this.startX) *10 / (this.offsetX - this.startX)) / 10;
    const dy = Math.round((y - this.startY) *10 / (this.offsetY - this.startY)) /10;
    const onLine = Math.abs(dx) === Math.abs(dy);
    return onLine;
  }
}

export default Line;

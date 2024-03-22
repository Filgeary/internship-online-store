import { getSegmentLength } from "@src/utils/get-segment-length";
import Shape from "./shape";

class Line extends Shape {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.offsetX, this.offsetY);
    ctx.strokeStyle = this.color;
    ctx.lineCap = ctx.lineJoin = "round";
    ctx.lineWidth = this.stroke;
    ctx.stroke();
  }

  override move(x: number, y: number) {
    const dX = this.startX - this.offsetX;
    const dY = this.startY - this.offsetY;
    this.startX = x;
    this.startY = y;
    this.offsetX = this.startX - dX;
    this.offsetY = this.startY - dY;
  }

  mouseInShape(x: number, y: number) {
    if (
      this.startX < this.offsetX &&
      this.startY < this.offsetY &&
      ((x < this.startX && y < this.startY) ||
        (x > this.offsetX && y > this.offsetY))
    ) {
      return false;
    } else if (
      this.startX > this.offsetX &&
      this.startY < this.offsetY &&
      ((x > this.startX && y < this.startY) ||
        (x < this.offsetX && y > this.offsetY))
    ) {
      return false;
    } else if (
      this.startX < this.offsetX &&
      this.startY > this.offsetY &&
      ((x < this.startX && y > this.startY) ||
        (x > this.offsetX && y < this.offsetY))
    ) {
      return false;
    } else if (
      this.startX > this.offsetX &&
      this.startY > this.offsetY &&
      ((x < this.offsetX && y < this.offsetY) ||
        (x > this.startX && y > this.startY))
    ) {
      return false;
    }
    const dx =
      Math.round(((x - this.startX) * 10) / (this.offsetX - this.startX)) / 10;
    const dy =
      Math.round(((y - this.startY) * 10) / (this.offsetY - this.startY)) / 10;
    return dx === dy;
  }
}

export default Line;

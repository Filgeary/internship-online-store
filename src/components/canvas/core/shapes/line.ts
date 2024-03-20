import { getSegmentLength } from "@src/utils/get-segment-length";
import Shape from "./shape";

class Line extends Shape {

  draw() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.ctx.lineTo(this.offsetX, this.offsetY);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineCap = this.ctx.lineJoin = "round";
    this.ctx.lineWidth = this.stroke;
    this.ctx.stroke();
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

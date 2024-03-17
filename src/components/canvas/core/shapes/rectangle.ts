import Shape from "./shape";
import { Size } from "./type";

class Rectangle extends Shape {
  fill: boolean;
  startX: number;
  startY: number;
  size = {width: 0, height: 0};
  constructor(
    stroke: number,
    color: string,
    fill: boolean,
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number,
    startX: number,
    startY: number
  ) {
    super(stroke, color, ctx, offsetX, offsetY);
    this.fill = fill;
    this.startX = startX;
    this.startY = startY;
  }

  draw() {
    this.ctx.lineCap = "round";
    const path = new Path2D();
    path.rect(
      this.offsetX,
      this.offsetY,
      this.startX - this.offsetX,
      this.startY - this.offsetY
    );
    if (this.fill) {
      this.ctx.fillStyle = this.color;
      this.ctx.fill(path);
    } else {
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = this.stroke;
      this.ctx.stroke(path);
    }
    this.size = {
      width: this.startX - this.offsetX,
      height: this.startY - this.offsetY,
    };
  }

  move(x: number, y: number) {
    this.startX = x;
    this.startY = y;
    this.offsetX = x - this.size!.width;
    this.offsetY = y - this.size!.height;
  }

  mouseInShape(x: number, y: number) {
    const rotate = this.startY - this.offsetY > 0;
    if(!rotate) {
      if (
        this.size &&
        x < this.offsetX &&
        x > this.offsetX + this.size.width &&
        y < this.offsetY &&
        y > this.offsetY + this.size.height
      ) {
        return true;
      }
    } else if(this.size &&
        x > this.offsetX &&
        x < this.offsetX + this.size.width &&
        y > this.offsetY &&
        y < this.offsetY + this.size.height) {
          return true
        }


    return false;
  }
}

export default Rectangle;

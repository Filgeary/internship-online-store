import Shape from "./shape";
import { Size } from "./type";

class Rectangle extends Shape {
  size = {width: 0, height: 0};

  draw() {
    this.ctx.lineCap = this.ctx.lineJoin = "round";
    const path = new Path2D();
    this.ctx.beginPath();
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

  override move(x: number, y: number) {
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

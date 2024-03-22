import Shape from "./shape";
import { Size } from "./type";

class Rectangle extends Shape {
  size = { width: 0, height: 0 };

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineCap = "round";
    const path = new Path2D();
    ctx.beginPath();
    path.rect(
      this.offsetX,
      this.offsetY,
      this.startX - this.offsetX,
      this.startY - this.offsetY
    );
    if (this.fill) {
      ctx.fillStyle = this.color;
      ctx.fill(path);
    } else {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.stroke;
      ctx.stroke(path);
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
    if (!rotate) {
      if (
        this.size &&
        x < this.offsetX &&
        x > this.offsetX + this.size.width &&
        y < this.offsetY &&
        y > this.offsetY + this.size.height
      ) {
        return true;
      }
    } else if (
      this.size &&
      x > this.offsetX &&
      x < this.offsetX + this.size.width &&
      y > this.offsetY &&
      y < this.offsetY + this.size.height
    ) {
      return true;
    }
    return false;
  }
}

export default Rectangle;

import Shape from "./shape";

class Pencil extends Shape {
  constructor(
    stroke: number,
    color: string,
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number
  ) {
    super(stroke, color, ctx, offsetX, offsetY);
  }

  draw() {
    this.ctx.lineTo(this.offsetX, this.offsetY);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.stroke;
    this.ctx.stroke();
  }

  mouseInShape(x: number, y: number) {
    return false;
  }
}

export default Pencil;

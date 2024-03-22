import Shape from "./shape";

class Pencil extends Shape {
  path: Path2D;
  constructor(
    stroke: number,
    color: string,
    offsetX: number,
    offsetY: number,
    startX: number,
    startY: number
  ) {
    super(stroke, color, offsetX, offsetY, startX, startY);
    this.path = new Path2D();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.stroke;
    ctx.lineCap = ctx.lineJoin = "round";
    ctx.beginPath();
    this.path.lineTo(this.offsetX, this.offsetY);
    ctx.stroke(this.path);
  }

  mouseInShape(x: number, y: number) {
    return false;
  }
}

export default Pencil;

import Figure from "../figure";

class LinePath extends Figure {

  path: Path2D;

  constructor(x: number, y: number, color?: string, width?: number) {
    super(x, y, color, width);
    this.path = new Path2D();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    if(this.color) {
      ctx.strokeStyle = this.color;
    }
    if(this.width) {
      ctx.lineWidth = this.width;
    }
    ctx.lineCap = "round";
    ctx.stroke(this.path);
    ctx.restore();
  }

  drawing(ctx: CanvasRenderingContext2D, endX: number, endY: number) {
    this.path.moveTo(this.x, this.y);
    this.path.lineTo(endX, endY);
    ctx.save();
    if(this.color) {
      ctx.strokeStyle = this.color;
    }
    if(this.width) {
      ctx.lineWidth = this.width;
    }
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.restore();

    this.x = endX;
    this.y = endY;
  }

  insideFigure(x: number, y: number): boolean {
    return false;
  }

}

export default LinePath;

import { getSegmentLength } from "@src/utils/get-segment-length";
import Shape from "./shape";

class Triangle extends Shape {
  fill: boolean;
  startX: number;
  startY: number;
  size: {
    ab: number,
    bc: number,
    ca: number
  } | null = null;

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
    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.ctx.lineTo(this.offsetX, this.offsetY);
    this.ctx.lineTo(this.startX * 2 - this.offsetX, this.offsetY); //создание нижней линии
    this.ctx.closePath();
    this.ctx.lineCap = "round";
    if (this.fill) {
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = this.stroke;
      this.ctx.stroke();
    }
    this.size = {
      ab: getSegmentLength(
        this.startX,
        this.startY,
        this.offsetX,
        this.offsetY
      ),
      bc: getSegmentLength(
        this.offsetX,
        this.offsetY,
        this.startX * 2 - this.offsetX,
        this.offsetY
      ),
      ca: getSegmentLength(
        this.startX * 2 - this.offsetX,
        this.offsetY,
        this.startX,
        this.startY
      ),
    };
  }

  move(x: number, y: number) {
    const rotate = this.startY - this.offsetY > 0;
    this.startX = x;
    this.startY = y;
    this.offsetX = (x * 2 - this.size!.bc) / 2;

    if(rotate) {
      this.offsetY =
        y - Math.sqrt(Math.pow(this.size!.ab, 2) - Math.pow(this.size!.bc/2, 2));
    } else {
      this.offsetY =
        y +
        Math.sqrt(Math.pow(this.size!.ab, 2) - Math.pow(this.size!.bc / 2, 2));
    }
  }

  mouseInShape(x: number, y: number) {
    const area = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => {
      return (x1 - x3)*(y2 - y3) - (x2 - x3)*(y1 - y3);
    };

    const ax = this.startX;
    const ay = this.startY;
    const bx = this.offsetX;
    const by = this.offsetY;
    const cx = this.startX * 2 - this.offsetX;
    const cy = this.offsetY;

    const a = area(x, y, ax, ay, bx, by) < 0;
    const b = area(x, y, bx, by, cx, cy) < 0;
    const c = area(x, y, cx, cy, ax, ay) < 0;

    return a === b && b === c;
  }
}

export default Triangle;
